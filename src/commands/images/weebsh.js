// import Weebsh, { TokenType } from 'weeb-sh'
import config from './../../config/config.js'
import BaseCommand from './../baseCommand'
import Weebsh from './../../lib/util/weebsh'
import Responder from './../../lib/messages/responder'

// const weebsh = new Weebsh(config.weebsh.token, 1)

export default class WeebShCommandGenerator {
  constructor (bot) {
    this.weebsh = new Weebsh(config.weebsh.token)
    this.bot = bot
  }

  async generateCommands () {
    this.types = await this.weebsh.getTypes()
    this.nsfwTypes = await this.weebsh.getTypes('only')
    this.typeCmds = []
    this.types.forEach((type) => {
      const cmd = new WeebshGenericCmd(type, this.nsfwTypes.includes(type), this.weebsh, this.bot)
      this.typeCmds.push(cmd)
    })
  }
}

class WeebshGenericCmd extends BaseCommand {
  constructor (type, nsfwEnabled, weebsh, bot) {
    const usage = (nsfwEnabled) ? `${type} [-nsfw true|false|only]` : type
    const info = {
      name: type,
      usage: usage,
      description: `Fetches a ${type} image`,
      fullDescription: `Fetches a ${type} image from weeb.sh. ${(nsfwEnabled ? 'NSFW Enabled, you can use the -nsfw flag to define if the bot will fetch NSFW images. You still need to be in a nsfw channel for NSFW images.' : '')}`
    }
    super(info, bot)
    this.weebsh = weebsh
    this.type = type
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)
    const embed = {
      image: {
        url: await this.weebsh.getRandom(this.type, false)
      }
    }
    return responder.embed(embed).send()
  }
}
