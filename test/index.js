import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import { connect } from './../../src/index.js'
import dirtyChai from 'dirty-chai'
import { bot } from './../../src/lib/index.js'

chai.use(dirtyChai)

describe('Health checks', () => {
  it('Should connect without errors', async () => {
    try {
      await connect()
    } catch (e) {
      console.error(e)
      expect.fail(e, '', 'Bot failed to connect')
    }
  })

  it('Should export bot object', (done) => {
    // Give some time for the bot to initialize properly
    setTimeout(() => {
      expect(bot).to.be.ok()
      expect(bot.ready).to.equal(true)
      done()
    }, 2000)
  })
})
