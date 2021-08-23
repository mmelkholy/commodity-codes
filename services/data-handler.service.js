const axios = require('axios')
const { SectionsModel } = require('../db/Models/Sections.model')

class DataHandler {
  constructor() {
    this.baseURL = process.env.BASE_URL
  }

  /**
   * This is our base method for communications with the Global Online Tariff server.
   * We pass the level and a list of numbers or empty array for fetching all of that level.
   * returns an array of objects
   * @param {String} level 
   * @param {Array} numbers 
   * @returns {Array} Objects
   */
  async fetch(level, numbers) {
    const url = `${this.baseURL}${level}/`
    if (numbers.length === 0 || !numbers) {
      let res = await axios.get(url)
      try {
        res = level === 'sections' ? res.data.data : res.data
      } catch (error) {
        console.log(error.message)
      }
      return res
    } else {
      var results = []
      for (let i = 0; i < numbers.length; i++) {
        try {
          let number = numbers[i]
          if (parseInt(number) < 10) number = '0' + parseInt(number)
          let currentUrl = url + number
          console.log(`Fetching ${level} number: ${number}\r`)
          const result = await axios.get(currentUrl)
          results.push(result.data)
        } catch (error) {
          console.log(error.message)
          if (level === 'chapters') {
            const number = numbers[i]
            const section = await SectionsModel.findOne({ "chapters.number": number })
            if (section) {
              section.chapters = section.chapters.filter(value => value != number.toString())
              await section.save()
            }
          }
        }
      }
      process.stdout.write(`\nFinished fetching ${level} numbers: ${numbers}\n\n`)
      return results
    }
    // console.log(results)
    // return results
  }

  async requestInfo(level, numbers = []) {
    if (numbers.length === 0 && ['commodities', 'headings'].includes(level))
      throw new Error(`You can't fetch all the ${level} together! Take it easy on us Dude ;).`)

    const rawData = await this.fetch(level, numbers)
    switch (level) {
      case 'sections':
        return this.processSections(rawData)

      case 'chapters':
        // console.log('GETTING CHAPTERS...')
        return this.processChapters(rawData)

      case 'headings':
        return this.processHeadings(rawData)

      case 'commodities':
        return this.processCommoditeis(rawData)
    }
  }

  // Process the returned results for the sections
  processSections(sectionsArray) {
    const processedData = []
    // sectionsArray = sectionsArray['data']
    for (let section of sectionsArray) {
      const {
        id,
        title,
        chapter_from: chapterFrom,
        chapter_to: chapterTo
      } = section.attributes
      let chapters = []
      for (let i = Number(chapterFrom); i <= Number(chapterTo); i++) {
        chapters.push({
          id: i < 10 ? '0' + i : i.toString()
        })
      }
      processedData.push({
        id,
        title,
        chapters
      })
    }
    // SHOULD HANDLE THE DB HERE
    return processedData
  }

  // Process chapters
  async processChapters(chaptersDetails) {
    // return chaptersArray
    const processedData = []
    // console.log(chaptersDetails)
    for (let rawChapter of chaptersDetails) {
      const {
        data: {
          attributes: {
            goods_nomenclature_item_id: id,
            formatted_description: description,
            section_id: section
          }
        },
        included
      } = rawChapter
      const headings = []

      // We're now parsing the headings inside the INCLUDED property
      for (let property of included) {
        if (property.type === 'heading') headings.push({
          id: property.attributes.goods_nomenclature_item_id,
          description: property.attributes.formatted_description,
          leaf: property.attributes.leaf
        })
      }

      processedData.push({
        id: id.substr(0, 2),
        description,
        section,
        headings
      })
    }
    return processedData
  }

  // Process chapters
  async processHeadings(headingsArray) {
    const processedData = []
    for (let heading of headingsArray) {
      let chapter = heading.included.filter(item => item.type === 'chapter')[0]
      chapter = chapter.attributes.goods_nomenclature_item_id.substr(0, 2)
      let commodities = heading.included.filter(item => {
        return item.type === 'commodity'
      })
      commodities = commodities.map(el => {
        const att = el.attributes
        console.log(el)
        return {
          id: att.goods_nomenclature_item_id,
          sid: el.id,
          description: att.description_plain,
          numberIndents: att.number_indents,
          leaf: att.leaf,
          parentSid: att.parent_sid,
          ancestors: []
        }
      })
      for (let commodity of commodities) {
        if (commodity.numberIndents !== 1 && commodity.parentSid !== null) {
          // CONTINUE HERE!
          let ancestor = {
            id: null,
            sid: commodity.parentSid,
            numberIndents: null
          }
          // const ancestorNode = 
        }
      }
      processedData.push({
        id: heading.data.attributes.goods_nomenclature_item_id.substr(0, 4),
        description: heading.data.attributes.formatted_description,
        chapter,
        commodities
      })
    }
    return processedData
  }

  // Process chapters
  processCommoditeis(commoditiesArray) {

  }
}

module.exports = { DataHandler }