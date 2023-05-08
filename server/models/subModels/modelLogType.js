const mongoose = require('mongoose')

const logTypeSchema = mongoose.Schema({
   type: String,
   data: mongoose.Schema.Types.Mixed,
   details: mongoose.Schema.Types.Mixed,
})

module.exports = { logTypeSchema }
