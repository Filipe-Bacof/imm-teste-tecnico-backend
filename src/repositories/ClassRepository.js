const Class = require('../models/ClassSchema')

class ClassRepository {
  async findAll() {
    const classes = await Class.find({ available: true })
      .populate([
        {
          path: 'category',
          select: '_id title availableProfiles',
          populate: {
            path: 'availableProfiles',
            select: '_id title',
          },
        },
      ])
      .lean()
      .exec()

    return classes
  }

  async findSome(startIndex) {
    const classes = await Class.find({ available: true })
      .populate([
        {
          path: 'category',
          select: '_id title availableProfiles',
          populate: {
            path: 'availableProfiles',
            select: '_id title',
          },
        },
      ])
      .limit(10)
      .skip(startIndex)
      .exec()

    return classes
  }

  async findByName(title) {
    const oneClass = await Class.findOne({ title })
      .populate([
        {
          path: 'category',
          select: '_id title availableProfiles',
          populate: {
            path: 'availableProfiles',
            select: '_id title',
          },
        },
      ])
      .lean()
      .exec()

    return oneClass
  }

  async findByFilter(filter) {
    const classes = await Class.find({
      title: { $regex: filter, $options: 'i' },
    })
      .populate([
        {
          path: 'category',
          select: '_id title availableProfiles',
          populate: {
            path: 'availableProfiles',
            select: '_id title',
          },
        },
      ])
      .lean()
      .exec()

    return classes
  }

  async findAvailable() {
    const availableClasses = await Class.find({
      available: true,
    })
      .populate([
        {
          path: 'category',
          select: '_id title availableProfiles',
          populate: {
            path: 'availableProfiles',
            select: '_id title',
          },
        },
      ])
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
      .populate([
        {
          path: 'category',
          select: '_id title availableProfiles',
          populate: {
            path: 'availableProfiles',
            select: '_id title',
          },
        },
      ])
      .lean()
      .exec()

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
