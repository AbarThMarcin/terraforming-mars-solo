const mongoose = require('mongoose')

const logTypeSchema = mongoose.Schema({
   type: String,
   title: String,
   titleIcon: mongoose.Schema.Types.Mixed,
   details: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
   },
   action: {
      type: String,
      required: false,
   },
})

module.exports = { logTypeSchema }
