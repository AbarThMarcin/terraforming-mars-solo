const asyncHandler = require('express-async-handler')
const User = require('../models/modelUser')
const { generateToken } = require('../utils/generateToken')

const registerUser = asyncHandler(async (req, res) => {
   const { name, email, password } = req.body

   const userExists = await User.findOne({ email })

   if (userExists) {
      res.status(400)
      throw new Error('User already exists')
   }

   const newUser = await User.create({
      name,
      email,
      password,
   })
   if (newUser) {
      res.status(201).json({
         _id: newUser._id,
         name: newUser.name,
         email: newUser.email,
         settings: newUser.settings,
         quickMatchOn: newUser.quickMatchOn,
         rankedMatchOn: newUser.rankedMatchOn,
         isAdmin: newUser.isAdmin,
         token: generateToken(newUser._id),
      })
   } else {
      res.status(400)
      throw new Error('Could not create a user!')
   }
})

const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body

   const foundUser = await User.findOne({ email })

   if (foundUser && (await foundUser.matchPassword(password))) {
      res.json({
         _id: foundUser._id,
         name: foundUser.name,
         email: foundUser.email,
         settings: foundUser.settings,
         quickMatchOn: foundUser.quickMatchOn,
         rankedMatchOn: foundUser.rankedMatchOn,
         isAdmin: foundUser.isAdmin,
         token: generateToken(foundUser._id),
      })
   } else {
      res.status(400)
      throw new Error('Invalid email or password!')
   }
})

const updateUser = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id)

   if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.settings = req.body.settings || user.settings
      user.quickMatchOn =
         req.body.quickMatchOn !== undefined ? req.body.quickMatchOn : user.quickMatchOn
      user.rankedMatchOn =
         req.body.rankedMatchOn !== undefined ? req.body.rankedMatchOn : user.rankedMatchOn
      if (req.body.password) {
         user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         settings: updatedUser.settings,
         quickMatchOn: updatedUser.quickMatchOn,
         rankedMatchOn: updatedUser.rankedMatchOn,
         isAdmin: updatedUser.isAdmin,
         token: generateToken(updatedUser._id),
      })
   } else {
      res.status(404)
      throw new Error('User Not Found')
   }
})

module.exports = { loginUser, registerUser, updateUser }
