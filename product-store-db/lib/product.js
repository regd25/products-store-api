const { Op } = require("sequelize");

module.exports = (ProductModel) => {
  async function findAll() {
    return ProductModel.findAll()
  }

  async function findById(id) {
    return ProductModel.findByPk(id)
  }

  async function findByCode(code) {
    return ProductModel.findOne({
      where: { code }
    })
  }

  async function createOrUpdate(product) {
    const condition = {
      where: {
        [Op.or]: [
          { code: product.code },
          { id: product.id },
        ]
      }
    }
    const existingProduct = await ProductModel.findOne(condition)
    if (existingProduct) {
      const updated = await ProductModel.update(product, condition)
      return updated ? ProductModel.findOne(condition) : existingProduct
    } else {
      const result = await ProductModel.create(product)
      return result.toJSON()
    }
  }

  return {
    createOrUpdate,
    findAll,
    findById,
    findByCode
  }
}