const mongoose = require('mongoose')
const { statePlayerSchema } = require('./subModels/modelStatePlayer')
const { stateGameSchema } = require('./subModels/modelStateGame')
const { stateModalsSchema } = require('./subModels/modelStateModals')
const { boardFieldSchema } = require('./subModels/modelBoardField')
const { corporationSchema } = require('./subModels/modelCorporation')
const { cardSchema } = require('./subModels/modelCard')
const { logTypeSchema } = require('./subModels/modelLogType')

const activeGameSchema = mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      statePlayer: statePlayerSchema,
      stateGame: stateGameSchema,
      stateModals: stateModalsSchema,
      stateBoard: [boardFieldSchema],
      corps: [Number],
      initCards: [Number],
      logItems: [logTypeSchema],
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

module.exports = mongoose.model('active_games', activeGameSchema)
