import { useContext, useMemo } from 'react'
import { PlayersContext } from '../../Stats'
import TableAchievementsRow from './TableAchievementsRow'

const Achievements = () => {
   const { currPlayers } = useContext(PlayersContext)
   const currPlayersWithGames = useMemo(
      () => currPlayers.filter((player) => player.games.length > 0),
      [currPlayers]
   )

   return (
      <div className="achievements">
         {/* Requirements */}
         <TableAchievementsRow isLegend={true} />
         <div className="line"></div>
         {/* Players */}
         <div className="table">
            {currPlayersWithGames.length > 0 ? (
               currPlayersWithGames.map((player, idx) => (
                  <TableAchievementsRow key={idx} player={player} />
               ))
            ) : (
               <div className="center" style={{ fontSize: 'calc(var(--default-size) * 1.5)' }}>
                  NO ACTIVE PLAYERS
               </div>
            )}
         </div>
      </div>
   )
}

export default Achievements
