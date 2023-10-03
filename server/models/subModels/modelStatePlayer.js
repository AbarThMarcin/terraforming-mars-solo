const mongoose = require('mongoose')
const { cardSchema } = require('./modelCard')

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
   cardsInHand: [cardSchema],
   cardsPlayed: [cardSchema],
   cardsSeen: [cardSchema],
   cardsPurchased: [cardSchema],
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
