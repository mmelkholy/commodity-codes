const DBInitializer = require('express').Router()

const { SectionsModel } = require('../db/Models/Sections.model')
const {DataHandler} = require('../services/data-handler.service')
const dataHandler = new DataHandler

/* DBInitializer.get('/', parseQuery, async (req, res) => {
  
  // return res.send(req.query)
  handleFillingCategoryCollection(res, req.parsedParams)
}) */

// Add/Update sections
DBInitializer.get('/sections', async (req, res) => {
  const sections = await dataHandler.requestInfo('sections')
  const sectionsCount = sections.length
  console.log(`Got ${sectionsCount} sections.`)
  console.log(`Saving sections to DB...\n`)
  const deleteConfirmation = await SectionsModel.clearAll()
  if (deleteConfirmation) {
    for (let section of sections) {
      const {id, title, chapters} = section
      const currentSection = new SectionsModel({
        id, title, chapters
      })
      const sectionResponse = await currentSection.save()
      if (sectionResponse) {
        process.stdout.write(`Writing  to DB section ${currentSection.id} of ${sectionsCount}\r`)
      }
    }
    process.stdout.write('\n COMPLETED!\n')
    console.log(`Wrote ${sectionsCount} sections successfully.`)
    res.send(sections)
  } else {
    return res.send({error: 'couldn\'t delete oldies'})
  }

})

// Add/Update Chapters
DBInitializer.get('/chapters/:sectionId', async (req, res) => {
  const sectionId = req.params['sectionId']
  if (!sectionId) return res.status(400).send({ error: 'You must specify which section these chapters should come from.' })
  
  const section = await SectionsModel.getChaptersOfSection(sectionId)
  if (!section) return res.sendStatus(404)
  console.log(section)

    const chapters = []
    for (let number of section.chapters) {
      chapters.push(number)
    }
  console.log(chapters)
  res.send({chapters})
})

// Add/Update Headings for specific sections
DBInitializer.get('/headings/:chapterIds', async (req, res) => {
})

// Add/Update Commodities for specific headings
DBInitializer.get('/commodities/:headingIds', async (req, res) => {
})



module.exports = {
  DBInitializer
}