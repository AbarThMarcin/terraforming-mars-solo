import { useEffect, useState } from 'react'
import BtnGoBack from '../BtnGoBack'
import { getSeason } from '../../../api/apiOther'
import spinner from '../../../assets/other/spinner.gif'

const Rules = () => {
   const [season, setSeason] = useState()

   useEffect(() => {
      const fetchSeason = async () => {
         const season = await getSeason()
         setSeason(season)
      }
      fetchSeason()
   }, [])

   return (
      <div className="green-border rules-container center">
         <div className="content">
            {season ? (
               <>
                  <p>
                     <span className="season highlighted">{season ? `SEASON ${season}` : 'PRESEASON'}</span>
                  </p>
                  <p>CURRENT SEASON ENDS ON: <span className='highlighted'>28 FEBRUARY 2023</span></p>
                  <p>YOU HAVE <span className='highlighted'>24 HOURS</span> TO COMPLETE A RANKED MATCH</p>
                  <p>YOU CAN HAVE UP TO <span className='highlighted'>50</span> MATCHES PER SEASON FOR THE STATISTICS.</p>
                  <br />
                  <p>GOOD LUCK!</p>
               </>
            ) : (
               // Loading Spinner
               <div className="spinner">
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            )}
         </div>
         <BtnGoBack />
      </div>
   )
}

export default Rules
