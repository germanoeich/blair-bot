import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'
import Responder from './../../lib/messages/responder'

export default class StopCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'stop',
      usage: 'stop',
      description: 'Stop the current song',
      fullDescription: 'Used to Stop the current song',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)

    const p = await player.get(msg)

    if (!p || !p.playing) {
      responder.error('Bot is not playing anything', 10).send()
      return
    }

    const currentChannelId = p.channelId

    await p.stop()

    responder.success(`Stopped and unbound from :speaker: ${msg.channel.guild.channels.get(currentChannelId).name} `).send()
  }
}
