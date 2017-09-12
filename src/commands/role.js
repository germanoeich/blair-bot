import TargetSelector from './../lib/util/target-selector'
import Responder from './../lib/messages/responder.js'

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
  invalidUsageMessage: 'Specify an operation, target and a role'
}

function getMemberHighestRole (member, guild) {
  return member.roles.map((roleId) => guild.roles.get(roleId))
                     .reduce((curr, role) => {
                       if (curr.position > role.position) {
                         return curr
                       }
                       return role
                     }, { position: -1 })
}

async function action (msg, args) {
  const responder = new Responder(msg.channel)

  const targetSelector = new TargetSelector()

  const op = args[0]
  const target = args[1]

  delete args[0]
  delete args[1]
  const roleName = args.join(' ').trim()

  console.log(roleName)
  // TODO: Move this to target selection
  const role = msg.channel.guild.roles.find((role) => role.name === roleName)

  if (!role) {
    await responder.error('Role not found').send()
    return
  }

  const highestRole = getMemberHighestRole(msg.member, msg.channel.guild)
  console.log(highestRole.position)
  console.log(role)
  if (highestRole && role.position >= highestRole.position) {
    await responder.error('You must be in a higher role than the one you are trying to assign / remove.').send()
    return
  }

  const member = await targetSelector.find(msg, target)
  // Prompt cancelled
  if (!member) {
    return
  }

  if (op !== 'remove' && member.roles && member.roles.some((roleId) => roleId === role.id)) {
    responder.error('User is already assigned to this role').send()
    return
  } else if (op === 'remove' && member.roles && member.roles.every((roleId) => roleId !== role.id)) {
    responder.error('User is not assigned to this role').send()
    return
  }

  try {
    if (op === 'add') {
      await member.addRole(role.id)
      responder.success(`User ${member.user.username}#${member.user.discriminator} was assigned to role ${role.name}`)
    } else if (op === 'remove') {
      await member.removeRole(role.id)
      responder.success(`User ${member.user.username}#${member.user.discriminator} was removed from role ${role.name}`)
    }
  } catch (e) {
    const error = JSON.parse(e.response)
    responder.error(`Failed with error: ${error.code} - ${error.message} `)
  }

  responder.send()
}

function register (bot) {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
