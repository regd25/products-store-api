'use strict'

const { DataTypes} = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = (config) => {
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
    },
    inventory: {
      type: DataTypes.INTEGER,
      default: 0
    }
  })
}