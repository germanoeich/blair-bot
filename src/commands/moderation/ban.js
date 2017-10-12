import TargetedCommand from './../targetedCommand'

export default class BanCmd extends TargetedCommand {
  constructor (bot) {
    const info = {
      name: 'ban',
      usage: '<Username | Userid | User Mention> [Reason] - target selector capable',
      argsRequired: true,
      description: 'Bans someone from the server.',
      fullDescription: 'Bans someone from the server.',
      requirements: {
        permissions: {
          'banMembers': true
        }
      },
      guildOnly: true,
      permissionMessage: 'You need the "Ban Members" permission.',
      invalidUsageMessage: 'Specify a target',
      targetInfo: {
        action: async (member, reason, responder) => {
          await member.ban(reason)
          responder.success(`User ${member.user.username}#${member.user.discriminator} ( ${member.user.id} ) was banned from the server`).send()
        }
      },
      mayPrompt: true,
      hasReason: true
    }
    super(info, bot)
  }
}
