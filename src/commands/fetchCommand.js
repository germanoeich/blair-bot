import BaseCommand from './baseCommand'
import fetch from 'node-fetch'

export default class FetchCommand extends BaseCommand {
  constructor (info, bot) {
    super(info, bot)
    this.url = info.fetchInfo.url
    this.resolveReturn = info.fetchInfo.resolveReturn
  }

  async action () {
    var response = await fetch(this.url)
    return this.resolveReturn(response)
  }
}
