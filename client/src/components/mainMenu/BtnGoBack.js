import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { STATS_TYPE } from './pages/stats/Stats'

const BtnGoBack = ({ type, setType, filterPlayers, season, corp, setCorp, userValue }) => {
   const navigate = useNavigate()

   const handleClickGoBack = () => {
      if (
         !type ||
         type === STATS_TYPE.GENERAL_STATISTICS ||
         type === STATS_TYPE.GENERAL_ACHIEVEMENTS
      ) {
         navigate('/')
      } else {
         if (corp !== 'ALL CORPORATIONS') {
            const newCorp = 'ALL CORPORATIONS'
            setCorp(newCorp)
            filterPlayers(season, newCorp, userValue)
         }
         setType(STATS_TYPE.GENERAL_STATISTICS)
      }
   }

   return (
      <div className="go-back pointer" onClick={handleClickGoBack}>
         <FontAwesomeIcon icon={faAngleLeft} />
      </div>
   )
}

export default BtnGoBack
