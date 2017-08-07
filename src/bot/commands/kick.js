import TargetSelector from './../../lib/util/target-selector'
import Responder from './../../lib/messages/responder.js'

async function action (msg, args) {
  var targetSelector = new TargetSelector()
  var responder = new Responder(msg.channel)

  if (args.length === 0) {
    return 'Specify an user'
  }

  var user = await targetSelector.find(msg, args[0])

  // Prompt cancelled
  if (user === false) {
    return
  }

  if (!user) {
    responder.error('User not found')
  } else {
    responder.success(`User ${user.username}#${user.discriminator} ( ${user.id} ) was kicked from the server`)
  }
  console.log(user)
  responder.send()
}

function register (bot) {
  bot.registerCommand('kick', action, {
    description: 'Kicks someone',
    fullDescription: 'This command could be used to check if the bot is up. Or entertainment when you\'re bored.'
  })
}

export default {
  register
}
