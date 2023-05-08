const asyncHandler = require('express-async-handler')
const ActiveGame = require('../models/modelActiveGame')

const getActiveGame = asyncHandler(async (req, res) => {
   const game = await ActiveGame.findOne({ user: req.user._id, type: req.body.type })

   if (game) {
      res.status(200).json(game)
   } else {
      res.status(404)
      throw new Error('Game not found')
   }
})

const createActiveGame = asyncHandler(async (req, res) => {
   const { id, statePlayer, stateGame, stateModals, stateBoard, corps, logItems } = req.body.gameData
   const type = req.body.type

   const newGame = new ActiveGame({
      id,
      user: req.user._id,
      statePlayer,
      stateGame,
      stateModals,
      stateBoard,
      corps,
      logItems,
      type,
   })

   const createdGame = await newGame.save()
   res.status(201).json(createdGame)
})

const deleteActiveGame = asyncHandler(async (req, res) => {
   const game = await ActiveGame.findOne({ user: req.user._id, type: req.body.type })

   if (game) {
      await game.remove()
      res.json(game)
   } else {
      res.status(404)
      throw new Error('Game not Found')
   }
})

const updateActiveGame = asyncHandler(async (req, res) => {
   const { id, statePlayer, stateGame, stateModals, stateBoard, corps, logItems } = req.body.gameData
   const type = req.body.type

   const game = await ActiveGame.findOne({ user: req.user._id, type })
   if (game) {
      ActiveGame.updateOne(
         { user: req.user._id, type },
         {
            id: id === undefined ? game.id : id,
            statePlayer: statePlayer === undefined ? game.statePlayer : statePlayer,
            stateGame: stateGame === undefined ? game.stateGame : stateGame,
            stateModals: stateModals === undefined ? game.stateModals : stateModals,
            stateBoard: stateBoard === undefined ? game.stateBoard : stateBoard,
            corps: corps === undefined ? game.corps : corps,
            logItems: logItems === undefined ? game.logItems : logItems,
         },
         function () {
            res.status(201).json({ message: 'success' })
         }
      )
   } else {
      res.status(404)
      throw new Error('Game not found')
   }
})

module.exports = { getActiveGame, createActiveGame, deleteActiveGame, updateActiveGame }
