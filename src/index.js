import Eris from 'eris'
import config from './config'
import { registerCommands } from './commands'

var bot = new Eris.CommandClient(config.token, {}, {
  prefix: ['@mention ', 'b!'],
  owner: 'Gin#1913'
})

bot.on('ready', () => {
  console.log('Ready!')
})

registerCommands(bot)

bot.connect()
