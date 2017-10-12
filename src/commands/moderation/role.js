import TargetSelector from './../../lib/util/target-selector'
import Responder from './../../lib/messages/responder'
import BaseCommand from './../baseCommand'

function getMemberHighestRole (member, guild) {
  return member.roles.map((roleId) => guild.roles.get(roleId))
                     .reduce((curr, role) => {
                       if (curr.position > role.position) {
                         return curr
                       }
                       return role
                     }, { position: -1 })
}

async function parseParams (msg, parsedArgs) {
  const empty = { member: undefined, role: undefined }
  const targetSelector = new TargetSelector()
  const target = parsedArgs._[0]

  const roleName = parsedArgs._[1]
  const role = msg.channel.guild.roles.find((role) => role.name === roleName)

  if (!role) {
    const responder = new Responder(msg.channel)
    responder.error('Role not found')
    if (parsedArgs._.length > 2) {
      responder.newline().italic('Tip: if the role name has spaces in it, enclose in `\'` or `"`.')
    }
    await responder.send().ttl(20)
    return empty
  }

  const member = await targetSelector.find(msg, target)
  // Prompt cancelled
  if (!member) {
    return empty
  }

  const highestRole = getMemberHighestRole(msg.member, msg.channel.guild)
  if (highestRole && role.position >= highestRole.position) {
    const responder = new Responder(msg.channel)
    await responder.error('You must be in a higher role than the one you are trying to assign / remove.').send()
    return empty
  }

  return {
    role: role,
    member: member
  }
}

export default class RoleCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'role',
      usage: '<add|remove> <user> <role>',
      argsRequired: true,
      description: 'Add/remove user roles.',
      fullDescription: 'Add/remove user roles.',
      requirements: {
        permissions: {
          'manageRoles': true
        }
      },
      permissionMessage: 'You need the "Manage Roles" permission.',
      invalidUsageMessage: 'Specify an operation, target and a role',
      guildOnly: true
    }
    super(info, bot)
    this.addSubCommand(new AddCmd(bot))
    this.addSubCommand(new RemoveCmd(bot))
  }
}

class AddCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'add',
      usage: '<user> <role>',
      argsRequired: true,
      description: 'Add user roles.',
      fullDescription: 'Add user roles.',
      requirements: {
        permissions: {
          'manageRoles': true
        }
      },
      permissionMessage: 'You need the "Manage Roles" permission.',
      invalidUsageMessage: 'Specify an target and a role'
    }
    super(info, bot)
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)

    const {
      member,
      role
    } = await parseParams(msg, parsedArgs)

    if (!member || !role) {
      return
    }

    if (member.roles && member.roles.some((roleId) => roleId === role.id)) {
      responder.error('User is already assigned to this role').send()
      return
    }

    try {
      await member.addRole(role.id)
      responder.success(`User ${member.user.username}#${member.user.discriminator} was assigned to role ${role.name}`).send()
    } catch (e) {
      const error = JSON.parse(e.response)
      if (error.code === 50013) {
        responder.error(`Missing Permissions, make sure bot has Manage Roles perms and the role you are trying to assign/remove is not higher than the bot's role.`).send()
      } else {
        responder.error(`Failed with error: ${error.code} - ${error.message} `).send()
      }
    }
  }
}

class RemoveCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'remove',
      usage: '<user> <role>',
      argsRequired: true,
      description: 'Remove user roles.',
      fullDescription: 'Remove user roles.',
      requirements: {
        permissions: {
          'manageRoles': true
        }
      },
      permissionMessage: 'You need the "Manage Roles" permission.',
      invalidUsageMessage: 'Specify an target and a role'
    }
    super(info, bot)
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)

    const {
      member,
      role
    } = await parseParams(msg, parsedArgs)

    if (!member || !role) {
      return
    }

    if (member.roles && member.roles.every((roleId) => roleId !== role.id)) {
      responder.error('User is not assigned to this role').send()
      return
    }

    try {
      await member.removeRole(role.id)
      responder.success(`User ${member.user.username}#${member.user.discriminator} was removed from role ${role.name}`).send()
    } catch (e) {
      const error = JSON.parse(e.response)
      if (error.code === '50013') {
        responder.error(`Missing Permissions, make sure bot has Manage Roles perms and the role you are trying to assign/remove is not higher than the bot's role.`).send()
      } else {
        responder.error(`Failed with error: ${error.code} - ${error.message} `).send()
      }
    }
  }
}
