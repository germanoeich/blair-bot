import Responder from './../../lib/messages/responder'
import BaseCommand from './../baseCommand'

export default class PrefixCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'prefix',
      usage: 'prefix [prefix]',
      description: 'Sets or shows the current guild prefix for Blair.',
      fullDescription: 'If invoked without arguments, Blair will display the current prefix. If an argument is provided, the prefix will be set to the provided argument',
      caseInsensitive: true,
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
        return responder.info(`The prefix for this guild is ${prefix}`).send()
      }

      if (!msg.member.permissions.has('manageGuild')) {
        return responder.error('You need the "Manage Guild" permission to set this.', 10).send()
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
