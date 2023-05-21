const Category = require('../models/CategorySchema')

class CategoryRepository {
  async findAll() {
    const categories = await Category.find()
      .populate([
        {
          path: 'availableProfiles',
          select: '_id title',
        },
      ])
      .lean()
      .exec()

    return categories
  }

  async findSome(startIndex) {
    const categories = await Category.find()
      .populate([
        {
          path: 'availableProfiles',
          select: '_id title',
        },
      ])
      .limit(10)
      .skip(startIndex)
      .exec()

    return categories
  }

  async findByName(title) {
    const category = await Category.findOne({ title })
      .populate([
        {
          path: 'availableProfiles',
          select: '_id title',
        },
      ])
      .lean()
      .exec()

    return category
  }

  async findByFilter(filter) {
    const categories = await Category.find({
      title: { $regex: filter, $options: 'i' },
    })
      .populate([
        {
          path: 'availableProfiles',
          select: '_id title',
        },
      ])
      .lean()
      .exec()

    return categories
  }

  async findByIdAndUpdate(id, updateObject) {
    const category = await Category.findOneAndUpdate(
      { _id: id },
      {
        ...updateObject,
      },
    )

    await category.save()
    return category
  }

  async findById(id) {
    const category = await Category.findOne({ _id: id })
      .populate([
        {
          path: 'availableProfiles',
          select: '_id title',
        },
      ])
      .lean()
      .exec()

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

  async deleteCategory(id) {
    return await Category.findOneAndDelete({ _id: id })
  }
}

module.exports = new CategoryRepository()
