const axios = require('axios')

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
    let results = []
    if (numbers.length === 0) {
      const result = await axios.get(url)
      console.log(result.data.data)
      results = result.data.data
    } else {
      for (let number of numbers) {
        url = url + number
        const result = await axios.get(url)
        console.log(result.data.data)
        results.push(result.data.data)
      }
    }
    return results
  }

  async requestInfo(level, numbers = []) {
    if (numbers.length === 0 && ['commodities', 'headings'].includes(level))
      throw new Error(`You can't fetch all the ${level} together! Take it easy on us Dude ;).`)

    const rawData = await this.fetch(level, numbers)
    switch (level) {
      case 'sections':
        return this.processSections(rawData)

      case 'chapters':
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
processChapters(chaptersIdArray) {
  const processedData = []
  for (let chapter in chaptersArray) {
  }
}

// Process chapters
processHeadings(headingsArray) {

}

// Process chapters
processCommoditeis(commoditiesArray) {

}
}

module.exports = {DataHandler}