import TargetedCommand from './../targetedCommand'

export default class KickCmd extends TargetedCommand {
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
      guildOnly: true,
      permissionMessage: 'You need the "Kick Members" permission.',
      invalidUsageMessage: 'Specify a target',
      targetInfo: {
        action: async (member, reason, responder) => {
          await member.kick(reason)
          responder.success(`User ${member.user.username}#${member.user.discriminator} ( ${member.user.id} ) was kicked from the server`).send()
        }
      },
      mayPrompt: true,
      hasReason: true
    }
    super(info, bot)
  }
}
