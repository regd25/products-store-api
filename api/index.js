'use strict'

const express = require('express')
const chalk = require('chalk')
const config = require('./config')

const app = express()


app.listen(config.port, () => {
  console.log(`${chalk.green('[product-store:api]')} server listen on port ${config.port}`)
})