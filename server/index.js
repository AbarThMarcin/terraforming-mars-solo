const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const gameRoutes = require('./routes/gameRoutes')
const otherRoutes = require('./routes/otherRoutes')
const cors = require('cors')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const app = express()
const path = require('path')

dotenv.config()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 100000 }))

// Connect to Mongo DB
connectDB()

// Routes
app.use('/api/users', userRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/other', otherRoutes)

// Deployment
__dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, 'client/build')))
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
   })
} else {
   app.get('/', (req, res) => {
      res.send('API is running...')
   })
}

// Error handlers
app.use(notFound)
app.use(errorHandler)

// Start server
const port = process.env.PORT || 5000
app.listen(port, console.log(`Server running on port ${port}`))
