import TargetSelector from './../lib/util/target-selector'
import Responder from './../lib/messages/responder.js'

const info = {
  name: 'role',
  args: '<add|remove> <user> <role>',
  description: 'Add/remove user roles.'
}

async function action (msg, args) {
  const responder = new Responder(msg.channel)

  if (!msg.member.permission.has('manageRoles')) {
    responder.error('You need the "(manageRoles)" permission.').send()
    return
  }

  const targetSelector = new TargetSelector()

  if (args.length < 3) {
    responder.error('Specify an operation, target and a role').send()
    return
  }

  const op = args[0]
  const target = args[1]

  delete args[0]
  delete args[1]
  const roleName = args.join(' ').trim()

  // TODO: Move this to target selection
  const role = msg.channel.guild.roles.find((role) => role.name === roleName)

  const member = await targetSelector.find(msg, args[2])
  // Prompt cancelled
  if (!member) {
    return
  }

  targets.push(member)

  if (target.roles && targets.roles.some((roleId) => roleId === role.id)) {
    responder.error('User already has this role').send()
    return
  }

  try {
    if (op === 'add') {
      await m.addRole(role.id)
    } else if (op === 'remove') {
      return m.removeRole(role.id)
    }

    responder.success(`User ${targets[0].user.username}#${targets[0].user.discriminator} was assigned to role ${role.name}`)
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
