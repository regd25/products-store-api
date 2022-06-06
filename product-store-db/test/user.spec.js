"use strict"
const { expect } = require('chai')
const sinon = require('sinon')
const fixtures = require('./fixtures/user')
const proxyquire = require('proxyquire')

const config = {
  logging: () => {}
}

const UserStub = {}

const single = { ...fixtures.single }
const id = "4fe0ff52-fcc5-4b7c-8331-fc0b2c06aa1e"
const username = "jperz"
const newUser = {
  id: "6480ccc0-c3ae-4630-b453-5c82620500cd",
  username: "dgzlz",
  name: "Daniel Gonzalez",
  password: "123",
}

let sandbox = null
let db = null

const usernameArgs = {
  where: { username }
}

const idArgs = {
  where: {
    id
  }
}

beforeEach(async () => {
  sandbox = sinon.createSandbox()

  //Model findAll stub
  UserStub.findAll = sandbox.stub()
  UserStub.findAll.withArgs().returns(fixtures.findAll)

  //Model findByPk
  UserStub.findByPk = sandbox.stub()
    .withArgs(id).returns(fixtures.findById(id))

  //Model finOne stub
  UserStub.findOne = sandbox.stub()
  UserStub.findOne.withArgs(usernameArgs).returns(fixtures.findById(id))
  UserStub.findOne.withArgs(idArgs).returns(single)

  //Model create stub
  UserStub.create = sandbox.stub()
  UserStub.create.withArgs(newUser).returns({
    toJSON() { return newUser }
  })


  //Model update stub
  UserStub.update = sandbox.stub()
  UserStub.update.withArgs(single, idArgs).returns(single)

  const setupDatabase = proxyquire('../', {
    './models/user': () => UserStub
  })
  db = await setupDatabase(config)
})

afterEach(() => sandbox && sinon.resetHistory())

describe('User', () => {
  it("exist", () => {
    expect(db.User).to.be.a("object", 'User should be exists')
  })
  it('#findAll', async () => {
    const products = await db.User.findAll()

    expect(UserStub.findAll.called, "Shold be called").to.be.true
    expect(UserStub.findAll.calledOnce, "Shold be called once").to.be.true
    expect(UserStub.findAll.calledWith(), "Shold be called without args").to.be.true

    expect(products, "shoud be the same").to.deep.equal(fixtures.findAll)
  })

  it('#findById', async () => {
    const product = await db.User.findById(id)

    expect(UserStub.findByPk.called, "Shold be called").to.be.true
    expect(UserStub.findByPk.calledOnce, "Shold be called once").to.be.true
    expect(UserStub.findByPk.calledWith(id), "Shold be called with id args").to.be.true

    expect(product, "shoud be the same").to.deep.equal(fixtures.findById(id))
  })

  it('#findByUsername', async () => {
    const product = await db.User.findByUsername(username)

    expect(UserStub.findOne.called, "Shold be called").to.be.true
    expect(UserStub.findOne.calledOnce, "Shold be called once").to.be.true
    expect(UserStub.findOne.calledWith(usernameArgs), "Shold be called with username args").to.be.true

    expect(product, "shoud be the same").to.deep.equal(fixtures.findByUsername(username))
  })

  it('#createOrUpdate - new', async () => {
    const product = await db.User.createOrUpdate(newUser)

    expect(UserStub.findOne.called, "Shold be called").to.be.true
    expect(UserStub.findOne.calledOnce, "Shold be called once").to.be.true

    expect(UserStub.create.called, "Shold be called").to.be.true
    expect(UserStub.create.calledOnce, "Shold be called once").to.be.true
    expect(UserStub.create.calledWith(newUser), "Shold be called with new products args")

    expect(product, "shoud be the same").to.deep.equal(newUser)
  })

  it('#createOrUpdate - existing', async () => {
    const product = await db.User.createOrUpdate(single)

    expect(UserStub.findOne.called, "Shold be called").to.be.true
    expect(UserStub.findOne.calledTwice, "Shold be called twice").to.be.true
    expect(UserStub.findOne.calledWith(idArgs), "Shold be called with id or code args").to.be.true

    expect(UserStub.update.called, "Shold be called").to.be.true
    expect(UserStub.update.calledOnce, "Shold be called once").to.be.true
    expect(UserStub.update.calledWith(single), "Shold be called with new products args")

    expect(product, "shoud be the same").to.deep.equal(single)
  })
})

