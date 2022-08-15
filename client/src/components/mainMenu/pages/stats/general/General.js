import { useContext } from 'react'
import { StatsTypeContext, STATS_TYPE } from '../Stats'
import Achievements from './achievements/Achievements'
import Statistics from './statistics/Statistics'

const General = ({ filterPlayers, season, setSeason, setCorp, userValue }) => {
   const { type, setType } = useContext(StatsTypeContext)

   const handleClickStatistics = () => {
      filterPlayers(season, 'ALL CORPORATIONS', userValue)
      setType(STATS_TYPE.GENERAL_STATISTICS)
   }

   const handleClickAchievements = () => {
      const newSeason = 'lifetime'
      setSeason(newSeason)
      const newCorp = 'ALL CORPORATIONS'
      setCorp(newCorp)
      filterPlayers(newSeason, newCorp, userValue)
      setType(STATS_TYPE.GENERAL_ACHIEVEMENTS)
   }

   return (
      <div className={`stats${type === STATS_TYPE.GENERAL_ACHIEVEMENTS ? ' second-tab' : ''}`}>
         {/* Tabs */}
         <div className="tabs">
            <div
               className={`tab pointer${type === STATS_TYPE.GENERAL_STATISTICS ? ' active' : ''}`}
               onClick={handleClickStatistics}
            >
               STATISTICS
            </div>
            <div
               className={`tab pointer${type === STATS_TYPE.GENERAL_ACHIEVEMENTS ? ' active' : ''}`}
               onClick={handleClickAchievements}
            >
               ACHIEVEMENTS
            </div>
         </div>
         {/* Data */}
         {type === STATS_TYPE.GENERAL_STATISTICS && <Statistics />}
         {type === STATS_TYPE.GENERAL_ACHIEVEMENTS && <Achievements />}
      </div>
   )
}

export default General
