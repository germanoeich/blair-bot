import BaseCommand from './baseCommand'
import Responder from './../lib/messages/responder'

export default class HelpCmd extends BaseCommand {
  constructor (bot, categories) {
    const info = {
      name: 'help',
      usage: 'help [command] [-f] [-c <category_name>]',
      description: 'Get\'s help about the bot',
      fullDescription: 'Provides a short list of commands or a full list via DM if the flag -f is included'
    }
    super(info, bot)
    this.categories = categories
    this.allCmds = []
    categories.forEach((c) => {
      this.allCmds = [ ...this.allCmds, ...c.cmds ]
    })
    this.allCmds.push(this)
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)

    let categories = this.categories.filter((element) => !!element.categoryName)
    if (parsedArgs.c) {
      categories = categories.filter((c) => c.categoryName.toLowerCase() === parsedArgs.c.toLowerCase())
      if (categories.length === 0) {
        return responder.error('Invalid category', 10).send()
      }
    }

    if (parsedArgs._.length === 0) {
      const embed = {
        title: 'Help',
        description: 'Commands by category:',
        url: 'https://blairbot.me',
        color: parseInt('815FC0', 16),
        footer: {
          icon_url: 'https://cdn.discordapp.com/avatars/358403319523180544/837fafe1f4a2ed5242b1025a18e05d37.png',
          text: 'Tip: You can use "help -f" to get a more detailed command list'
        },
        author: {
          name: 'Blair',
          url: 'https://blairbot.me',
          icon_url: 'https://cdn.discordapp.com/avatars/358403319523180544/837fafe1f4a2ed5242b1025a18e05d37.png'
        },
        fields: []
      }

      if (parsedArgs.f) {
        embed.fields = categories.map((element) => {
          return {
            name: `__${element.categoryName}__`,
            value: element.cmds.map((cmd) => {
              return `**${cmd.info.name}${cmd.info.aliases ? ` | ${cmd.info.aliases.join(' | ')}` : ''}** - ${cmd.info.description}\n`
            }).join('')
          }
        })

        embed.footer.text = 'Tip: You can use "help -c <name>" to show only given category. The flags -c and -f can be used together.'
      } else {
        embed.fields = categories.map((element) => {
          return {
            name: element.categoryName,
            value: element.cmds.map((cmd) => {
              return `\`${cmd.info.name}\``
            }).join(', ')
          }
        })
      }
      return responder.embed(embed).send()
    } else {
      const cmdName = parsedArgs._[0]
      const command = this.allCmds.find((cmd) => cmd.info.name === cmdName || (cmd.info.aliases && cmd.info.aliases.includes(cmdName)))

      if (!command) {
        return responder.error(`Command ${cmdName} not found`).ttl(10).send()
      }

      const embed = {
        title: `${command.info.name}${command.info.aliases ? ` | ${command.info.aliases.join(' | ')}` : ''}`,
        description: command.info.fullDescription,
        color: parseInt('815FC0', 16),
        author: {
          name: 'Blair',
          url: 'https://blairbot.me',
          icon_url: 'https://cdn.discordapp.com/avatars/358403319523180544/837fafe1f4a2ed5242b1025a18e05d37.png'
        },
        footer: {
          text: 'Tip: Arguments surrounded by [] are optional. Ones surrounded by <> are required. | means "or". All arguments with whitespaces must be surrounded by single(\') or double (") quotes.'
        },
        fields: [
          {
            name: 'Usage',
            value: command.info.usage
          }
        ]
      }

      return responder.embed(embed).send()
    }
  }
}
