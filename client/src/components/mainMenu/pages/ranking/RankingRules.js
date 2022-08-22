import { useEffect, useState } from 'react'
import { getSeason } from '../../../../api/apiOther'
import spinner from '../../../../assets/other/spinner.gif'

const RankingRules = () => {
   const [season, setSeason] = useState()

   useEffect(() => {
      const fetchSeason = async () => {
         const season = await getSeason()
         setSeason(season)
      }
      fetchSeason()
   }, [])

   return (
      <div className="rules-container">
         <div className="content">
            {season ? (
               <>
                  <p>
                     <span className="season highlighted">
                        {season ? `SEASON ${season}` : 'PRESEASON'}
                     </span>
                  </p>
                  <p>
                     CURRENT SEASON ENDS ON: <span className="highlighted">28 FEBRUARY 2023</span>.
                  </p>
                  <p>
                     YOU HAVE <span className="highlighted">24 HOURS</span> TO COMPLETE A RANKED
                     MATCH.
                  </p>
                  <p>
                     YOU CAN HAVE UP TO <span className="highlighted">50</span> MATCHES PER SEASON
                     FOR THE PRIMARY RANKING.
                  </p>
                  <p>THE SECONDARY RANKING INCLUDES PLAYERS WITH ANY AMOUNT OF GAMES.</p>
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
      </div>
   )
}

export default RankingRules
