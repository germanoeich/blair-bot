import TargetedCommand from './../targetedCommand'

export default class BanCmd extends TargetedCommand {
  constructor (bot) {
    const info = {
      name: 'ban',
      usage: 'ban <username | userid | user mention> [reason]',
      argsRequired: true,
      description: 'Bans someone from the server.',
      fullDescription: 'Bans someone from the server. Blair will prompt you to choose the right person to ban if multiple matches are found.',
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
