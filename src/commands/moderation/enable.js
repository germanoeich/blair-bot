import BaseCommand from './../baseCommand'
import Responder from './../../lib/messages/responder'

export default class EnableCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'enable',
      usage: 'enable <command> [guild|channel]',
      description: 'Enables a command',
      fullDescription: 'Enables a command',
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

    if (parsedArgs._[1] && (parsedArgs._[1] !== 'guild' && parsedArgs._[1] !== 'channel')) {
      return responder.error(`${parsedArgs._[1]} is not a valid scope. Use "guild" or "channel"`, 10).send()
    }

    var redisKey = `cmd_disable:${msg.channel.guild.id}:${cmdName}`

    let scope
    if (parsedArgs._[1] === 'guild') {
      await this.redisClient.del(redisKey)
      scope = '**guild**'
    } else {
      await this.redisClient.srem(redisKey, msg.channel.id)
      scope = '**channel**'
    }

    return responder.success(`Succesfully enabled command ${cmdName} on this ${scope}`).send()
  }
}
