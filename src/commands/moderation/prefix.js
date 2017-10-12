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
      requirements: {
        permissions: {
          'administrator': true
        }
      },
      permissionMessage: 'You need to be an administrator to set this.',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)
    try {
      const guild = msg.channel.guild

      if (args.length === 0) {
        const prefix = await this.redisClient.get(`guild_prefix:${guild.id}`) || 'b!'
        responder.info(`The prefix for this guild is ${prefix}`).send()
        return
      }

      const newPrefix = parsedArgs._[0]

      this.bot.registerGuildPrefix(guild.id, [ '@mention ', newPrefix ])

      await this.redisClient.set(`guild_prefix:${guild.id}`, newPrefix)

      await responder.success(`Guild prefix set to '${newPrefix}'`).send()
    } catch (e) {
      console.error(e)
      await responder.error('Error while setting the guild prefix. Probably on our end, try again later please.').send()
    }
  }
}
