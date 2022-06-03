const { assert } = require('chai')
const sinon = require('sinon')
const fixtures = require('./fixtures/product')
const db = require('..')

it('Product', () => {
  console.log(typeof db.Product)
  assert(typeof db.Product === 'undefinied', 'Product should be exists')
})
