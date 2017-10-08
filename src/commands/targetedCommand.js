import TargetSelector from './../lib/util/target-selector'
import Responder from './../lib/messages/responder'
import BaseCommand from './baseCommand'

export default class TargetedCommand extends BaseCommand {
  constructor (info, bot) {
    super(info, bot)
    this.actionOnTarget = info.targetInfo.action
  }

  async action (msg, args, parsedArgs) {
    const responder = new Responder(msg.channel)
    const targetSelector = new TargetSelector()

    if (args.length === 0) {
      responder.error('Specify an user').send()
      return
    }

    let target = await targetSelector.find(msg, parsedArgs._[0])

    let reason
    if (this.info.hasReason) {
      reason = parsedArgs._[1] || parsedArgs.r || ''
    }

    console.log(reason)

    if (!target) {
      return
    }

    try {
      if (this.info.hasReason) {
        await this.actionOnTarget(target, reason, responder)
      } else {
        await this.actionOnTarget(target, responder)
      }
    } catch (e) {
      try {
        const error = JSON.parse(e.response)
        responder.error(`Failed with error: ${error.code} - ${error.message} `).send()
      } catch (e1) {
        console.error('Error 0:', e, 'Error 1:', e1)
      }
    }

    responder.send()
  }
}
