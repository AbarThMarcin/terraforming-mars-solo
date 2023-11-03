import { useContext, useEffect, useMemo, useRef } from 'react'
import { PlayersContext } from '..'
import TableGamesRow from './TableGamesRow'

const Games = ({ user, setDataForGame }) => {
   const refTable = useRef()
   const { currPlayers, currPlayerId } = useContext(PlayersContext)
   const currPlayer = useMemo(() => currPlayers.find((player) => player._id === currPlayerId), [currPlayers, currPlayerId])

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
      <div className="games">
         {/* Player Name */}
         <div className="player-name">{currPlayer.name}</div>
         {/* Headers */}
         <div className="row headers">
            <div>
               <span>GAME ID</span>
            </div>
            <div>
               <span>SEASON</span>
            </div>
            <div>
               <span>CORPORATION</span>
            </div>
            <div>
               <span>
                  START
                  <br />
                  TIME
               </span>
            </div>
            <div>
               <span>DURATION</span>
            </div>
            <div>
               <span>
                  END
                  <br />
                  TIME
               </span>
            </div>
            <div>
               <span>
                  WIN /<br />
                  LOSS
               </span>
            </div>
            <div>
               <span>
                  POINTS
                  <br />
                  TR
               </span>
            </div>
            <div>
               <span>
                  POINTS
                  <br />
                  GREENERY
               </span>
            </div>
            <div>
               <span>
                  POINTS
                  <br />
                  CITY
               </span>
            </div>
            <div>
               <span>
                  POINTS
                  <br />
                  VP
               </span>
            </div>
            <div>
               <span>
                  POINTS
                  <br />
                  TOTAL
               </span>
            </div>
            <div>
               <span>LOG</span>
            </div>
            <div>
               <span>REPLAY</span>
            </div>
            <div>
               <span>YT LINK</span>
            </div>
            <div>
               <span>COMMENT</span>
            </div>
         </div>
         {/* Table */}
         <div ref={refTable} className="table">
            {currPlayer.games.length > 0 ? (
               currPlayer.games
                  .slice(0)
                  .reverse()
                  .map((game, idx, games) => (
                     <TableGamesRow key={games.length - idx} id={games.length - idx} game={game} currPlayer={currPlayer} user={user} setDataForGame={setDataForGame} />
                  ))
            ) : (
               <div className="center" style={{ fontSize: 'calc(var(--default-size) * 1.5)' }}>
                  NO GAMES
               </div>
            )}
         </div>
      </div>
   )
}

export default Games
