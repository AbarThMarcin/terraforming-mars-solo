const mongoose = require('mongoose')
const { boardFieldSchema } = require('./subModels/modelBoardField')

const gameWithIdSchema = mongoose.Schema({
   stateBoard: [boardFieldSchema],
   corps: [Number],
   cards: [Number],
})

module.exports = mongoose.model('games_with_ids', gameWithIdSchema)
