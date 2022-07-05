const express = require('express')
const colors = require('colors')
require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const app = express()
const cors = require('cors')

app.use(cors({ origin: true }))
app.use(express.json())

// Connect to Mongo DB
connectDB()

app.get('/', (req, res) => {
   res.send('Hi there from server!!')
})

const userRoute = require('./routes/user')
app.use('/api/users/', userRoute)

// Start server
app.listen(port, console.log(`Server running on port ${port}`))
