import Pokedex from 'pokedex-promise-v2'

let _bot

async function action (msg, args) {
  if (args.length < 1) {
    return 'Please specify a pokemon ID or Name'
  }

  if (args.length > 1) {
    return 'Specify only ONE pokemon at a time'
  }

  let P = new Pokedex()
  let pokeinfo
  try {
    pokeinfo = await P.getPokemonByName(args[0].toLowerCase())
  } catch (e) {
    console.error('ERR:', e)
    return 'An error has occured:'
  }

  console.log(pokeinfo)

  let frontSprite = pokeinfo.sprites.front_default
  // let backSprite = pokeinfo.sprites.back_default

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
          width: 48,
          height: 48
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
    })
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
