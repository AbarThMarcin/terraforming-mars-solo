import { useContext, useEffect, useMemo, useRef } from 'react'
import { PlayersContext } from '.'

const RankingPrimary = ({ userValue, gamesCountForPrimaryRanking }) => {
   const refTable = useRef()
   const { currPlayers } = useContext(PlayersContext)
   const currPlayersForRanking = useMemo(
      () => getPlayersForRanking(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayers]
   )

   useEffect(() => {
      const table = refTable.current
      if (hasScrollbar(table)) {
         table.classList.add('with-scrollbar')
      } else {
         table.classList.remove('with-scrollbar')
      }
   }, [userValue])

   const hasScrollbar = (el) => {
      return el.scrollHeight > el.clientHeight
   }

   function filterFunc(playerRow) {
      if (userValue === '') return true
      if (playerRow.name.toUpperCase().includes(userValue.toUpperCase())) return true
      return false
   }

   function getPlayersForRanking() {
      let players = []
      // Get Object with Player Name and his Real Rating
      currPlayers
         .filter((player) => player.games.length >= gamesCountForPrimaryRanking)
         .forEach((player) => {
            const totalPoints = player.games.slice(0, gamesCountForPrimaryRanking).reduce((total, game) => (game.victory ? total + game.points.total : total), 0)
            const realRating = (totalPoints / player.games.slice(0, gamesCountForPrimaryRanking).length).toFixed(2)
            players.push({ name: player.name, realRating })
         })
      players = players.sort((a, b) => b.realRating - a.realRating)
      // Assign Rank to a player
      let playersWithRank = players.map((item, id) => {
         if (id > 0) {
            const prevItem = players[id - 1]
            if (prevItem.realRating === item.realRating) {
               item.rank = prevItem.rank
            } else {
               item.rank = id + 1
            }
         } else {
            item.rank = 1
         }
         return item
      })

      return playersWithRank
   }

   return (
      <div className="statistics" style={{ width: '50%' }}>
         {/* Headers */}
         <div className="row headers">
            <div style={{ width: '15%' }}>
               <span>RANK</span>
            </div>
            <div style={{ width: '65%' }}>
               <span>PLAYER</span>
            </div>
            <div style={{ width: '20%' }}>
               <span>WINN RATE</span>
            </div>
            <div style={{ width: '20%' }}>
               <span>REAL RATING</span>
            </div>
         </div>
         {/* Table */}
         <div ref={refTable} className="table">
            {currPlayersForRanking.length > 0 ? (
               currPlayersForRanking.filter(filterFunc).map((player, idx) => (
                  <div
                     key={idx}
                     className={`row ${player.rank === 1 && 'first-rank'}`}
                     style={{
                        height: 'calc(var(--default-size) * 2.6)',
                        fontSize: 'calc(var(--default-size) * 1.4)',
                     }}
                  >
                     <div style={{ width: '15%' }}>{player.rank}.</div>
                     <div style={{ width: '65%', fontSize: 'calc(var(--default-size) * 1.1)' }}>{player.name}</div>
                     <div style={{ width: '20%' }}>{player.realRating}</div>
                  </div>
               ))
            ) : (
               <div className="center" style={{ fontSize: 'calc(var(--default-size) * 1.5)' }}>
                  NO PLAYERS COMPLETED {gamesCountForPrimaryRanking} GAMES
               </div>
            )}
         </div>
      </div>
   )
}

export default RankingPrimary
