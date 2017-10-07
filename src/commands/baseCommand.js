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

  async baseAction (msg, args) {
    var parsedArgs = parser(args.join(' '))
    await this.action(msg, args, parsedArgs)

    if (parsedArgs.d) {
      msg.delete('Trigerred by -d flag').catch(() => {})
    }
  }

  register () {
    const cmd = this.bot.registerCommand(this.info.name, this.baseAction, this.info)
    this.subcommands.forEach((subCmd) => cmd.registerSubcommand(subCmd.info.name, subCmd.baseAction, subCmd.info))
  }
}
