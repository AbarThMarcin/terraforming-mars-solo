import axios from 'axios'

export const getUsers = async () => {
   const URI = 'http://localhost:5000/api/users'
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   }

   try {
      const res = await axios.get(URI, config)
      return res.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const login = async (email, password) => {
   const URI = 'http://localhost:5000/api/users/login'
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   }

   try {
      const res = await axios.post(URI, { email, password }, config)
      return res
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const register = async (name, email, password) => {
   const URI = 'http://localhost:5000/api/users/register'
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   }

   try {
      const res = await axios.post(URI, { name, email, password }, config)
      return res
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const updateUser = async (token, details) => {
   const URI = 'http://localhost:5000/api/users/update'
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, details, config)
      return res
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}
