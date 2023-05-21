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

  async findByName(title) {
    const profile = await Profile.findOne({ title })

    return profile
  }

  async findByFilter(filter) {
    const profiles = await Profile.find({
      title: { $regex: filter, $options: 'i' },
    })
      .lean()
      .exec()

    return profiles
  }

  async findByIdAndUpdate(id, data) {
    const profile = await Profile.findOneAndUpdate(
      { _id: id },
      {
        ...data,
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

  async deleteProfile(id) {
    return await Profile.findOneAndDelete({ _id: id })
  }
}

module.exports = new ProfileRepository()
