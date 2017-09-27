import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'

export default class PlayCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'play',
      description: 'Play a song',
      fullDescription: 'Used to play a song',
      requirements: {
        userIDs: ['227115752396685313']
      },
      argsRequired: true
    }
    super(info, bot)
  }

  async action (msg, args) {
    if (!msg.member.voiceState.channelID) {
      return 'join a voice channel'
    }

    var tracks = await player.searchTracks(args[0])

    if (tracks.length === 0) {
      return 'no results'
    }

    var p = await player.get(msg, true)
    p.play(tracks[0].track)

    return '```JSON\n' + JSON.stringify(tracks[0]) + '```'
  }
}
