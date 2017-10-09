import integrity from './../lib/internal/integrity'
import Responder from './../lib/messages/responder'

export default class BaseCommand {
  constructor (info, commandClient) {
    this.info = info
    this.bot = commandClient
    this.action = this.action.bind(this)
    this.actionWrapper = this.actionWrapper.bind(this)
    this.subcommands = []
  }

  addSubCommand (obj) {
    this.subcommands.push(obj)
  }

  action () {
  }

  async actionWrapper (msg, args) {
    try {
      if (!integrity.canPrompt(msg.author)) {
        const responder = new Responder(msg.channel)
        responder.promptBlocked().ttl(10).send()
        return
      }
      integrity.startPrompt(msg.author)

      await this.action(msg, args)

      integrity.endPrompt(msg.author)
    } catch (e) {
      integrity.endPrompt(msg.author)
      throw e
    }
  }

  register () {
    const actionFunc = (this.info.mayPrompt) ? this.actionWrapper : this.action
    const cmd = this.bot.registerCommand(this.info.name, actionFunc, this.info)
    this.subcommands.forEach((subCmd) => {
      var subCmdActionFunc = subCmd.info.mayPrompt ? subCmd.actionWrapper : subCmd.action
      cmd.registerSubcommand(subCmd.info.name, subCmdActionFunc, subCmd.info)
    })
  }
}
