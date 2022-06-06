'use strict'

const product = {
  id: "6480ccc0-c3ae-4630-b453-4c82620508cb",
  code: "PANTS",
  name: "Pants",
  price: 5.00,
  inventory: 5,
}

const products = [
  product,
  {
    ...product,
    id: "6480ccc0-c3ae-4630-b453-4c82620508cc",
    code: "T-SHIRTS",
    name: "T Shirts",
  },
  {
    ...product,
    id: "6480ccc0-c3ae-4630-b453-4c82620508cd",
    code: "HATS",
    name: "hats",
  }
]

module.exports = {
  single: product,
  all: products,
  findById: id => products.filter(p => p.id === id).shift(),
  findByCode: code => products.filter(p => p.code === code).shift()
}