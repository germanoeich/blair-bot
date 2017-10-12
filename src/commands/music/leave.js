import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'
import Responder from './../../lib/messages/responder'

export default class LeaveCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'leave',
      description: 'Makes the bot leave the voice channel',
      fullDescription: 'Makes the bot leave the voice channel it\'s currently in',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)

    const p = await player.get(msg)

    if (!p) {
      responder.error('Bot is not bound to a channel', 10).send()
      return
    }

    const currentChannelId = p.channelId

    p.stop()
    await p.manager.leave(msg.channel.guild.id)

    responder.success(`Unbound from :speaker: ${msg.channel.guild.channels.get(currentChannelId).name} `).send()
  }
}
