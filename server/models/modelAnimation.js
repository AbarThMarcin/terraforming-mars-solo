const mongoose = require('mongoose')

const animationSchema = mongoose.Schema({
   resourcesIn: {
      type: String,
      value: Number,
   },
   resourcesOut: {
      type: String,
      value: Number,
   },
   productionIn: {
      type: String,
      value: Number,
   },
   productionOut: {
      type: String,
      value: Number,
   },
   cardIn: {
      type: String,
      value: Number,
   },
   cardOut: {
      type: String,
      value: Number,
   },
})

module.exports = { animationSchema }
