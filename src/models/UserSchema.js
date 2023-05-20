const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pictureUrl: {
      type: String,
    },
    profile: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Profile',
    },
    favorites: [
      {
        type: mongoose.ObjectId,
        default: [],
        ref: 'Class',
      },
    ],
  },
  {
    timestamps: true, // adiciona dois campos "created at" e "updated at"
  },
)

const User = mongoose.model('User', userSchema)

module.exports = User
