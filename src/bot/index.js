import Eris from 'eris'
import config from '/bot/config'
import { registerCommands } from '/bot/commands'
import init from '/lib'

export async function connect () {
  return new Promise((resolve, reject) => {
    var bot = new Eris.CommandClient(config.token, { autoreconnect: false }, {
      prefix: ['@mention ', 'b!'],
      owner: 'Gin#1913',
      defaultHelpCommand: false
    })

    const readyListener = () => {
      init(bot)
      registerCommands(bot)
      console.log('Ready!')
      bot.removeListener('ready', readyListener)
      resolve(bot)
    }

    const errorListener = (err) => {
      console.error('error')
      bot.removeListener('error', errorListener)
      reject(err)
    }

    bot.on('ready', readyListener)
    bot.on('error', errorListener)

    bot.connect().catch((err) => reject(err))
  })
}
