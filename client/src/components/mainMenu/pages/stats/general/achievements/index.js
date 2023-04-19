import { useContext, useEffect, useMemo, useRef } from 'react'
import TableAchievementsRow from './TableAchievementsRow'
import { PlayersContext } from '../../../ranking'

const Achievements = () => {
   const refTable = useRef()
   const { currPlayers } = useContext(PlayersContext)
   const currPlayersWithGames = useMemo(
      () => currPlayers.filter((player) => player.games.length > 0),
      [currPlayers]
   )

   useEffect(() => {
      const table = refTable.current
      if (hasScrollbar(table)) {
         table.classList.add('with-scrollbar')
      } else {
         table.classList.remove('with-scrollbar')
      }
   }, [currPlayers])

   const hasScrollbar = (el) => {
      return el.scrollHeight > el.clientHeight
   }

   return (
      <div className="achievements">
         {/* Requirements */}
         <TableAchievementsRow isLegend={true} />
         <div className="line"></div>
         {/* Players */}
         <div ref={refTable} className="table">
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
