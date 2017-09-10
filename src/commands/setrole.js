import TargetSelector from './../lib/util/target-selector'
import Responder from './../lib/messages/responder.js'

const info = {
  name: 'setrole',
  description: 'set someones role (all, noroles available)'
}

async function action (msg, args) {
  const responder = new Responder(msg.channel)

  if (!msg.member.permission.has('manageRoles')) {
    responder.error('You need the "(manageRoles)" permission for that.')
    return
  }

  const targetSelector = new TargetSelector()

  if (args.length < 2) {
    responder.error('Specify a target and a role')
  }
  let member = await targetSelector.find(msg, args[0])

  // Prompt cancelled
  if (member === false) {
    return
  }

  if (!member) {
    responder.error('User not found').send()
    return
  }

  delete args[0]
  const roleName = args.join(' ').trim()
  const role = msg.channel.guild.roles.find((role) => role.name === roleName)

  if (member.roles.some((roleId) => roleId === role.id)) {
    responder.error('User already has this role').send()
    return
  }

  try {
    member.addRole(role.id)
    responder.success(`User ${member.user.username}#${member.user.discriminator} was assigned to role ${roleName}`)
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
