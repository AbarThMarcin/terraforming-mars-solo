import axios from 'axios'

export const getMatchesWithId = async (token) => {
   const URI = '/api/games/with-id'
   const config = {
      headers: { 'Content-Type': 'application/json' },
      Authorization: `Bearer ${token}`,
   }

   try {
      const res = await axios.get(URI, config)
      return res.data
   } catch (error) {
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
      return error
   }
}

export const getMatchWithId = async (token, id) => {
   const URI = '/api/games/with-id/get'
   const body = { id }
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
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
      return error
   }
}

export const getConsecutiveCardsIds = async (token, gameId, idx, count) => {
   const URI = '/api/games/with-id/get-cards-ids'
   const body = { gameId, idx, count }
   const config = {
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   }

   try {
      const res = await axios.post(URI, body, config)
      return res.data.ids
   } catch (error) {
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
      return error
   }
}

export const createMatchWithId = async (token, gameData) => {
   const URI = 'http://localhost:5000/api/games/with-id/create'
   const body = { gameData }
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
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
      return error
   }
}

export const deleteMatchWithId = async (token, type) => {
   const URI = 'http://localhost:5000/api/games/with-id/delete'
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
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
      return error
   }
}
