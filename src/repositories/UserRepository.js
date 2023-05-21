const User = require('../models/UserSchema')

class UserRepository {
  async findAll() {
    const users = await User.find().lean().exec()

    return users
  }

  async findSome(startIndex) {
    const users = await User.find().limit(10).skip(startIndex).exec()

    return users
  }

  async findByIdAndUpdate({
    id,
    name,
    email,
    password,
    pictureUrl,
    profile,
    favorites,
  }) {
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        name,
        email,
        password,
        pictureUrl,
        profile,
        favorites,
        updatedAt: Date.now(),
      },
    )

    await user.save()
    return user
  }

  async findById(id) {
    const user = await User.findOne({ _id: id })

    return user
  }

  async findUsersByProfile(profile) {
    const users = await User.find({ profile }).lean().exec()

    return users
  }

  async findByEmail(email) {
    const user = await User.findOne({ email }).lean().exec()

    return user
  }

  async findByFilter(filter) {
    const users = await User.find({
      name: { $regex: filter, $options: 'i' },
    })
      .lean()
      .exec()

    return users
  }

  async create({ name, email, password, pictureUrl, profile, favorites }) {
    const user = new User({
      name,
      email,
      password,
      pictureUrl,
      profile,
      favorites,
    })

    await user.save()
    return user
  }

  async delete(id) {
    return await User.findOneAndDelete({ _id: id })
  }
}

module.exports = new UserRepository()
