const mongoose = require('mongoose')
// const { statePlayerSchema } = require('./modelStatePlayer')
// const { stateGameSchema } = require('./modelStateGame')
// const { stateModalsSchema } = require('./modelStateModals')
// const { boardFieldSchema } = require('./modelBoardField')
// const { corporationSchema } = require('./modelCorporation')
// const { cardSchema } = require('./modelCard')
// const { logTypeSchema } = require('./modelLogType')

const gameSchema = mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      statePlayer: {
         // type: statePlayerSchema,
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      stateGame: {
         // type: stateGameSchema,
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      stateModals: {
         // type: stateModalsSchema,
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      stateBoard: {
         // type: [boardFieldSchema],
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      corps: {
         // type: [corporationSchema],
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      initCards: {
         // type: [cardSchema],
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      cardsLeft: {
         // type: [cardSchema],
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      logItems: {
         // type: [logTypeSchema],
         type: mongoose.Schema.Types.Mixed,
         required: true,
      },
      isRanked: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   {
      timestamps: true,
   }
)

module.exports = mongoose.model('games', gameSchema)
