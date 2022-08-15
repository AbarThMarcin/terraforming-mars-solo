const express = require('express')
const { getUsers, registerUser, loginUser, updateUser } = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(getUsers)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/update').post(protect, updateUser)

module.exports = router
