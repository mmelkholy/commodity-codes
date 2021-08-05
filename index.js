const express = require('express')
require ('./db/db-connect')

const { DBInitializer } = require('./routes/DBInitializer.route')
const { SearchRouter } = require('./routes/search.route')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use ('/search', SearchRouter)
app.use('/fill', DBInitializer)

// console.clear()

app.get('/', (req, res) => res.send('Hello!'))
app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})