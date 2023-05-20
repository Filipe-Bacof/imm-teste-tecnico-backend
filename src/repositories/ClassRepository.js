const Class = require('../models/ClassSchema')

class ClassRepository {
  async findAll() {
    const classes = await Class.find()
      .populate([{ path: 'creatorUserId' }, { path: 'category' }])
      .lean()
      .exec()

    return classes
  }

  async findSome(startIndex) {
    const classes = await Class.find().limit(10).skip(startIndex).exec()

    return classes
  }

  async findByIdAndUpdate({
    id,
    title,
    classUrl,
    available,
    description,
    creatorUserId,
    category,
  }) {
    const updateClass = await Class.findOneAndUpdate(
      { _id: id },
      {
        title,
        classUrl,
        available,
        description,
        creatorUserId,
        category,
        updatedAt: Date.now(),
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

  async delete(id) {
    await Class.findOneAndDelete({ _id: id })
  }
}

module.exports = new ClassRepository()
