import axios from 'axios'

export const getSeason = async () => {
   const URI = 'http://localhost:5000/api/other/season'
   const config = {
      headers: { 'Content-Type': 'application/json' },
   }

   try {
      const res = await axios.get(URI, config)
      return res.data.season
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
