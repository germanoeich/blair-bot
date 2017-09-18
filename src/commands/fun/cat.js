import FetchCommand from './../fetchCommand'

export default class CatCmd extends FetchCommand {
  constructor (bot) {
    const info = {
      name: 'cat',
      description: 'fetch a random cat image',
      fullDescription: 'fetch a random cat image',
      fetchInfo: {
        url: 'http://random.cat/meow',
        resolveReturn: async (response) => (await response.json()).file
      }
    }
    super(info, bot)
  }
}
