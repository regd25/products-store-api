const { expect } = require('chai')
const sinon = require('sinon')
const fixtures = require('./fixtures/product')
const proxyquire = require('proxyquire')

const config = {}

const ProductStub = {}

const single = {...fixtures.single }
const id = "6480ccc0-c3ae-4630-b453-4c82620508cb"
const code = "PANTS"


let sandbox = null
let dbInstance = null
const codeArgs =  {
  where: { code }
}
const idArgs = {
  where: { id }
}

const newProduct = {
  id: "6480ccc0-c3ae-4630-b453-5c82620500cb",
  code: "SNEAKERS",
  name: "Sneakers",
  price: 12.00,
  inventory: 14
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

  //Model create stub
  ProductStub.create = sandbox.stub()
  ProductStub.create.withArgs(newProduct).returns({
    toJSON() { return newProduct }
  })

  //Model update stub
  ProductStub.update = sandbox.stub()
  ProductStub.update.withArgs(single, idArgs).returns(single)

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
    const agents = await db.Product.findAll()
    console.log(ProductStub.findAll())
    // expect(, "Shold be called")
  })

  // it('#findById', () => {

  // })

  // it('#findByCode', () => {

  // })

  // it('#create', () => {

  // })

  // it('#update', () => {

  // })
})

