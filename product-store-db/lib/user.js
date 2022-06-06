'use strict'

module.exports = (UserModel) => {

  async function findAll() {
    return UserModel.findAll()
  }

  async function findByUsername(username) {
    return UserModel.findOne({
      where: { username }
    })
  }

  async function findById(id) {
    return UserModel.findByPk(id)
  }

  async function createOrUpdate(user) {
    const condition = {
      where: {
        id: user.id
      }
    }
    const existingUser = await UserModel.findOne(condition)

    if (existingUser) {
      const updated = await UserModel.update(user, condition)
      return updated ? UserModel.findOne(condition) : existingUser
    }else {
      const result = await UserModel.create(user)
      return result.toJSON()
    }
  }

  return {
    findAll,
    findByUsername,
    findById,
    createOrUpdate,
  }
}