const mongoose = require('mongoose')

const animationItemSchema = mongoose.Schema({
   type: String,
   value: Number,
})

const animationSchema = mongoose.Schema({
   resourcesIn: animationItemSchema,
   resourcesOut: animationItemSchema,
   productionIn: animationItemSchema,
   productionOut: animationItemSchema,
   cardIn: animationItemSchema,
   cardOut: animationItemSchema,
})

module.exports = { animationSchema }
