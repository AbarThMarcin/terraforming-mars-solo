const express = require('express')
const {
   getActiveGame,
   createActiveGame,
   deleteActiveGame,
   updateActiveGame,
} = require('../controllers/activeGameControllers')
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

router.route('/ended/').get(getEndedGames)
router.route('/ended/create').post(protect, createEndedGame)
router.route('/ended/update').post(protect, updateEndedGame)

module.exports = router
