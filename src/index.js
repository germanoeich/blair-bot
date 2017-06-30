import Eris from 'eris'
import config from './config'

var bot = new Eris(config.token)
bot.on('ready', () => {
  console.log('Ready!')
})
bot.on('messageCreate', (msg) => {
  if (msg.content === 'p!ping') {
    bot.createMessage(msg.channel.id, 'Pong!')
  }

  if (msg.content === '<3 bulbabot') {
    bot.createMessage(msg.channel.id, `${msg.author.mention} Stahp it you :3 <3`)
  }
})
bot.connect()
