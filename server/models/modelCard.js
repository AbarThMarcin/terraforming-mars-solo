const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
   id: Number,
   name: String,
   description: String,
   info: [String],
   originalCost: Number,
   currentCost: Number,
   requirements: [{ type: String, value: Number, other: String }],
   vp: Number,
   tags: [String],
   effect: String,
   effectsToCall: [String],
   units: {
      microbe: Number,
      animal: Number,
      science: Number,
      fighter: Number,
   },
   iconNames: {
      vp: String,
      action: String,
   },
   actionUsed: Boolean,
   timeAdded: Number,
   timePlayed: Number,
})

module.exports = { cardSchema }
