import BaseCommand from './../baseCommand'
import Responder from './../../lib/messages/responder'

export default class DisableCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'disable',
      usage: 'disable <command>',
      description: 'Disables a command',
      fullDescription: 'Disables a command',
      argsRequired: true,
      requirements: {
        permissions: {
          'manageGuild': true
        }
      },
      permissionMessage: 'You need the "Manage Guild" permission to set this.',
      invalidUsageMessage: 'Specify a command',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg, args, parsedArgs) {
    const cmdName = parsedArgs._[0]
    const responder = new Responder(msg.channel)

    if (!this.bot.cmdNames.includes(cmdName)) {
      return responder.error(`Command ${cmdName} doesn't exists`).send()
    }

    await this.redisClient.sadd(`cmd_disable:${msg.channel.guild.id}:${cmdName}`, msg.channel.id)
    return responder.success(`Succesfully disabled command ${cmdName} on this channel`)
  }
}
