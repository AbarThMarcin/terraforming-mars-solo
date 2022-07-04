const admin = require('../config/firebase.config')
const router = require('express').Router()
const users = require('../models/users')

const createUser = async (decodeValue, req, res) => {
   const newUser = new users({
      email: decodeValue.email,
      userId: decodeValue.user_id,
      authTime: decodeValue.auth_time,
   })

   try {
      const savedUser = await newUser.save()
      res.status(200).send({ user: savedUser })
   } catch (error) {
      res.status(400).send({ success: false, msg: error })
   }
}

const updateUser = async (decodeValue, req, res) => {
   const filter = { userId: decodeValue.user_id }
   const options = { upsert: true, new: true }

   try {
      const updatedUser = await users.findOneAndUpdate(
         filter,
         { authTime: decodeValue.auth_time },
         options
      )
      res.status(200).send({ user: updatedUser })
   } catch (error) {
      res.status(400).send({ success: false, msg: error })
   }
}

router.get('/login', async (req, res) => {
   // No Token
   if (!req.headers.authorization) {
      return res.status(500).send({ message: 'Invalid Token' })
   }

   // Get Token alone
   const token = req.headers.authorization.split(' ')[1]

   try {
      // Get Decoded Value
      const decodeValue = await admin.auth().verifyIdToken(token)

      // Unauthorized user
      if (!decodeValue) {
         return res.status(500).json({ success: false, msg: 'Unauthorized user' })
      }

      // Check if user already exists
      const foundUser = await users.findOne({ userId: decodeValue.user_id })
      if (!foundUser) {
         createUser(decodeValue, req, res)
      } else {
         updateUser(decodeValue, req, res)
      }
   } catch (error) {
      // Internal error
      res.status(500).send({ success: false, msg: error })
   }
})

module.exports = router
