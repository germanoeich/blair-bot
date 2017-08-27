import Pokedex from 'pokedex-promise-v2'
import { TwinKeyCache } from '/lib/cache'
import Responder from '/lib/messages/responder'
import chalk from 'chalk'
import { renderImage } from '/bot/canvas/pokemon.js'
import { reorderArgs } from '/bot/util/pokemon-names.js'
const { log, error } = console

const info = {
  name: 'pokemon',
  args: '<Id | Name>',
  description: 'generates an image with pokemon info',
  alias: 'pokedex'
}

const cache = new TwinKeyCache(12)

async function action (msg, args) {
  const responder = new Responder(msg.channel)

  if (args.length === 0) {
    responder.bold('Please specify a pokemon ID or Name').send()
  }

  args = reorderArgs(args)
  const idOrName = args.join('-').toLowerCase()

  const P = new Pokedex()
  let pokeinfo

  log(chalk.cyan(`Pokedex received with args ${chalk.white.bgCyan(idOrName)}`))

  pokeinfo = cache.retrieve(idOrName)
  if (!pokeinfo) {
    try {
      msg._client.sendChannelTyping(msg.channel.id)
      pokeinfo = await P.getPokemonByName(idOrName)
      log(chalk.blue('Adding pokemon to cache'))
      cache.add(pokeinfo.id, pokeinfo.name, pokeinfo)
    } catch (e) {
      if (e.statusCode === 404) {
        return 'That pokemon does not exist, try something else'
      }

      error('ERR:', chalk.red(e))
      return `Shit happened when it shouldn't have. Most likely PokeAPI is having problems.`
    }
  }

  log(chalk.blue(`Got pokeinfo for ${chalk.white.bgBlue(pokeinfo.name)}`))

  try {
    msg._client.createMessage(msg.channel.id,
      {},
      {
        file: await renderImage(pokeinfo),
        name: `pokedex-${pokeinfo.name}.png`
      }
    )
  } catch (e) {
    error('ERR:', chalk.red(e))
    return `Shit happened when it shouldn't have. Most likely I fucked up (Canvas drawing err).`
  }
}

function register (bot) {
  bot.registerCommand('pokemon', action, info)
  bot.registerCommandAlias(info.alias, 'pokemon')
}

export default {
  info,
  register
}
