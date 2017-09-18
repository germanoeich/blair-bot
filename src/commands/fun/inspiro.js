import FetchCommand from './../fetchCommand'

export default class InspiroCmd extends FetchCommand {
  constructor (bot) {
    const info = {
      name: 'inspiro',
      description: 'fetch a inspirobot image',
      fullDescription: 'fetch a inspirobot image',
      aliases: ['inspirobot'],
      fetchInfo: {
        url: 'http://inspirobot.me/api?generate=true',
        resolveReturn: (response) => response.text()
      }
    }
    super(info, bot)
  }
}
