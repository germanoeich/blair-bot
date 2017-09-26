import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'

export default class PlayCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'play',
      description: 'Play a song',
      fullDescription: 'Used to play a song',
      argsRequired: true
    }
    super(info, bot)
  }

  async action (msg, args) {
    if (!msg.member.voiceState.channelID) {
      return 'join a voice channel'
    }

    var tracks = await player.resolveTracks('ytsearch:' + args[0])
    var p = await player.getPlayer(msg)
    p.play(tracks[0].track)
  }
}
