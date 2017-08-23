import Eris from 'eris'
import config from '/bot/config'
import { registerCommands } from '/bot/commands'
import init from '/lib'

export async function connect () {
  return new Promise((resolve, reject) => {
    var bot = new Eris.CommandClient(config.token, {}, {
      prefix: ['@mention ', 'b!'],
      owner: 'Gin#1913',
      defaultHelpCommand: false
    })

    bot.on('ready', () => {
      init(bot)
      registerCommands(bot)
      console.log('Ready!')
      resolve(bot)
    })

    bot.on('error', (err) => {
      console.error(err)
      reject(err)
    })

    bot.connect()
  })
}

connect()
