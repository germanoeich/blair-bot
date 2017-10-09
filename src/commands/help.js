import BaseCommand from './baseCommand'
import Responder from './../lib/messages/responder'

export default class HelpCmd extends BaseCommand {
  constructor (bot, categories) {
    const info = {
      name: 'help',
      description: 'Get\'s help about the bot',
      fullDescription: 'Provides a short list of commands or a full list via DM if the flag -a is included'
    }
    super(info, bot)
    this.categories = categories
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)

    var embed = {
      title: 'Help',
      description: 'Commands by category:',
      url: 'https://discordapp.com',
      color: parseInt('815FC0', 16),
      footer: {
        icon_url: 'https://cdn.discordapp.com/avatars/358403319523180544/837fafe1f4a2ed5242b1025a18e05d37.png',
        text: 'Tip: You can use "help -a" to get a more detailed command list'
      },
      author: {
        name: 'Blair',
        url: 'https://blairbot.me',
        icon_url: 'https://cdn.discordapp.com/avatars/358403319523180544/837fafe1f4a2ed5242b1025a18e05d37.png'
      },
      fields: []
    }

    embed.fields = this.categories.filter((element) => !!element.categoryName).map((element) => {
      return {
        name: element.categoryName,
        value: element.cmds.map((cmd) => {
          return `\`${cmd.info.name}\``
        }).join(', ')
      }
    })

    await responder.embed(embed).send()
  }
}
