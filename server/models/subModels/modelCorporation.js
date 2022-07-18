const mongoose = require('mongoose')

const corporationSchema = mongoose.Schema({
   id: Number,
   name: String,
   production: {
      mln: Number,
      steel: Number,
      titan: Number,
      plant: Number,
      energy: Number,
      heat: Number,
   },
   resources: {
      mln: Number,
      steel: Number,
      titan: Number,
      plant: Number,
      energy: Number,
      heat: Number,
   },
   effects: [String],
   tags: [String],
   actionUsed: Boolean,
   trRaised: Boolean,
})

module.exports = { corporationSchema }
