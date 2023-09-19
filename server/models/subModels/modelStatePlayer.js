const mongoose = require('mongoose')
const { cardShortSchema } = require('./modelCard')

const statePlayerSchema = mongoose.Schema({
   corporation: Number,
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
   cardsDeckIds: [Number],
   cardsDrawIds: [Number],
   cardsInHand: [cardShortSchema],
   cardsPlayed: [cardShortSchema],
   cardsSeen: [cardShortSchema],
   cardsPurchased: [cardShortSchema],
   valueSteel: Number,
   valueTitan: Number,
   valueGreenery: Number,
   canPayWithHeat: Boolean,
   globParamReqModifier: Number,
   specialDesignEffect: Boolean,
   indenturedWorkersEffect: Boolean,
   totalPoints: Number,
})

module.exports = { statePlayerSchema }
