import FetchCommand from './../fetchCommand'

export default class DeathBulgeCmd extends FetchCommand {
  constructor (bot) {
    const info = {
      name: 'deathbulge',
      usage: '[comic_id | last]',
      description: 'Shows a Death Bulge comic.',
      fullDescription: 'Shows a Death Bulge comic. Provide no arguments for a random comic.',
      aliases: ['dbulge', 'deathb'],
      fetchInfo: {
        url: 'http://deathbulge.com/api/comics/',
        resolveReturn: async (response) => {
          var json = await response.json()
          return `**${json.comic.title}**\n${'http://deathbulge.com' + json.comic.comic}`
        }
      },
      argsRequired: false
    }
    super(info, bot)
  }

  async action (msg, args) {
    let lastId
    if (!(lastId = await this.redisClient.get('deathbulge:last_id'))) {
      lastId = await this.fetch(msg, args, this.url + '1', async (response) => (await response.json()).pagination_links.last)
      // 43200 = 12 hours
      this.redisClient.set('deathbulge:last_id', lastId, 'EX', 43200)
    }

    let id
    if (args[0]) {
      if (args[0] === 'last') {
        id = lastId
      } else {
        id = parseInt(args[0])
        if (!Number.isInteger(id) || id > lastId) {
          return 'Invalid ID'
        }
      }
    } else {
      id = this.randomInt(1, lastId)
    }

    return this.fetch(msg, args, this.url + id)
  }

  randomInt (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }
}
