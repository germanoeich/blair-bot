import TargetSelector from './../lib/util/target-selector'
import Responder from './../../lib/messages/responder'

const info = {
  name: 'kick',
  args: '<Username | Userid | User Mention> [Reason] - target selector capable',
  description: 'kicks someone from the server'
}

async function action (msg, args) {
  const responder = new Responder(msg.channel)

  if (!msg.member.permission.has('kickMembers')) {
    responder.error('You need the "(kickMembers)" permission for that.').send()
    return
  }

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

function register (bot) {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
