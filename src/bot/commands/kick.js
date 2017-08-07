import TargetSelector from './../../lib/util/target-selector'
import Responder from './../../lib/messages/responder.js'
import { bot } from './../../lib/index.js'

const info = {
  name: 'kick',
  args: '<Username | Userid | User Mention> - target selector capable',
  description: 'kicks someone from the server'
}

async function action (msg, args) {
  var responder = new Responder(msg.channel)

  if (!msg.member.permission.has('kickMembers')) {
    responder.error('You need the "(kickMembers)" permission for that.')
    return
  }

  var targetSelector = new TargetSelector()

  if (args.length === 0) {
    return 'Specify an user'
  }

  var member = await targetSelector.find(msg, args[0])

  // Prompt cancelled
  if (member === false) {
    return
  }

  if (!member) {
    responder.error('User not found')
  } else {
    responder.success(`User ${member.user.username}#${member.user.discriminator} ( ${member.user.id} ) was kicked from the server`)
  }

  responder.send()
}

function register () {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
