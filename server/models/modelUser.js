const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      settings: {
         gameSpeed: {
            type: Number,
            required: true,
            default: 2,
         },
         showTotalVP: {
            type: Boolean,
            required: true,
            default: false,
         },
         handSortId: {
            type: String,
            required: true,
            default: '4a',
         },
         playedSortId: {
            type: String,
            required: true,
            default: '4a-played',
         },
         musicVolume: {
            type: Number,
            required: true,
            default: 0.5,
         },
         gameVolume: {
            type: Number,
            required: true,
            default: 0.5,
         },
      },
      activeMatches: {
         quickMatch: {
            type: Boolean,
            required: true,
            default: false,
         },
         quickMatchId: {
            type: Boolean,
            required: true,
            default: false,
         },
         ranked: {
            type: Boolean,
            required: true,
            default: false,
         },
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
   }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) next()
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('users', userSchema)
