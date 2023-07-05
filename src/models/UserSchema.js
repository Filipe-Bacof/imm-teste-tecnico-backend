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
      unique: true,
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
    passwordResetToken: {
      type: String,
      trim: true,
    },
    passwordResetExpires: {
      type: Date,
      trim: true,
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
