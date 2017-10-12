import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'
import Responder from './../../lib/messages/responder'

export default class JoinCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'join',
      description: 'Makes the bot join the voice channel',
      fullDescription: 'Makes the bot join the voice channel it\'s currently in',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)

    let p = await player.get(msg)

    if (p) {
      responder.error('Bot is already bound to a channel', 10).send()
      return
    }

    p = await player.get(msg, true)

    const currentChannelId = p.channelId

    responder.success(`Bound to :speaker: ${msg.channel.guild.channels.get(currentChannelId).name} `).send()
  }
}
