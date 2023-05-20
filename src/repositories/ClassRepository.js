const Class = require('../models/ClassSchema')

class ClassRepository {
  async findAll() {
    const classes = await Class.find()

      .lean()
      .exec()

    return classes
  }

  async findSome(startIndex) {
    const classes = await Class.find().limit(10).skip(startIndex).exec()

    return classes
  }

  async findByName(title) {
    const oneClass = await Class.findOne({ title })

    return oneClass
  }

  async findAvailable() {
    const availableClasses = await Class.find({
      available: true,
    })

      .lean()
      .exec()

    return availableClasses
  }

  async handleAvailability({ id, available }) {
    const updateClass = await Class.findOneAndUpdate(
      { _id: id },
      {
        available,
        updatedAt: Date.now(),
      },
    )

    await updateClass.save()
    return updateClass
  }

  async findByIdAndUpdate(id, updatingData) {
    const updateClass = await Class.findOneAndUpdate(
      { _id: id },
      {
        ...updatingData,
      },
    )

    await updateClass.save()
    return updateClass
  }

  async findById(id) {
    const oneClass = await Class.findOne({ _id: id })

    return oneClass
  }

  async create({
    title,
    classUrl,
    available,
    description,
    creatorUserId,
    category,
  }) {
    const createClass = new Class({
      title,
      classUrl,
      available,
      description,
      creatorUserId,
      category,
    })

    await createClass.save()
    return createClass
  }

  async deleteClass(id) {
    return await Class.findOneAndDelete({ _id: id })
  }
}

module.exports = new ClassRepository()
