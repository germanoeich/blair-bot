import TargetSelector from './../../lib/util/target-selector'

async function action (msg, args) {
  var targetSelector = new TargetSelector()

  if (args.length === 0) {
    return 'Specify an user'
  }

  var user = await targetSelector.find(msg, args[0])

  return user.mention
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
