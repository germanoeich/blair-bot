import TargetSelector from './../lib/util/target-selector'
import Responder from './../lib/messages/responder'
import BaseCommand from './baseCommand'

export default class TargetedCommand extends BaseCommand {
  constructor (info, bot) {
    super(info, bot)
    this.actionOnTarget = info.targetInfo.action
  }

  async action (msg, args) {
    const responder = new Responder(msg.channel)
    const targetSelector = new TargetSelector()

    if (args.length === 0) {
      responder.error('Specify an user').send()
      return
    }

    let target = await targetSelector.find(msg, args[0])
    const reason = args[1] || ''
    if (!target) {
      return
    }

    try {
      await this.actionOnTarget(target, reason, responder)
    } catch (e) {
      const error = JSON.parse(e.response)
      responder.error(`Failed with error: ${error.code} - ${error.message} `)
    }

    responder.send()
  }
}
