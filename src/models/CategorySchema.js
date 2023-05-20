const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    availableProfiles: [
      {
        type: mongoose.ObjectId,
        default: [],
        ref: 'Profile',
      },
    ],
  },
  {
    timestamps: true, // adiciona dois campos "created at" e "updated at"
  },
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
