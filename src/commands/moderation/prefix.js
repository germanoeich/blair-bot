import redis from './../../data/redis'
import Responder from './../../lib/messages/responder'
import BaseCommand from './../baseCommand'

export default class PrefixCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'prefix',
      usage: '<prefix>',
      description: 'Changes the bot prefix.',
      fullDescription: 'Changes the bot prefix.',
      caseInsensitive: true,
      argsRequired: true,
      requirements: {
        permissions: {
          'administrator': true
        }
      },
      permissionMessage: 'You need to be an administrator to set this.',
      invalidUsageMessage: 'Specify an prefix'
    }
    super(info, bot)

    this.redisClient = redis.connect()
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)
    try {
      const newPrefix = args[0]

      const guild = msg.channel.guild
      this.bot.registerGuildPrefix(guild.id, [ '@mention ', newPrefix ])

      await this.redisClient.set(`guild_prefix:${guild.id}`, newPrefix)

      await responder.success(`Guild prefix set to '${newPrefix}'`).send()
    } catch (e) {
      console.error(e)
      await responder.error('Error while setting the guild prefix. Probably on our end, try again later please.').send()
    }
  }
}
