import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'
import Responder from './../../lib/messages/responder'

export default class StopCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'stop',
      description: 'Stop the current song',
      fullDescription: 'Used to Stop the current song',
      requirements: {
        userIDs: ['227115752396685313']
      }
    }
    super(info, bot)
  }

  async action (msg, args) {
    var responder = new Responder(msg)

    var p = await player.get(msg)

    if (!p) {
      responder.error('Bot is not playing', 10).send()
    }

    const currentChannelId = p.channelId

    await p.stop()
    await p.leave(msg.channel.guild.id)

    responder.succes(`Stopped and unbound from :speaker: ${msg.guild.channels.get(currentChannelId).name} `).send()
  }
}
