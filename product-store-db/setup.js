'use-strict'
const db = require('./')
const inquirer = require('inquirer')
const chalk = require('chalk')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you shure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Canceled')
  }

  const config = {
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    setup: true,
  }
  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}
function handleFatalError (error) {
  console.error(`${chalk.bold.red('[fatal error]')} ${error.message}`)
  console.error(chalk.red(error.stack))
  process.exit(1)
}

setup()