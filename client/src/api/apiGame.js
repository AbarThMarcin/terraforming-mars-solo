import axios from 'axios'

export const getGameData = async (token, isRanked) => {
   const URI = 'http://localhost:5000/api/games'
   const body = { isRanked }
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

export const createGameData = async (token, gameData, isRanked) => {
   const URI = 'http://localhost:5000/api/games/create'
   const body = { gameData, isRanked }
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

export const deleteGameData = async (token, isRanked) => {
   const URI = 'http://localhost:5000/api/games/delete'
   const body = { isRanked }
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

export const updateGameData = async (token, gameData, isRanked) => {
   console.log('updating server data')
   const URI = 'http://localhost:5000/api/games/update'
   const body = { gameData, isRanked }
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

export const getRandIntNumbers = async (n, min, max, replacement = false) => {
   const URI = 'https://api.random.org/json-rpc/4/invoke'
   const body = {
      jsonrpc: '2.0',
      method: 'generateIntegers',
      params: {
         apiKey: '0000ff80-774d-4895-a873-4294026caf15',
         n,
         min,
         max,
         replacement,
      },
      id: 1,
   }
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
   }

   try {
      const res = await axios.post(URI, body, config)
      return res.data.result.random.data
   } catch (error) {
      console.log(
         error.response && error.response.data.message ? error.response.data.message : error.message
      )
   }
}
