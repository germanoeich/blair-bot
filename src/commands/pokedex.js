import Pokedex from 'pokedex-promise-v2'
import config from './../config'

export default {
  name: 'pokedex',
  action: async (msg, bot) => {
    if (msg.content.startsWith(config.prefix + 'pokedex ')) {
      let args = msg.content.replace(config.prefix + 'pokedex ', '')

      let P = new Pokedex()
      let pokeinfo = await P.getPokemonByName(args)

      let botMsg = `name: ${pokeinfo.name} \r\nid: ${pokeinfo.id}`
      bot.createMessage(msg.channel.id, botMsg)
    }
  }
}
