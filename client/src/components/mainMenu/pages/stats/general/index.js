import { useContext } from 'react'
import { TabTypeContext } from '..'
import { TABS } from '../../../../../App'
import { SoundContext } from '../../../../../App'
import Achievements from './achievements'
import Statistics from './statistics'

const General = ({ filterPlayers, season, setSeason, setCorp, userValue }) => {
   const { type, setType } = useContext(TabTypeContext)
   const { sound } = useContext(SoundContext)

   const handleClickStatistics = () => {
      sound.btnGeneralClick.play()
      filterPlayers(season, userValue, 'ALL CORPORATIONS')
      setType(TABS.GENERAL_STATISTICS)
   }

   const handleClickAchievements = () => {
      sound.btnGeneralClick.play()
      const newSeason = 'lifetime'
      setSeason(newSeason)
      const newCorp = 'ALL CORPORATIONS'
      setCorp(newCorp)
      filterPlayers(newSeason, userValue, newCorp)
      setType(TABS.GENERAL_ACHIEVEMENTS)
   }

   return (
      <div className={`stats${type === TABS.GENERAL_ACHIEVEMENTS ? ' second-tab' : ''}`}>
         {/* Tabs */}
         <div className="tabs">
            <div
               className={`tab pointer${type === TABS.GENERAL_STATISTICS ? ' active' : ''}`}
               onClick={handleClickStatistics}
            >
               STATISTICS
            </div>
            <div
               className={`tab pointer${type === TABS.GENERAL_ACHIEVEMENTS ? ' active' : ''}`}
               onClick={handleClickAchievements}
            >
               ACHIEVEMENTS
            </div>
         </div>
         {/* Data */}
         {type === TABS.GENERAL_STATISTICS && <Statistics />}
         {type === TABS.GENERAL_ACHIEVEMENTS && <Achievements />}
      </div>
   )
}

export default General
