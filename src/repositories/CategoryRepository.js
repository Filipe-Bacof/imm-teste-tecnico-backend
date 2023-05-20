const Category = require('../models/CategorySchema')

class CategoryRepository {
  async findAll() {
    const categories = await Category.find()
      .populate([{ path: 'available_profiles' }])
      .lean()
      .exec()

    return categories
  }

  async findSome(startIndex) {
    const categories = await Category.find().limit(10).skip(startIndex).exec()

    return categories
  }

  async findByName(title) {
    const category = await Category.findOne({ title })

    return category
  }

  async findByIdAndUpdate({ id, title, availableProfiles }) {
    const category = await Category.findOneAndUpdate(
      { _id: id },
      {
        title,
        availableProfiles,
        updatedAt: Date.now(),
      },
    )

    await category.save()
    return category
  }

  async findById(id) {
    const category = await Category.findOne({ _id: id })

    return category
  }

  async create({ title, availableProfiles }) {
    const category = new Category({
      title,
      availableProfiles,
    })

    await category.save()
    return category
  }

  async delete(id) {
    await Category.findOneAndDelete({ _id: id })
  }
}

module.exports = new CategoryRepository()
