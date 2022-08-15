const asyncHandler = require('express-async-handler')
const { SEASON } = require('../config/season')

const getSeason = asyncHandler(async (req, res) => {
   res.json({ season: SEASON })
})

module.exports = { getSeason }
