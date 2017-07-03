import config from './../config'

export default {
  name: 'ping',
  action: (msg, bot) => {
    if (msg.content === config.prefix + 'ping') {
      bot.createMessage(msg.channel.id, 'pong')
    }
  }
}
