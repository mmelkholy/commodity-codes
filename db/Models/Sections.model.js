const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chapters: {
    type: Array,
    required: true
  }
})

module.exports = {
  SectionsModel: mongoose.model('sections', SectionSchema)
}