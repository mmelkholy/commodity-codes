const DBInitializer = require('express').Router()

const {DataHandler} = require('../services/data-handler.service')
const dataHandler = new DataHandler

/* DBInitializer.get('/', parseQuery, async (req, res) => {
  
  // return res.send(req.query)
  handleFillingCategoryCollection(res, req.parsedParams)
}) */

// Add/Update sections
DBInitializer.get('/sections', async (req, res) => {
  const sections = await dataHandler.requestInfo('sections')
  res.send(sections)
})

// Add/Update Chapters
DBInitializer.get('/chapters', async (req, res) => {
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