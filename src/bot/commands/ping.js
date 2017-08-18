import { bot } from '/lib/index.js'

const info = {
  name: 'ping',
  description: 'pong!'
}

function action (msg) {
  bot.createMessage(msg.channel.id, ':ping_pong: Pong!').then(function (botMsg) {
    botMsg.edit(`${botMsg.content} - **${botMsg.timestamp - msg.timestamp} ms** `)
  })
}

function register () {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
