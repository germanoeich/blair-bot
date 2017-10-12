import integrity from './../lib/internal/integrity'
import Responder from './../lib/messages/responder'
import parser from 'yargs-parser'

export default class BaseCommand {
  constructor (info, commandClient) {
    this.info = info
    this.bot = commandClient

    this.baseAction = this.baseAction.bind(this)
    if (this.action) {
      this.action = this.action.bind(this)
    }

    this.subcommands = []
  }

  addSubCommand (obj) {
    this.subcommands.push(obj)
  }

  startPrompt (msg) {
    if (this.info.mayPrompt) {
      if (!integrity.canPrompt(msg.author)) {
        const responder = new Responder(msg.channel)
        responder.promptBlocked().ttl(10).send()
        return false
      }
      integrity.startPrompt(msg.author)
    }
    return true
  }

  endPrompt (msg) {
    if (this.info.mayPrompt) {
      integrity.endPrompt(msg.author)
    }
  }

  async baseAction (msg, args) {
    try {
      if (!this.startPrompt(msg)) {
        return
      }

      var parsedArgs = parser(args.join(' '), {
        configuration: {
          'short-option-groups': false,
          'dot-notation': false,
          'duplicate-arguments-array': false,
          'flatten-duplicate-arrays': false,
          // I may come back and change this to true.
          // But for now, things can be simple
          'boolean-negation': false
        }
      })
      await this.action(msg, args, parsedArgs)

      if (parsedArgs.d) {
        msg.delete('Trigerred by -d flag').catch(() => {})
      }

      this.endPrompt(msg)
    } catch (e) {
      this.endPrompt(msg)
      throw e
    }
  }

  register () {
    const cmd = this.bot.registerCommand(this.info.name, this.baseAction, this.info)
    this.subcommands.forEach((subCmd) => cmd.registerSubcommand(subCmd.info.name, subCmd.baseAction, subCmd.info))
  }
}
