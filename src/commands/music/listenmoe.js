import BaseCommand from './../baseCommand'

export default class ListenMoeCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'listenmoe',
      usage: 'listenmoe',
      description: 'Plays listen.moe radio',
      fullDescription: 'Plays listen.moe radio. Shortcut for "play https://listen.moe/stream"',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg) {
    return this.bot.commands.play.execute(msg, [ 'https://listen.moe/stream' ])
  }
}
