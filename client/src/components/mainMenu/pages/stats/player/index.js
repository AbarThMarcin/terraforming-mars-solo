import { useContext, useMemo } from 'react'
import { PlayersContext, TabTypeContext } from '..'
import { SoundContext, TABS } from '../../../../../App'
import Overview from './overview'
import Details from './details'

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

   const handleClickDetails = () => {
      sound.btnGeneralClick.play()
      setType(TABS.PLAYER_DETAILS)
   }

   return (
      <div className={`stats${type === TABS.PLAYER_DETAILS ? ' second-tab' : ''}`}>
         {/* Tabs */}
         <div className="tabs">
            <div
               className={`tab pointer${type === TABS.PLAYER_OVERVIEW ? ' active' : ''}`}
               onClick={handleClickOverview}
            >
               OVERVIEW
            </div>
            <div
               className={`tab pointer${type === TABS.PLAYER_DETAILS ? ' active' : ''}`}
               onClick={handleClickDetails}
            >
               DETAILS
            </div>
         </div>
         {/* Data */}
         {type === TABS.PLAYER_OVERVIEW && <Overview currPlayer={currPlayer} />}
         {type === TABS.PLAYER_DETAILS && <Details currPlayer={currPlayer} />}
      </div>
   )
}

export default Player
