import FetchCommand from './../fetchCommand'

export default class DogCmd extends FetchCommand {
  constructor (bot) {
    const info = {
      name: 'dog',
      description: 'fetch a random dog image',
      fullDescription: 'fetch a random dog image',
      aliases: ['woof'],
      fetchInfo: {
        url: 'https://random.dog/woof.json',
        resolveReturn: async (response) => (await response.json()).url
      }
    }
    super(info, bot)
  }
}
