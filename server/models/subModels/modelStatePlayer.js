const mongoose = require('mongoose')
const { corporationSchema } = require('./modelCorporation')
const { cardSchema } = require('./modelCard')

const statePlayerSchema = mongoose.Schema({
   corporation: corporationSchema,
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
})

module.exports = { statePlayerSchema }
