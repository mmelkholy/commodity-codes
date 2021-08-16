const mongoose = require('mongoose')

const { SectionsModel } = require('./Models/Sections.model')
const { ChaptersModel } = require('./Models/Chapters.model')

// Adds objects to specific model
async function add(model, objects) {
  switch (model) {
    case 'sections':
      for (let section of objects) {
        const { id } = section
        const currentSection = await SectionsModel.findById(id)
        if (!currentSection) {
          return await new SectionsModel(section).save()
        } else {
          return await currentSection.updateSection(section)
        }
      }
      break

    case 'chapters':
      break

    case 'headings':
      break

    case 'commodieties':
      break
  }
}