import axios from 'axios'

export const getEndedGameData = async () => {
   const URI = '/api/games/ended'
   const config = {
      headers: { 'Content-Type': 'application/json' },
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

export const createEndedGameData = async (token, gameData) => {
   const URI = '/api/games/ended/create'
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, gameData, config)
      return res.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const updateEndedGameData = async (token, details) => {
   const URI = '/api/games/ended/update'
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
