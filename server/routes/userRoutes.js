const express = require('express')
const { registerUser, loginUser, updateUser } = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.route('/user').post(protect, updateUser)

module.exports = router
