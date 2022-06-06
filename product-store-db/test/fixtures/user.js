'use strict'

const user = {
  id: '4fe0ff52-fcc5-4b7c-8331-fc0b2c06aa1e',
  username: 'jperz',
  name: 'Juan Perez',
  password: '123'
}

const users = [
  user,
  {
    id: 'b47d8377-c202-4325-a803-28ccad7e2ad4',
    username: 'lmdez',
    name: 'Lordes Mendez',
    password: '123',
  },
  {
    id: 'b47d8377-c202-4325-a803-28ccad7e2ad5',
    username: 'lmsdez',
    name: 'Lucia Mendez',
    password: '123',
  }
]

module.exports = {
  single: user,
  all: users,
  findById: id => users.filter(user => user.id === id).shift(),
  findByUsername: username => users.filter(user => user.username === username).shift()
}