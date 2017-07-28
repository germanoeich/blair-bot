let _bot

function action (msg) {
  _bot.createMessage(msg.channel.id, ':ping_pong: Pong!').then(function (botMsg) {
    botMsg.edit(`${botMsg.content} - **${botMsg.timestamp - msg.timestamp} ms** `)
  })
}

function register (bot) {
  _bot = bot
  bot.registerCommand('ping', action, {
    description: 'Pong!',
    fullDescription: 'This command could be used to check if the bot is up. Or entertainment when you\'re bored.'
  })
}

export default {
  register
}
