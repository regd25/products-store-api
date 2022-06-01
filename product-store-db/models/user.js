'use strict'

const { DataTypes} = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = UserModel = (config) => {
  const sequelize = new setupDatabase(config)

  return sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}