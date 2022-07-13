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
      },
      quickMatchOn: {
         type: Boolean,
         required: true,
         default: false,
      },
      rankedMatchOn: {
         type: Boolean,
         required: true,
         default: false,
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   {
      timestamps: true,
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
