import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'
import Responder from './../../lib/messages/responder'
import validUrl from 'valid-url'

export default class PlayCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'play',
      usage: '<url|query>',
      argsRequired: true,
      description: 'Play/search track',
      fullDescription: 'Play or search for and play a track',
      invalidUsageMessage: 'Specify an url or query'
    }
    super(info, bot)
  }

  async action (msg, args) {
    var responder = new Responder(msg.channel)

    if (!msg.member.voiceState.channelID) {
      responder.error('Join a voice channel to start playing', 10).send()
      return
    }

    let tracks
    if (validUrl.isWebUri(args[0])) {
      tracks = await player.searchTracks(args[0])
    } else {
      tracks = await player.searchTracks(`ytsearch:${args.join(' ')}`)
    }

    if (tracks.length === 0 || tracks.error) {
      responder.error('No results found for the query or URL is not supported', 10).send()
      return
    }

    let choosenTrack = tracks[0]
    if (tracks.length > 1) {
      // handle multiple results here
    }

    var p = await player.get(msg, true)
    p.play(choosenTrack.track)

    responder.success(`Playing ${choosenTrack.info.title}`).send()
  }
}
