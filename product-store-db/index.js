'use strict'
const setupDatabase = require('./lib/db')
const setupProductModel = require('./models/product')
const setupUserModel = require('./models/user')
const setupProduct = require('./lib/product')
const setupUser = require('./lib/user')

module.exports = async (config) => {

  config = {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    },
    ...config
  }

  const connection = setupDatabase(config)
  const ProductModel = setupProductModel(config)
  const UserModel = setupUserModel(config)

  await connection.authenticate()

  if(config.setup) {
    await sequelize.sync({ force: true })
  }

  const Product = setupProduct(ProductModel)
  // const User = setupUser(UserModel)

  return {
    Product,
    // User
  }
}