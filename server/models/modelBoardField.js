const mongoose = require('mongoose')

const boardFieldSchema = mongoose.Schema({
   x: Number,
   y: Number,
   available: Boolean,
   name: String,
   oceanOnly: Boolean,
   object: String,
   bonus: [String],
})

module.exports = { boardFieldSchema }
