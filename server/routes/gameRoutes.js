const express = require('express')
const {
   getActiveGame,
   createActiveGame,
   deleteActiveGame,
   updateActiveGame,
} = require('../controllers/activeGameControllers')
const {
   getGamesWithId,
   getGameWithId,
   getCardsIds,
   createGameWithId,
   deleteGameWithId,
} = require('../controllers/gameWithIdControllers')
const {
   getEndedGames,
   createEndedGame,
   updateEndedGame,
} = require('../controllers/endedGameControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/active/').post(protect, getActiveGame)
router.route('/active/create').post(protect, createActiveGame)
router.route('/active/delete').post(protect, deleteActiveGame)
router.route('/active/update').post(protect, updateActiveGame)

router.route('/with-id/').get(protect, getGamesWithId)
router.route('/with-id/get').post(protect, getGameWithId)
router.route('/with-id/get-cards-ids').post(protect, getCardsIds)
router.route('/with-id/create').post(protect, createGameWithId)
router.route('/with-id/delete').post(protect, deleteGameWithId)

router.route('/ended/').get(getEndedGames)
router.route('/ended/create').post(protect, createEndedGame)
router.route('/ended/update').post(protect, updateEndedGame)

module.exports = router
