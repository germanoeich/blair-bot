import TargetSelector from './../../lib/util/target-selector'
import Responder from './../../lib/messages/responder'

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

const addInfo = {
  name: 'add',
  usage: 'add <user> <role>',
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

const removeInfo = {
  name: 'remove',
  usage: 'remove <user> <role>',
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

function getMemberHighestRole (member, guild) {
  return member.roles.map((roleId) => guild.roles.get(roleId))
                     .reduce((curr, role) => {
                       if (curr.position > role.position) {
                         return curr
                       }
                       return role
                     }, { position: -1 })
}

async function parseParams (msg, args) {
  const empty = { member: undefined, role: undefined }
  const targetSelector = new TargetSelector()
  const target = args[0]

  delete args[0]
  const roleName = args.join(' ').trim()
  const role = msg.channel.guild.roles.find((role) => role.name === roleName)

  if (!role) {
    const responder = new Responder(msg.channel)
    await responder.error('Role not found').send()
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

async function removeAction (msg, args) {
  const responder = new Responder(msg.channel)

  const {
    member,
    role
  } = await parseParams(msg, args)

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

async function addAction (msg, args) {
  const responder = new Responder(msg.channel)

  const {
    member,
    role
  } = await parseParams(msg, args)

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

async function action (msg, args) {
}

function register (bot) {
  const cmd = bot.registerCommand(info.name, action, info)
  cmd.registerSubcommand(addInfo.name, addAction, addInfo)
  cmd.registerSubcommand(removeInfo.name, removeAction, removeInfo)
}

export default {
  info,
  register
}
