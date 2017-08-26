import Eris from 'eris'
import config from '/bot/config'
import { registerCommands } from '/bot/commands'
import init from '/lib'

export async function connect () {
  var bot = new Eris.CommandClient(config.token, { autoreconnect: false }, {
    prefix: ['@mention ', 'b!'],
    owner: 'Gin#1913',
    defaultHelpCommand: false
  })

  bot.on('ready', () => {
    init(bot)
    registerCommands(bot)
    console.log('Ready!')
  })

  bot.on('error', console.error)

  return bot.connect()
}
