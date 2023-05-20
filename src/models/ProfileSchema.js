const mongoose = require('mongoose')
const { Schema } = mongoose
const Permissions = require('./Permissions')

const profileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
