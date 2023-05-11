import { useContext, useMemo } from 'react'
import { PlayersContext, TabTypeContext } from '..'
import { SoundContext, TABS } from '../../../../../App'
import Overview from './overview'
import Stats1 from './stats1'
import Stats2 from './stats2'

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

   const handleClickStats1 = () => {
      sound.btnGeneralClick.play()
      setType(TABS.STATS1)
   }

   const handleClickStats2 = () => {
      sound.btnGeneralClick.play()
      setType(TABS.STATS2)
   }

   return (
      <div className={`stats three-tabs${type === TABS.STATS1 ? ' second-tab' : type === TABS.STATS2 ? ' third-tab' : ''}`} style={{ display: 'flex', justifyContent: 'center' }}>
         {/* Tabs */}
         <div className="tabs">
            <div className={`tab pointer${type === TABS.PLAYER_OVERVIEW ? ' active' : ''}`} onClick={handleClickOverview}>
               OVERVIEW
            </div>
            <div className={`tab pointer${type === TABS.STATS1 ? ' active' : ''}`} onClick={handleClickStats1}>
               STATS 1
            </div>
            <div className={`tab pointer${type === TABS.STATS2 ? ' active' : ''}`} onClick={handleClickStats2}>
               STATS 2
            </div>
         </div>

         {/* Data */}
         {type === TABS.PLAYER_OVERVIEW && <Overview currPlayer={currPlayer} />}
         {type === TABS.STATS1 && <Stats1 currPlayer={currPlayer} />}
         {type === TABS.STATS2 && <Stats2 currPlayer={currPlayer} />}
      </div>
   )
}

export default Player
