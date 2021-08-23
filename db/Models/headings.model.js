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
    parentSid: {
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

// Find the immediate parent of a commodity in this heading
headingSchema.methods.getImmediateParent = function (commoditySid) {
  const currentCommodity = this.commodities.find(commodity => commodity.sid === commoditySid)
  // console.log(currentCommodity)
  if (currentCommodity.parentSid) {
    const parent = this.commodities.find(commodity => commodity.sid === currentCommodity.parentSid)
    return {
      id: parent.id,
      sid: parent.sid,
      numberIndents: parent.numberIndents
    }
  } else {
    return null
  }
}

// Find the whole ancestry of a commodity in this heading
headingSchema.methods.getAncestry = function (commoditySid) {
  const currentCommodity = this.commodities.find(commodity => commodity.sid === commoditySid)
  if (currentCommodity.parentSid) {
    let ancestry = []
    ancestry.push(this.getImmediateParent(commoditySid))
    for (let i = currentCommodity.numberIndents; i > 0; --i) {
      for (let parent of ancestry) {
        if (parent && parent.numberIndents === i) {
          const theParent = this.getImmediateParent(parent.sid)
          if (theParent) ancestry.push(theParent)
        }
      }
    }
    return ancestry
  } else {
    return null
  }
}

// Construct the ancestry tree for the commodities inside each 
headingSchema.pre('save', function () {
  for (let commodity of this.commodities) {
    commodity.ancestors = this.getAncestry(commodity.sid)
  }
})

const HeadingsModel = mongoose.model('headings', headingSchema)

module.exports = { HeadingsModel }