import axios from 'axios'

export const getActiveGameData = async (token, type) => {
   const URI = '/api/games/active'
   const body = { type }
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, body, config)
      return res.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const createActiveGameData = async (token, gameData, type) => {
   const URI = '/api/games/active/create'
   const body = { gameData, type }
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, body, config)
      return res.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const deleteActiveGameData = async (token, type) => {
   const URI = '/api/games/active/delete'
   const body = { type }
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, body, config)
      return res.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}

export const updateGameData = async (token, gameData, type) => {
   console.log('updating game data')
   const URI = '/api/games/active/update'
   const body = { gameData, type }
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, body, config)
      return res.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}
