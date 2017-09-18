import BaseCommand from './baseCommand'
import fetch from 'node-fetch'

export default class FetchCommand extends BaseCommand {
  constructor (info, bot) {
    super(info, bot)
    this.url = info.fetchInfo.url
    this.resolveReturn = info.fetchInfo.resolveReturn
    this.fetch = this.fetch.bind(this)
  }

  async fetch (msg, args) {
    var response = await fetch(this.url)
    return this.resolveReturn(response, msg, args)
  }

  async action (msg, args) {
    return this.fetch(msg, args)
  }
}
