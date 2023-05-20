const Profile = require('../models/ProfileSchema')

class ProfileRepository {
  async findAll() {
    const profiles = await Profile.find().lean().exec()

    return profiles
  }

  async findSome(startIndex) {
    const profiles = await Profile.find().limit(10).skip(startIndex).exec()

    return profiles
  }

  async findByIdAndUpdate({ id, title, permissions }) {
    const profile = await Profile.findOneAndUpdate(
      { _id: id },
      {
        title,
        permissions,
        updatedAt: Date.now(),
      },
    )

    await profile.save()
    return profile
  }

  async findById(id) {
    const profile = await Profile.findOne({ _id: id })

    return profile
  }

  async create({ title, permissions }) {
    const profile = new Profile({
      title,
      permissions,
    })

    await profile.save()
    return profile
  }

  async delete(id) {
    await Profile.findOneAndDelete({ _id: id })
  }
}

module.exports = new ProfileRepository()
