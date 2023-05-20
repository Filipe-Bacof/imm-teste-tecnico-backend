const mongoose = require('mongoose')
const { Schema } = mongoose

const classSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    classUrl: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
    creatorUserId: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
    category: [
      {
        type: mongoose.ObjectId,
        default: [],
        ref: 'Category',
      },
    ],
  },
  {
    timestamps: true, // adiciona dois campos "created at" e "updated at"
  },
)

const Class = mongoose.model('Class', classSchema)

module.exports = Class
