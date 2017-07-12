import Pokedex from 'pokedex-promise-v2'
import cache from './../util/cache.js'
import { renderImage } from './../image/pokemon.js'

let _bot

async function action (msg, args) {
  if (args.length < 1) {
    return 'Please specify a pokemon ID or Name'
  }

  if (args.length > 1) {
    return 'Specify only ONE pokemon at a time'
  }

  const P = new Pokedex()
  const idOrName = args[0].toLowerCase()
  let pokeinfo

  pokeinfo = cache.retrieve(idOrName)
  if (!pokeinfo) {
    try {
      _bot.sendChannelTyping(msg.channel.id)
      pokeinfo = await P.getPokemonByName(idOrName)
      console.log('Adding to cache')
      cache.add(pokeinfo)
    } catch (e) {
      if (e.statusCode === 404) {
        return 'That pokemon does not exist, try something else'
      }

      console.error('ERR:', e)
      return `Shit happened when it shouldn't have. Detail: ${e.error.detail}`
    }
  }

  let frontSprite = pokeinfo.sprites.front_default

  _bot.createMessage(msg.channel.id,
    {
      embed: {
        title: '',
        description: '',
        author: {
          name: _bot.user.username,
          icon_url: _bot.user.avatarURL
        },
        image: {
          url: frontSprite,
          width: 96,
          height: 96
        },
        color: 0x008000,
        fields: [
          {
            name: 'Pokemon Name',
            value: pokeinfo.name,
            inline: true
          },
          {
            name: 'Pokemon Id',
            value: pokeinfo.id,
            inline: true
          }
        ],
        footer: { // Footer text
          text: 'That\'s all folks'
        }
      }
    },
    {
      file: await renderImage(pokeinfo),
      name: 'test.png'
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
