const SearchRouter = require('express').Router()
const axios = require('axios')

SearchRouter.get('/keyword/:keyword', async (req, res) => {
  const keyword = req.params['keyword']
  if (!isNaN(Number(keyword)) || !keyword) {
    return res.sendStatus(400)
  }

  const result = await axios.get(`https://www.trade-tariff.service.gov.uk/api/v2/search_references.json?query[letter]=${keyword}`)
  const data = result.data.data
  // console.log(data)

  if(!data.length) return res.sendStatus(404)
  
  const options = []
  for (let option of data) {
    const {
      title,
      referenced_id: refId,
      referenced_class: type
    } = option.attributes
    options.push({
      type, refId, title
    })
  }
  
  // console.log(data)
  res.send({options})
})

module.exports = {
  SearchRouter
}