import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'
import Responder from './../../lib/messages/responder'

export default class ListenMoeCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'listenmoe',
      description: 'Plays listen.moe radio',
      fullDescription: 'Plays listen.moe radio. Shortcut for "play https://listen.moe/stream"',
      guildOnly: true
    }
    super(info, bot)
  }

  // TODO: Convert this into an ACTUAL shortcut of play.. maybe?
  async action (msg, args) {
    const responder = new Responder(msg.channel)

    if (!msg.member.voiceState.channelID) {
      responder.error('Join a voice channel to start playing', 10).send()
      return
    }

    let choosenTrack = await player.searchTracks('https://listen.moe/stream')
    choosenTrack = choosenTrack[0]

    if (!choosenTrack) {
      return responder.error('Something went wrong. Check if listen.moe is online, if it is, please contact support').send()
    }

    var p = await player.get(msg, true)
    p.play(choosenTrack.track)

    responder.success(`Playing listen.moe radio`).send()
  }
}
