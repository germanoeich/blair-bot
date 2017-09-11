import util from 'util'
import Responder from './../lib/messages/responder.js'

const info = {
  name: 'eval',
  argsRequired: true,
  requirements: {
    userIDs: ['227115752396685313']
  },
  permissionMessage: ''
}

async function action (msg, args) {
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
