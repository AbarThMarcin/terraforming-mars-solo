const mongoose = require('mongoose')
const { corporationSchema } = require('./modelCorporation')
const { cardSchema } = require('./modelCard')

const statePlayerSchema = mongoose.Schema({
   corporation: {
      type: corporationSchema
   },
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
   cardsInHand: [cardSchema],
   cardsPlayed: [cardSchema],
   valueSteel: Number,
   valueTitan: Number,
   valueGreenery: Number,
   canPayWithHeat: Boolean,
   globParamReqModifier: Number,
   specialDesignEffect: Boolean,
   indenturedWorkersEffect: Boolean,
})

module.exports = { statePlayerSchema }
