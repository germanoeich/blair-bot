import chai, { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import UnitWorker from './../unitWorker'
import redis from './../../src/data/redis'
import dirtyChai from 'dirty-chai'

chai.use(dirtyChai)

let redisClient

describe('Prefix', () => {
  before(async () => {
    redisClient = await redis.connect()
    await redisClient.del('guild_prefix:348152871507984395')
  })

  it('Should respond with default prefix when none is set', async () => {
    const worker = new UnitWorker()

    const msg = await worker.sendAndWait('b!prefix')
    expect(msg.content.endsWith('b!')).to.be.true()
  })

  it('Should change the prefix on Redis correctly', async () => {
    const worker = new UnitWorker()
    await worker.sendAndWait('b!prefix test!')

    const value = await redisClient.get('guild_prefix:348152871507984395')

    expect(value).to.be.ok()
    expect(value).to.equal('test!')
  })

  it('Should respond with a custom prefix', async () => {
    const worker = new UnitWorker()

    const msg = await worker.sendAndWait('test!prefix')
    expect(msg.content.endsWith('test!')).to.be.true()
  })

  after(async () => {
    await redisClient.del('guild_prefix:348152871507984395')
    redisClient.disconnect()
  })
})
