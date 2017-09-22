export default class BaseCommand {
  constructor (info, commandClient) {
    this.info = info
    this.bot = commandClient
    this.action = this.action.bind(this)
    this.subcommands = []
  }

  addSubCommand (obj) {
    this.subcommands.push(obj)
  }

  action () {
    return 'Not implemented'
  }

  register () {
    const cmd = this.bot.registerCommand(this.info.name, this.action, this.info)
    this.subcommands.forEach((subCmd) => cmd.registerSubcommand(subCmd.info.name, subCmd.action, subCmd.info))
  }
}
