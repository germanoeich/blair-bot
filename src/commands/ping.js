function register (bot) {
  bot.registerCommand('ping', 'Pong!', {
    description: 'Pong!',
    fullDescription: 'This command could be used to check if the bot is up. Or entertainment when you\'re bored.'
  })
}

export default {
  register
}
