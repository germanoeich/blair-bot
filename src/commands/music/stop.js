import BaseCommand from './../baseCommand'
import player from './../../lib/lavalink/player'

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
    var p = await player.get(msg)
    p.stop()
  }
}
