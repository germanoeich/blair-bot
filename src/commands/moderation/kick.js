import TargetSelector from './../../lib/util/target-selector'
import Responder from './../../lib/messages/responder'
import BaseCommand from './../baseCommand'

export default class KickCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'kick',
      usage: '<Username | Userid | User Mention> [Reason] - target selector capable',
      argsRequired: true,
      description: 'Kicks someone from the server.',
      fullDescription: 'Kick someone from the server.',
      requirements: {
        permissions: {
          'kickMembers': true
        }
      },
      permissionMessage: 'You need the "Kick Members" permission.',
      invalidUsageMessage: 'Specify a target'
    }
    super(info, bot)
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)

    const targetSelector = new TargetSelector()

    if (args.length === 0) {
      responder.error('Specify an user').send()
      return
    }

    let member = await targetSelector.find(msg, args[0])
    const reason = args[1] || ''
    if (!member) {
      return
    }

    try {
      await member.kick(reason)
      responder.success(`User ${member.user.username}#${member.user.discriminator} ( ${member.user.id} ) was kicked from the server`)
    } catch (e) {
      const error = JSON.parse(e.response)
      responder.error(`Failed with error: ${error.code} - ${error.message} `)
    }

    responder.send()
  }
}
