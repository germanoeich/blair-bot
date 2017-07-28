import Pokedex from 'pokedex-promise-v2'
import { TwinKeyCache } from './../../lib/cache'
import chalk from 'chalk'
import { renderImage } from './../canvas/pokemon.js'
import { reorderArgs } from './../util/pokemon-names.js'
const { log, error } = console

let _bot
const cache = new TwinKeyCache(12)

async function action (msg, args) {
  if (args.length === 0) {
    return 'Please specify a pokemon ID or Name'
  }

  args = reorderArgs(args)
  const idOrName = args.join('-').toLowerCase()

  const P = new Pokedex()
  let pokeinfo

  log(chalk.cyan(`Pokedex received with args ${chalk.white.bgCyan(idOrName)}`))

  pokeinfo = cache.retrieve(idOrName)
  if (!pokeinfo) {
    try {
      _bot.sendChannelTyping(msg.channel.id)
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
    _bot.createMessage(msg.channel.id,
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
  _bot = bot
  bot.registerCommand('pokemon', action, {
    description: 'Pokemon <Pokemon ID or Name>',
    fullDescription: 'Used to gather information about a pokemon'
  })

  bot.registerCommandAlias('pokedex', 'pokemon')
}

export default {
  register
}
