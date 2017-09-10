import util from 'util'
import Responder from './../lib/messages/responder.js'

const info = {
  name: 'eval',
  description: 'eval'
}

async function action (msg, args) {
  if (msg.member.id !== '227115752396685313') {
    return
  }

  const responder = new Responder(msg.channel)

  var _msg = msg // eslint-disable-line
  var _bot = msg._client // eslint-disable-line
  var _json = util.inspect // eslint-disable-line
  const result = eval(args.join(' ')).substr(0, 1950) // eslint-disable-line

  await responder.code(result, 'Javascript').send()
}

function register (bot) {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
