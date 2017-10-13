import TargetedCommand from './../targetedCommand'

export default class KickCmd extends TargetedCommand {
  constructor (bot) {
    const info = {
      name: 'kick',
      usage: '<username | userid | user Mention> [reason]',
      argsRequired: true,
      description: 'Kicks someone from the server.',
      fullDescription: 'Kicks someone from the server. Blair will prompt you to choose the right person to ban if multiple matches are found.',
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
