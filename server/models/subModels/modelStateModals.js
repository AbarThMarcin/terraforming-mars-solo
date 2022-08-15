const mongoose = require('mongoose')
const { animationSchema } = require('./modelAnimation')
const { cardSchema } = require('./modelCard')

const stateModalsSchema = mongoose.Schema({
   cardPlayed: Boolean,
   cardWithAction: Boolean,
   cardViewOnly: Boolean,
   cards: Boolean,
   draft: Boolean,
   sellCards: Boolean,
   marsUniversity: Boolean,
   businessContacts: Boolean,
   corp: Boolean,
   corps: Boolean,
   log: Boolean,
   menu: Boolean,
   settings: Boolean,
   rules: Boolean,
   other: Boolean,
   standardProjects: Boolean,
   confirmation: Boolean,
   resource: Boolean,
   production: Boolean,
   selectOne: Boolean,
   selectCard: Boolean,
   animation: Boolean,
   panelCorp: Boolean,
   panelStateGame: Boolean,
   endStats: Boolean,
   modalBusCont: {
      cards: [Number],
      selectCount: Number,
   },
   modalCard: cardSchema,
   modalCards: [cardSchema],
   modalCardsType: String,
   modalSelectOne: {
      card: cardSchema,
      options: [String],
   },
   modalSelectCard: {
      cardIdAction: Number,
      card: cardSchema,
   },
   modalOther: {
      header: String,
      amount: Number,
      data: [mongoose.Schema.Types.Mixed],
   },
   modalResource: {
      cardId: Number,
      amount: Number,
      data: [mongoose.Schema.Types.Mixed],
      resType: String,
   },
   modalProduction: {
      cardIdOrCorpName: mongoose.Schema.Types.Mixed,
      data: [mongoose.Schema.Types.Mixed],
      immProdEffects: [mongoose.Schema.Types.Mixed],
      miningRights: [mongoose.Schema.Types.Mixed],
      miningArea: [mongoose.Schema.Types.Mixed],
   },
   modalConf: {
      text: String,
      onYes: String,
      onNo: String,
   },
   animationData: animationSchema,
})

module.exports = { stateModalsSchema }
