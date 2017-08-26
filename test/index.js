import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import { connect } from '/bot/index.js'
import dirtyChai from 'dirty-chai'
import { bot } from '/lib/index.js'

chai.use(dirtyChai)

describe('Health checks', () => {
  it('Should connect without errors', async () => {
    try {
      await connect()
    } catch (e) {
      console.error(e)
      expect.fail(e, 'bot object', 'Bot failed to connect')
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
