const mongoose = require('mongoose')

const headingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  chapter: {
    type: String,
    required: true
  },
  commodities: [{
    id: {
      type: String,
      required: true
    },
    sid: {
      type: String,
      reuiqred: true
    },
    dbId: {
      type: String,
      reuiqred: true
    },
    description: {
      type: String,
      required: true
    },
    numberIndents: {
      type: Number,
      required: true
    },
    leaf: {
      type: String,
      required: true
    },
    ancestors: [{
      id: String,
      sid: String,
      numberIndents: Number
    }]
  }]
})

headingSchema.statics.findHeadingById = async function (id) {
  return await this.findOne({ id })
}

headingSchema.methods.updateHeading = async function (newHeading) {
  for (let property in newHeading) {
    this[property] = newHeading[property]
  }
  return await this.save()
}

const HeadingsModel = mongoose.model('headings', headingSchema)

module.exports = { HeadingsModel }