const info = {
  name: 'ping',
  description: 'pong!'
}

let _bot

function action (msg) {
  _bot.createMessage(msg.channel.id, ':ping_pong: Pong!').then(function (botMsg) {
    botMsg.edit(`${botMsg.content} - **${botMsg.timestamp - msg.timestamp} ms** `)
  })
}

function register (bot) {
  _bot = bot
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
