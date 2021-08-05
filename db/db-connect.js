const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://127.0.0.1:27017/commodity_code?readPreference=primary&appname=MongoDB%20Compass&ssl=false')

const db = mongoose.connection

db.on('error', e => {
  console.log('### FALIED TO CONNECT TO THE BATATBASE ###')
  console.log(e)
  console.log('##########################################')
})

db.once('open', () => {
  console.log('Connected to DB!')
})
