import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import { connect } from '/bot/index.js'
import dirtyChai from 'dirty-chai'

chai.use(dirtyChai)

describe('Health checks', () => {
  it('Should connect', async () => {
    try {
      const bot = await connect()
      expect(bot).to.be.ok()
    } catch (e) {
      expect.fail(e, 'bot object', 'Bot failed to connect')
    }
  })
})
