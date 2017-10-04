import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import UnitWorker from './../unitWorker'
import dirtyChai from 'dirty-chai'

chai.use(dirtyChai)

describe('Ping', () => {
  it('Should respond', async () => {
    const worker = new UnitWorker()

    const msg = await worker.sendAndWait('b!ping')

    expect(msg.content).to.be.a('string')
    expect(msg.author.id).to.not.be.equal(worker.bot.user.id)
    expect(msg.content.indexOf('Pong') > 0).to.be.true()
  })
})
