import Eris from 'eris'
import config from './../src/config/config.js'

let _bot
const channelId = '365166607464529920'
// const guildId = '348152871507984395'

export default class UnitWorker {
  constructor () {
    this.bot = _bot
  }

  async sendAndWait (content) {
    this.bot.createMessage(channelId, content)
    return new Promise((resolve, reject) => {
      var handler = (msg) => {
        if (msg.author.id === this.bot.user.id) {
          return
        }

        this.bot.removeListener(handler)
        resolve(msg)
      }
      this.bot.on('messageCreate', handler)
    })
  }

  async sendMsg (content) {
    return this.bot.createMessage(channelId, content)
  }

  async awaitMessage () {
    return new Promise((resolve, reject) => {
      var handler = (msg) => {
        if (msg.author.id === this.bot.user.id) {
          return
        }

        this.bot.removeListener(handler)
        resolve(msg)
      }
      this.bot.on('messageCreate', handler)
    })
  }
}

async function connect () {
  _bot = new Eris.CommandClient(config.test_worker, {
  }, {
    prefix: ['@mention ', 'unit!'],
    owner: 'Gin#1913',
    // defaultHelpCommand: false,
    ignoreBots: false
  })

  _bot.on('ready', async () => {
    console.log('Worker ready')
  })

  return _bot.connect()
}

connect()
