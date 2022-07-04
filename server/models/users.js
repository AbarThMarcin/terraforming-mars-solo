const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
   {
      name: {
         type: String,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      userId: {
         type: String,
         required: true,
      },
      authTime: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
)

module.exports = mongoose.model('users', userSchema)
