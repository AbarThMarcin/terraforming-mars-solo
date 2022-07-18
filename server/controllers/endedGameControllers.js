const asyncHandler = require('express-async-handler')
const SEASON = 1
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
   const { victory, corporation, cardsPlayed, points } = req.body
   
   const newGame = new EndedGame({
      user: req.user._id,
      season: SEASON,
      victory,
      corporation,
      cardsPlayed,
      points
   })

   const createdGame = await newGame.save()
   res.status(201).json(createdGame)
})

module.exports = { getEndedGames, createEndedGame }
