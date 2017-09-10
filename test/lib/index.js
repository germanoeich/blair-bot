import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import { KeyCache, TwinKeyCache } from './../../src/lib/cache'
import dirtyChai from 'dirty-chai'

chai.use(dirtyChai)

describe('Cache test', () => {
  it('Should exist', async () => {
    const keyCache = new KeyCache(1)
    const twinKeyCache = new TwinKeyCache(1)

    expect(keyCache).to.exist()
    expect(twinKeyCache).to.exist()
  })

  describe('KeyCache test', () => {
    it('Should cache items', () => {
      const keyCache = new KeyCache(1)
      keyCache.add('key', 1)

      const retrievedValue = keyCache.retrieve('key')
      expect(retrievedValue).to.be.equal(1)
    })
    it('Should implement isCached properly', () => {
      const keyCache = new KeyCache(1)
      keyCache.add('key', 1)

      const isCached = keyCache.isCached('key')
      expect(isCached).to.be.equal(true)

      const notCached = keyCache.isCached('unk key')
      expect(notCached).to.be.equal(false)
    })
  })
})
