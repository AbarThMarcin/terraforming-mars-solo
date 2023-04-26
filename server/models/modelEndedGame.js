const mongoose = require('mongoose')
const { cardSchema } = require('./subModels/modelCard')
const { corporationSchema } = require('./subModels/modelCorporation')
const { logTypeSchema } = require('./subModels/modelLogType')

const pointsSchema = mongoose.Schema({
   tr: Number,
   greenery: Number,
   city: Number,
   vp: Number,
   total: Number,
})

const endedGameSchema = mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   season: {
      type: Number,
      required: true,
   },
   forfeited: {
      type: Boolean,
      required: true,
      default: false,
   },
   victory: {
      type: Boolean,
      required: true,
      default: false,
   },
   corporation: {
      type: corporationSchema,
      required: false,
   },
   cards: {
      played: {
         type: [cardSchema],
         required: true,
      },
      seen: {
         type: [cardSchema],
         required: true,
      },
      purchased: {
         type: [cardSchema],
         required: true,
      },
      inDeck: [Number],
   },
   logItems: [logTypeSchema],
   points: {
      type: pointsSchema,
      required: true,
      default: {
         tr: 0,
         greenery: 0,
         city: 0,
         vp: 0,
         total: 0,
      },
   },
   comment: {
      type: String,
      required: false,
   },
   link: {
      type: String,
      required: false,
   },
   time: {
      type: Number,
      required: false,
   },
})

module.exports = mongoose.model('ended_games', endedGameSchema)
