import { useContext, useMemo } from 'react'
import { PlayersContext, StatsTypeContext, STATS_TYPE } from '../Stats'
import Overview from './overview/Overview'
import Details from './details/Details'

const Player = ({ filterPlayers, season, corp, setCorp, userValue }) => {
   const { type, setType } = useContext(StatsTypeContext)
   const { currPlayers, currPlayerId } = useContext(PlayersContext)
   const currPlayer = useMemo(
      () => currPlayers.find((player) => player._id === currPlayerId),
      [currPlayers]
   )

   const handleClickOverview = () => {
      if (corp !== 'ALL CORPORATIONS') {
         const newCorp = 'ALL CORPORATIONS'
         setCorp(newCorp)
         filterPlayers(season, newCorp, userValue)
      }
      setType(STATS_TYPE.PLAYER_OVERVIEW)
   }

   const handleClickDetails = () => {
      setType(STATS_TYPE.PLAYER_DETAILS)
   }

   return (
      <div className={`stats${type === STATS_TYPE.PLAYER_DETAILS ? ' second-tab' : ''}`}>
         {/* Tabs */}
         <div className="tabs">
            <div
               className={`tab pointer${type === STATS_TYPE.PLAYER_OVERVIEW ? ' active' : ''}`}
               onClick={handleClickOverview}
            >
               OVERVIEW
            </div>
            <div
               className={`tab pointer${type === STATS_TYPE.PLAYER_DETAILS ? ' active' : ''}`}
               onClick={handleClickDetails}
            >
               DETAILS
            </div>
         </div>
         {/* Data */}
         {type === STATS_TYPE.PLAYER_OVERVIEW && <Overview currPlayer={currPlayer} />}
         {type === STATS_TYPE.PLAYER_DETAILS && <Details currPlayer={currPlayer} />}
      </div>
   )
}

export default Player
