import BaseCommand from './../baseCommand'

export default class PingCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'ping',
      description: 'Pong!',
      fullDescription: 'Used to check bot latency and if it\'s online'
    }
    super(info, bot)
  }

  action (msg, args) {
    this.bot.createMessage(msg.channel.id, ':ping_pong: Pong!').then(function (botMsg) {
      botMsg.edit(`${botMsg.content} - **${botMsg.timestamp - msg.timestamp} ms Shard: ${msg.channel.guild.shard.id}**`)
    })
  }
}
