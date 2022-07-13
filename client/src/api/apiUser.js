import axios from 'axios'

export const login = async (email, password) => {
   const URI = 'http://localhost:5000/api/users/login'
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   }

   const res = await axios.post(URI, { email, password }, config)

   return res
}

export const register = async (name, email, password) => {
   const URI = 'http://localhost:5000/api/users'
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   }

   const res = await axios.post(URI, { name, email, password }, config)

   return res
}

export const updateUser = async (token, details) => {
   const URI = 'http://localhost:5000/api/users/user'
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
      },
   }

   const res = await axios.post(URI, details, config)

   return res
}