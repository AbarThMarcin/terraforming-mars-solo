const mongoose = require('mongoose')
const { statePlayerSchema } = require('./subModels/modelStatePlayer')
const { stateGameSchema } = require('./subModels/modelStateGame')
const { stateModalsSchema } = require('./subModels/modelStateModals')
const { boardFieldSchema } = require('./subModels/modelBoardField')
const { logTypeSchema } = require('./subModels/modelLogType')

const activeGameSchema = mongoose.Schema({
   id: String,
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
   logItems: [logTypeSchema],
   type: {
      type: String,
      required: true,
   },
   createdAt_ms: {
      type: Number,
      default: Date.now(),
   },
})

module.exports = mongoose.model('active_games', activeGameSchema)
