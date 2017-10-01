import Responder from './responder'
import DeleteQueue from './deleteQueue'

export default class OptionSelector {
  constructor (msg, options) {
    this.bot = msg._client
    this.channel = msg.channel
    this.options = options
    this.msg = msg
  }

  async queryUser (optionsMsg, canSelectAll = false, canCancel = true) {
    const responder = new Responder(this.channel)
    const deleteQueue = new DeleteQueue()
    var ret
    do {
      const responseMsg = await responder.waitSingle(this.msg)

      if (responseMsg.content === 'cancel') {
        optionsMsg.delete()
        await responder.success('Prompt cancelled').ttl(10).send()
        ret = 'cancel'
        break
      }

      if (responseMsg.content === 'all') {
        ret = 'all'
        break
      }

      const selectedIndex = parseInt(responseMsg.content)
      if (!Number.isNaN(selectedIndex) && this.options[selectedIndex] !== undefined) {
        return this.options[selectedIndex]
      }

      deleteQueue.deleteAll()

      deleteQueue.add(await responder
                .invalidInput()
                .send())
    } while (true)

    deleteQueue.deleteAll()
    return ret
  }
}
