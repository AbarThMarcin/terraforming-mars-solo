import { useContext, useMemo } from 'react'
import { PlayersContext, TabTypeContext } from '..'
import { SoundContext, TABS } from '../../../../../App'
import Overview from './overview'
import StatsCards from './statsCards'
import StatsOther from './statsOther'

const Player = ({ filterPlayers, season, corp, setCorp, userValue }) => {
   const { type, setType } = useContext(TabTypeContext)
   const { currPlayers, currPlayerId } = useContext(PlayersContext)
   const currPlayer = useMemo(
      () => currPlayers.find((player) => player._id === currPlayerId),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayers]
   )
   const { sound } = useContext(SoundContext)

   const handleClickOverview = () => {
      sound.btnGeneralClick.play()
      if (corp !== 'ALL CORPORATIONS') {
         const newCorp = 'ALL CORPORATIONS'
         setCorp(newCorp)
         filterPlayers(season, userValue, newCorp)
      }
      setType(TABS.PLAYER_OVERVIEW)
   }

   const handleClickCards = () => {
      sound.btnGeneralClick.play()
      setType(TABS.STATS_CARDS)
   }

   const handleClickStatsOther = () => {
      sound.btnGeneralClick.play()
      setType(TABS.STATS_OTHER)
   }

   return (
      <div
         className={`stats three-tabs${type === TABS.STATS_CARDS ? ' second-tab' : type === TABS.STATS_OTHER ? ' third-tab' : ''}`}
         style={{ display: 'flex', justifyContent: 'center' }}
      >
         {/* Tabs */}
         <div className="tabs">
            <div className={`tab pointer${type === TABS.PLAYER_OVERVIEW ? ' active' : ''}`} onClick={handleClickOverview}>
               OVERVIEW
            </div>
            <div className={`tab pointer${type === TABS.STATS_CARDS ? ' active' : ''}`} onClick={handleClickCards}>
               CARDS
            </div>
            <div className={`tab pointer${type === TABS.STATS_OTHER ? ' active' : ''}`} onClick={handleClickStatsOther}>
               OTHER
            </div>
         </div>

         {/* Data */}
         {type === TABS.PLAYER_OVERVIEW && <Overview currPlayer={currPlayer} />}
         {type === TABS.STATS_CARDS && <StatsCards currPlayer={currPlayer} />}
         {type === TABS.STATS_OTHER && <StatsOther currPlayer={currPlayer} />}
      </div>
   )
}

export default Player
