import axios from 'axios'

export const getSeason = async () => {
   const URI = '/api/other/season'
   const config = {
      headers: { 'Content-Type': 'application/json' },
   }

   try {
      const res = await axios.get(URI, config)
      return res.data.season
   } catch (error) {
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
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
      if (res.data.error) {
         console.warn("Random.org service offline. Using built-in JS random class...")
         return getRandomIntegers(min, max, n)
      } else {
         return res.data.result.random.data
      }
   } catch (error) {
      console.log(error.response && error.response.data.message ? error.response.data.message : error.message)
   }
}

function getRandomIntegers(min, max, count) {
   if (max - min + 1 < count) {
       throw new Error("Count exceeds range of possible unique integers.");
   }

   let result = [];
   let available = Array.from({length: max - min + 1}, (_, i) => i + min);

   for (let i = 0; i < count; i++) {
       const randomIndex = Math.floor(Math.random() * available.length);
       result.push(available[randomIndex]);
       available.splice(randomIndex, 1);
   }

   return result;
}