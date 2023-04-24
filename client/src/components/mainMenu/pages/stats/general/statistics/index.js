import { useRef } from 'react'
import { useEffect } from 'react'
import { useContext, useMemo } from 'react'
import TableStatisticsRow from './TableStatisticsRow'
import { PlayersContext } from '../../index'

const Statistics = () => {
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
      <div className="statistics">
         {/* Headers */}
         <div className="row headers">
            <div>
               <span>PLAYER NAME</span>
            </div>
            <div>
               <span>GAMES</span>
            </div>
            <div>
               <span>AVG POINTS</span>
            </div>
            <div>
               <span>WIN RATE</span>
            </div>
            <div>
               <span>MAX SCORE</span>
            </div>
            <div>
               <span>100+ STREAK</span>
            </div>
            <div>
               <span>GAMES DETAILS</span>
            </div>
            <div>
               <span>MORE STATS</span>
            </div>
            <div>
               <span>REAL RATING</span>
            </div>
         </div>
         {/* Table */}
         <div ref={refTable} className="table">
            {currPlayers && currPlayersWithGames.length > 0 ? (
               currPlayersWithGames.map((player, idx) => (
                  <TableStatisticsRow key={idx} player={player} />
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

export default Statistics
