const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
   id: Number,
   currentCost: Number,
   vp: Number,
   units: {
      microbe: Number,
      animal: Number,
      science: Number,
      fighter: Number,
   },
   actionUsed: {
      type: Boolean,
      required: false
   },
   timeAdded: {
      type: Number,
      required: false
   },
   timePlayed: {
      type: Number,
      required: false
   },
})

module.exports = { cardSchema }
