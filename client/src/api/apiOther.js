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