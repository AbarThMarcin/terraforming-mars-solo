const asyncHandler = require('express-async-handler')
const GameWithId = require('../models/modelGamesWithId')

const getGamesWithId = asyncHandler(async (req, res) => {
   const games = await GameWithId.find()

   if (games) {
      res.status(200).json(games)
   } else {
      res.status(404)
      throw new Error('Games not found')
   }
})

const getGameWithId = asyncHandler(async (req, res) => {
   const game = await GameWithId.findOne({ _id: req.body.id })

   if (game) {
      res.status(200).json(game)
   } else {
      res.status(404)
      throw new Error('Game not found')
   }
})

const getCardsIds = asyncHandler(async (req, res) => {
   const { gameId, idx, count } = req.body
   const game = await GameWithId.findOne({ _id: gameId })

   if (game) {
      res.status(200).json({
         ids: game.cards.slice(idx, idx + count)
      })
   } else {
      res.status(404)
      throw new Error('Game not found')
   }
})

const createGameWithId = asyncHandler(async (req, res) => {
   const { stateBoard, corps, cards } = req.body.gameData

   const newGame = new GameWithId({ stateBoard, corps, cards })

   const createdGame = await newGame.save()
   res.status(201).json(createdGame)
})

const deleteGameWithId = asyncHandler(async (req, res) => {
   const game = await ActiveGame.findOne({ _id: req.body.id })

   if (game) {
      await game.remove()
      res.json({ message: 'Game Removed' })
   } else {
      res.status(404)
      throw new Error('Game not Found')
   }
})

module.exports = { getGamesWithId, getGameWithId, getCardsIds, createGameWithId, deleteGameWithId }
