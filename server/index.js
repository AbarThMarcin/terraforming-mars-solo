const express = require('express')
const colors = require('colors')
require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const app = express()

// Connect to database
connectDB()

// Start server
app.listen(port, console.log(`Server running on port ${port}`))
