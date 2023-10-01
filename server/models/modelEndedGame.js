const mongoose = require('mongoose')
const { logTypeSchema } = require('./subModels/modelLogType')
const { cardShortSchema } = require('./subModels/modelCard')
const { boardFieldSchema } = require('./subModels/modelBoardField')

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
      type: Number,
      required: false,
   },
   cards: {
      played: {
         type: [cardShortSchema],
         required: true,
      },
      seen: {
         type: [cardShortSchema],
         required: true,
      },
      purchased: {
         type: [cardShortSchema],
         required: true,
      },
      inDeck: [Number],
   },
   initStateBoard: [boardFieldSchema],
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
   startTime: Date,
   endTime: Date,
   durationSeconds: Number,
})

module.exports = mongoose.model('ended_games', endedGameSchema)
