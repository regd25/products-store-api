"use strict"
const { expect } = require('chai')
const sinon = require('sinon')
const fixtures = require('./fixtures/product')
const proxyquire = require('proxyquire')
const { Op } = require("sequelize");

const config = {}

const ProductStub = {}

const single = { ...fixtures.single }
const id = "6480ccc0-c3ae-4630-b453-4c82620508cb"
const code = "PANTS"
const newProduct = {
  id: "6480ccc0-c3ae-4630-b453-5c82620500cb",
  code: "SNEAKERS",
  name: "Sneakers",
  price: 12.00,
  inventory: 14
}

let sandbox = null
let db = null

const codeArgs = {
  where: { code }
}

const updateArgs = {
  where: {
    [Op.or]: [
      { code },
      { id },
    ]
  }

}
const createArgs = {
  where: {
    [Op.or]: [
      { code: newProduct.code },
      { id: newProduct.id },
    ]
  }
}

beforeEach(async () => {
  sandbox = sinon.createSandbox()

  //Model findAll stub
  ProductStub.findAll = sandbox.stub()
  ProductStub.findAll.withArgs().returns(fixtures.findAll)

  //Model findByPk
  ProductStub.findByPk = sandbox.stub()
    .withArgs(id).returns(fixtures.findById(id))

  //Model finOne stub
  ProductStub.findOne = sandbox.stub()
  ProductStub.findOne.withArgs(codeArgs).returns(fixtures.findByCode(code))
  ProductStub.findOne.withArgs(updateArgs).returns(single)

  //Model create stub
  ProductStub.create = sandbox.stub()
  ProductStub.create.withArgs(newProduct).returns({
    toJSON() { return newProduct }
  })
  ProductStub.create.withArgs(single).returns({
    toJSON() { return newProduct }
  })

  //Model update stub
  ProductStub.update = sandbox.stub()
  ProductStub.update.withArgs(single, updateArgs).returns(single)

  const setupDatabase = proxyquire('../', {
    './models/product': () => ProductStub
  })
  db = await setupDatabase(config)
})

afterEach(() => sandbox && sinon.resetHistory())

describe('Product', () => {
  it("exist", () => {
    expect(db.Product).to.be.a("object", 'Product should be exists')
  })
  it('#findAll', async () => {
    const products = await db.Product.findAll()

    expect(ProductStub.findAll.called, "Shold be called").to.be.true
    expect(ProductStub.findAll.calledOnce, "Shold be called once").to.be.true
    expect(ProductStub.findAll.calledWith(), "Shold be called without args").to.be.true

    expect(products, "shoud be the same").to.deep.equal(fixtures.findAll)
  })

  it('#findById', async () => {
    const product = await db.Product.findById(id)

    expect(ProductStub.findByPk.called, "Shold be called").to.be.true
    expect(ProductStub.findByPk.calledOnce, "Shold be called once").to.be.true
    expect(ProductStub.findByPk.calledWith(id), "Shold be called with id args").to.be.true

    expect(product, "shoud be the same").to.deep.equal(fixtures.findById(id))
  })

  it('#findByCode', async () => {
    const product = await db.Product.findByCode(code)

    expect(ProductStub.findOne.called, "Shold be called").to.be.true
    expect(ProductStub.findOne.calledOnce, "Shold be called once").to.be.true
    expect(ProductStub.findOne.calledWith(codeArgs), "Shold be called with code rgs").to.be.true

    expect(product, "shoud be the same").to.deep.equal(fixtures.findByCode(code))
  })

  it('#createOrUpdate - new', async () => {
    const product = await db.Product.createOrUpdate(newProduct)

    expect(ProductStub.findOne.called, "Shold be called").to.be.true
    expect(ProductStub.findOne.calledOnce, "Shold be called once").to.be.true
    expect(ProductStub.findOne.calledWith(createArgs), "Shold be called with id or code args").to.be.true

    expect(ProductStub.create.called, "Shold be called").to.be.true
    expect(ProductStub.create.calledOnce, "Shold be called once").to.be.true
    expect(ProductStub.create.calledWith(newProduct), "Shold be called with new products args")

    expect(product, "shoud be the same").to.deep.equal(newProduct)
  })

  it('#createOrUpdate - existing', async () => {
    const product = await db.Product.createOrUpdate(single)

    expect(ProductStub.findOne.called, "Shold be called").to.be.true
    expect(ProductStub.findOne.calledTwice, "Shold be called twice").to.be.true
    expect(ProductStub.findOne.calledWith(updateArgs), "Shold be called with id or code args").to.be.true

    expect(ProductStub.update.called, "Shold be called").to.be.true
    expect(ProductStub.update.calledOnce, "Shold be called once").to.be.true
    expect(ProductStub.update.calledWith(single), "Shold be called with new products args")

    expect(product, "shoud be the same").to.deep.equal(single)
  })
})

