const express = require('express')
const { getSeason } = require('../controllers/otherControllers')

const router = express.Router()

router.route('/season').get(getSeason)

module.exports = router
