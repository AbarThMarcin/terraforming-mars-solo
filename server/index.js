const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const gameRoutes = require('./routes/gameRoutes')
const cors = require('cors')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const app = express()

dotenv.config()

app.use(
   cors({
      origin: true,
   })
)
app.use(express.json())
var bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

// Connect to Mongo DB
connectDB()

// Routes
app.use('/api/users', userRoutes)
app.use('/api/games', gameRoutes)

// Error handler
app.use(notFound)
app.use(errorHandler)

// Start server
const port = process.env.PORT || 5000
app.listen(port, console.log(`Server running on port ${port}`))