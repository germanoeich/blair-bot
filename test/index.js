import chai, { expect } from 'chai'
import { describe, it } from 'mocha'
import dirtyChai from 'dirty-chai'
chai.use(dirtyChai)

describe('Health checks', () => {
  it('Should connect', () => {
    expect(true).to.be.true()
  })
})
