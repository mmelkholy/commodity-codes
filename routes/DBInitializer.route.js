const DBInitializer = require('express').Router()

const { ChaptersModel } = require('../db/Models/Chapters.model')
const { HeadingsModel } = require('../db/Models/headings.model')
const { SectionsModel } = require('../db/Models/Sections.model')
const { DataHandler } = require('../services/data-handler.service')
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
      const { id, title, chapters } = section
      const currentSection = new SectionsModel({
        id, title, chapters
      })
      const sectionResponse = await currentSection.save()
      if (sectionResponse) {
        process.stdout.write(`Writing  to DB section ${currentSection.id} of ${sectionsCount}\r`)
      }
    }
    process.stdout.write('\n COMPLETED!\n')
    console.log(`\n\nWrote ${sectionsCount} sections successfully.\n\n`)
    res.send(sections)
  } else {
    return res.send({ error: 'couldn\'t delete oldies' })
  }

})

// Add/Update Chapters
DBInitializer.get('/chapters/:sectionId', async (req, res) => {
  const sectionId = req.params['sectionId']
  if (!sectionId) return res.status(400).send({ error: 'You must specify which section these chapters should come from.' })

  const section = await SectionsModel.getChaptersOfSection(sectionId)
  if (!section) return res.sendStatus(404)

  let chapters = []
  for (let chapter of section.chapters) {
    chapters.push(chapter.id)
  }
  chapters = await dataHandler.requestInfo('chapters', chapters)
  for (let chapter of chapters) {
    // const currentChapter = new ChaptersModel(chapter)
    // const chapterResult = await currentChapter.save()
    // console.log(chapterResult)
    const { id } = chapter
    const currentChapter = await ChaptersModel.getChapterById(id)
    if (!currentChapter) {
      await new ChaptersModel(chapter).save()
    } else {
      await currentChapter.updateChapter(chapter)
    }
  }
  res.send(chapters)
})

// Add/Update Headings for specific sections
DBInitializer.get('/headings/:chapterIds', async (req, res) => {
  let chapterId = req.params['chapterIds']
  if (!chapterId) return res.sendStatus(404)
  chapterId = chapterId.indexOf('-') ? chapterId.split('-') : [chapterId]
  chaptersArray = []
  headingsArray = []
  let limit = chapterId.length === 1 ? chapterId[0] : chapterId[1]
  // console.log(limit)
  for (let i = Number(chapterId[0]); i <= Number(limit); i++) {
    if (i < 10) {
      chaptersArray.push('0' + i)
    } else {
      chaptersArray.push(i.toString())
    }
  }
  // console.log(chaptersArray)
  for (let chapterId of chaptersArray) {
    const chapter = await ChaptersModel.getChapterById(chapterId)
    console.log(`Fetching Chapter # ${chapterId}`)
    if (!chapter) {
      console.log(`Chapter #${chapterId} not found...`)
    } else {
      let { headings } = chapter
      headings = headings.map(el => {
        return el.id.substr(0, 4)
      })
      let ChaptersHeadingsArray = await dataHandler.requestInfo('headings', headings)
      for (let heading of ChaptersHeadingsArray) {
        const OldHeading = await HeadingsModel.findHeadingById(heading.id)
        if (!OldHeading) {
          await new HeadingsModel(heading).save()
        } else {
          const oldHeading = await HeadingsModel.findHeadingById(heading.id)
          await oldHeading.updateHeading(heading)
        }
      }
      headingsArray.push(...ChaptersHeadingsArray)
    }
  }
  console.log(`Fetched total of ${headingsArray.length} headings from chapters ${chaptersArray}...\n\n`)
  res.send(headingsArray)
})

// Add/Update Commodities for specific headings
DBInitializer.get('/commodities/:headingIdRange', async (req, res) => {
})

module.exports = {
  DBInitializer
}