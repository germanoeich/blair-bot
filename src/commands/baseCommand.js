export default class BaseCommand {
  constructor (info, commandClient) {
    this.info = info
    this.bot = commandClient
  }

  action () {
    return 'Not implemented'
  }

  register () {
    this.bot.registerCommand(this.info.name, this.action, this.info)
  }
}
