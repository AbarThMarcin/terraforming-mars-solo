const express = require('express')
const { getGame, createGame, deleteGame, updateGame } = require('../controllers/gameControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(protect, getGame)
router.route('/create').post(protect, createGame)
router.route('/delete').post(protect, deleteGame)
router.route('/update').post(protect, updateGame)

module.exports = router
