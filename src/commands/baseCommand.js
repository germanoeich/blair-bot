export default class BaseCommand {
  constructor (info, commandClient) {
    this.info = info
    this.bot = commandClient
    this.action = this.action.bind(this)
  }

  action () {
    return 'Not implemented'
  }

  register () {
    this.bot.registerCommand(this.info.name, this.action, this.info)
  }
}
