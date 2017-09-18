import util from 'util'
import Responder from './../../lib/messages/responder'
import BaseCommand from './../baseCommand'

export class EvalCmd extends BaseCommand {
  constructor (bot) {
    let info = {
      name: 'eval',
      argsRequired: true,
      requirements: {
        userIDs: ['227115752396685313']
      },
      permissionMessage: ''
    }

    super(info, bot)
  }
  async action (msg, args) {
    const responder = new Responder(msg.channel)

    // context variables to be used by eval
    var _msg = msg // eslint-disable-line no-unused-vars
    var _bot = msg._client // eslint-disable-line no-unused-vars
    var _json = util.inspect // eslint-disable-line no-unused-vars
    let result = eval(args.join(' ')) // eslint-disable-line no-eval

    if (result) {
      result = result.substr(0, 1950)
    }

    await responder.code(result, 'Javascript').send()
  }
}

export default EvalCmd
