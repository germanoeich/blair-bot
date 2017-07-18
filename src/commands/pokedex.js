import Pokedex from 'pokedex-promise-v2'
import cache from './../util/cache.js'
import { renderImage } from './../image/pokemon.js'
import { reorderArgs } from './../util/pokemon-names'

let _bot

async function action (msg, args) {
  if (args.length < 1) {
    return 'Please specify a pokemon ID or Name'
  }

  args = reorderArgs(args)
  const idOrName = args.join('-').toLowerCase()

  const P = new Pokedex()
  let pokeinfo

  console.log('\x1b[36m', `Pokedex received with args "${idOrName}"`)

  pokeinfo = cache.retrieve(idOrName)
  if (!pokeinfo) {
    try {
      _bot.sendChannelTyping(msg.channel.id)
      pokeinfo = await P.getPokemonByName(idOrName)
      console.log('\x1b[34m', 'Adding pokemon to cache')
      cache.add(pokeinfo)
    } catch (e) {
      if (e.statusCode === 404) {
        return 'That pokemon does not exist, try something else'
      }

      console.error('ERR:', e)
      return `Shit happened when it shouldn't have. Detail: ${e.error.detail}`
    }
  }

  console.log('\x1b[34m', `Got pokeinfo for "${pokeinfo.name}"`)

  _bot.createMessage(msg.channel.id,
    {},
    {
      file: await renderImage(pokeinfo),
      name: `pokedex-${pokeinfo.name}.png`
    }
  )
}

function register (bot) {
  _bot = bot
  bot.registerCommand('pokedex', action, {
    description: 'Pokedex <Pokemon ID or Name>',
    fullDescription: 'Use to gather information about a pokemon'
  })
}

export default {
  register
}
