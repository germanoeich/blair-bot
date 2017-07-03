import Eris from 'eris'
import config from './config'
import { dispatchMsg } from './commands'

var bot = new Eris(config.token)
bot.on('ready', () => {
  console.log('Ready!')
})
bot.on('messageCreate', (msg) => {
  if (msg.content.startsWith(config.prefix)) {
    dispatchMsg(msg, bot)
  }
})
bot.connect()
