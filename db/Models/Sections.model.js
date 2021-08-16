const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chapters: [{
    id: {
      type: String,
      required: true
    }
  }]
})

SectionSchema.statics.clearAll = async function () {
  try {
    const response = await SectionsModel.deleteMany({})
    if(response['ok'] === 1) return true
  } catch (error) {
    console.log(error)
    return false
  }
}

SectionSchema.statics.getAll = async function () {
  try {
    return await SectionsModel.find()
  } catch (error) {
    console.log(error)
    return false
  }
}

SectionSchema.statics.findById = async function (id) {
  try {
    return await SectionsModel.findOne({id})
  } catch (error) {
    return false
  }
}

SectionSchema.statics.getChaptersOfSection = async function (sectionId) {
  return await SectionsModel.findOne({id: sectionId})
}

SectionSchema.methods.updateSection = async function (newSection) {
  const {id, title, chapters} = newSection
  this.id = id
  this.title = title
  this.chapters = chapters
  return await this.save()
}

/* SectionSchema.methods.addMany = async function (sections) {
  for (let section in sections) {
    let currentSection = new SectionSchema(section)
    try {
      const response = await currentSection.save()
      console.log(response)
    } catch (error) {
      console.log(error)
      return false
    }
    return true
  }
} */

const SectionsModel = mongoose.model('sections', SectionSchema)

module.exports = {
  SectionsModel
}