import Eris from 'eris'
import config from './bot/config'
import { registerCommands } from './bot/commands'
import init from './lib'

var bot = new Eris.CommandClient(config.token, {}, {
  prefix: ['@mention ', 'b!'],
  owner: 'Gin#1913'
})

bot.on('ready', () => {
  console.log('Ready!')
  init(bot)
})

registerCommands(bot)

bot.connect()
