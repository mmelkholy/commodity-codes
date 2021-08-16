const mongoose = require('mongoose')

const ChapterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  headings: [{
    id: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    leaf: {
      type: Boolean,
      required: true
    }
  }]
})

ChapterSchema.statics.getChapterById = async function (id) {
  return await ChaptersModel.findOne({ id })
}

ChapterSchema.methods.updateChapter = async function (newChapter) {
  const { id, description, section, headings } = newChapter
  this.id = id
  this.description = description
  this.section = section
  this.headings = headings
  return await this.save()
}

const ChaptersModel = mongoose.model('chapters', ChapterSchema)

module.exports = {
  ChaptersModel
}
