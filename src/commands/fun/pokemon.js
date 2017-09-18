import Pokedex from 'pokedex-promise-v2'
import { TwinKeyCache } from './../../lib/cache'
import Responder from './../../lib/messages/responder'
import chalk from 'chalk'
import { renderImage } from './../../canvas/pokemon'
import { reorderArgs } from './../../util/pokemon-names'
import BaseCommand from './../baseCommand'

export default class PokemonCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'pokemon',
      usage: '<Id | Name>',
      description: 'generates an image with pokemon info',
      fullDescription: 'generates an image with pokemon info',
      aliases: ['pokedex'],
      argsRequired: true
    }
    super(info, bot)

    this.cache = new TwinKeyCache(12)
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)

    if (args.length === 0) {
      responder.bold('Please specify a pokemon ID or Name').send()
    }

    args = reorderArgs(args)
    const idOrName = args.join('-').toLowerCase()

    const P = new Pokedex()
    let pokeinfo

    pokeinfo = this.cache.retrieve(idOrName)
    if (!pokeinfo) {
      try {
        msg._client.sendChannelTyping(msg.channel.id)
        pokeinfo = await P.getPokemonByName(idOrName)
        this.cache.add(pokeinfo.id, pokeinfo.name, pokeinfo)
      } catch (e) {
        if (e.statusCode === 404) {
          return 'That pokemon does not exist, try something else'
        }

        console.error('ERR:', chalk.red(e))
        return `Shit happened when it shouldn't have. Most likely PokeAPI is having problems.`
      }
    }

    try {
      msg._client.createMessage(msg.channel.id,
        {},
        {
          file: await renderImage(pokeinfo),
          name: `pokedex-${pokeinfo.name}.png`
        }
      )
    } catch (e) {
      console.error('ERR:', chalk.red(e))
      return `Shit happened when it shouldn't have. Most likely I fucked up (Canvas drawing err).`
    }
  }
}
