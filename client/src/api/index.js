import axios from 'axios'

const BASE_URI = 'http://localhost:5000/'

export const validateUser = async (token) => {
   const res = await axios.get(`${BASE_URI}api/users/login`, {
      headers: {
         Authorization: `Bearer ${token}`,
      }
   })

   console.log(res)

   return res.data.user
}
