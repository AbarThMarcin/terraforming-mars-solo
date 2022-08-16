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
   const {
      statePlayer,
      stateGame,
      stateModals,
      stateBoard,
      corps,
      initCards,
      logItems,
   } = req.body.gameData
   const type = req.body.type

   const newGame = new ActiveGame({
      user: req.user._id,
      statePlayer,
      stateGame,
      stateModals,
      stateBoard,
      corps,
      initCards,
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
      res.json({ message: 'Game Removed' })
   } else {
      res.status(404)
      throw new Error('Game not Found')
   }
})

const updateActiveGame = asyncHandler(async (req, res) => {
   const {
      statePlayer,
      stateGame,
      stateModals,
      stateBoard,
      corps,
      initCards,
      logItems,
   } = req.body.gameData
   const type = req.body.type

   const game = await ActiveGame.findOne({ user: req.user._id, type })

   if (game) {
      game.statePlayer = statePlayer === undefined ? game.statePlayer : statePlayer
      game.stateGame = stateGame === undefined ? game.stateGame : stateGame
      game.stateModals = stateModals === undefined ? game.stateModals : stateModals
      game.stateBoard = stateBoard === undefined ? game.stateBoard : stateBoard
      game.corps = corps === undefined ? game.corps : corps
      game.initCards = initCards === undefined ? game.initCards : initCards
      game.logItems = logItems === undefined ? game.logItems : logItems

      const updatedGame = await game.save()
      res.status(201).json(updatedGame)
   } else {
      res.status(404)
      throw new Error('Game not found')
   }
})

module.exports = { getActiveGame, createActiveGame, deleteActiveGame, updateActiveGame }
