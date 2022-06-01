'use strict'

const { DataTypes} = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = ProductModel = (config) => {
  const sequelize = new setupDatabase(config)

  return sequelize.define('product', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  })
}