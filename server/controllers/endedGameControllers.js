const asyncHandler = require('express-async-handler')
const { SEASON } = require('../config/season')
const EndedGame = require('../models/modelEndedGame')

const getEndedGames = asyncHandler(async (req, res) => {
   const games = await EndedGame.find()

   if (games) {
      res.status(200).json(games)
   } else {
      res.status(404)
      throw new Error('Games not found')
   }
})

const createEndedGame = asyncHandler(async (req, res) => {
   const { victory, forfeited, corporation, cards, initCorps, initStateBoard, logItems, points, startTime, endTime, durationSeconds } = req.body

   const newGame = new EndedGame({
      user: req.user._id,
      season: SEASON,
      forfeited,
      victory,
      corporation,
      cards,
      initCorps, 
      initStateBoard,
      logItems,
      points,
      startTime,
      endTime,
      durationSeconds,
   })

   const createdGame = await newGame.save()
   res.status(201).json(createdGame)
})

const updateEndedGame = asyncHandler(async (req, res) => {
   const game = await EndedGame.findById(req.body.gameId)

   if (game) {
      game.link = req.body.link !== undefined ? req.body.link : game.link
      game.comment = req.body.comment !== undefined ? req.body.comment : game.comment

      const updatedGame = await game.save()

      res.json({
         _id: updatedGame._id,
         user: updatedGame.user,
         season: updatedGame.user,
         forfeited: updatedGame.forfeited,
         victory: updatedGame.victory,
         corporation: updatedGame.corporation,
         cards: updatedGame.cards,
         initCorps: updatedGame.initCorps,
         initStateBoard: updatedGame.initStateBoard,
         logItems: updatedGame.logItems,
         durationSeconds: updatedGame.durationSeconds,
         points: updatedGame.points,
         link: updatedGame.link,
         comment: updatedGame.comment,
      })
   } else {
      res.status(404)
      throw new Error('Game Not Found')
   }
})

module.exports = { getEndedGames, createEndedGame, updateEndedGame }
