import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import UnitWorker from './../unitWorker'
import dirtyChai from 'dirty-chai'

chai.use(dirtyChai)

describe('Behaviour - Response', () => {
  it('Should not respond to random things prefixed', (done) => {
    const worker = new UnitWorker()

    setTimeout(() => {
      const msg = worker.getLastMsg()
      expect(msg.author.id).to.be.equal(worker.bot.user.id)
      expect(msg.content).to.be.equal('b!unkncmd')
      done()
    }, 2500)

    worker.sendMsg('b!unkncmd')
  })
})
