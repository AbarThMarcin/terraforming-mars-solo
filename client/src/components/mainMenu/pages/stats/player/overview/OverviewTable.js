import { CORP_NAMES } from '../../../../../../data/corpNames'
import OverviewTableRow from './OverviewTableRow'

const OverviewTable = ({ currPlayer, gamesPlayed, gamesWon }) => {
   const gamesWonScores = gamesWon.map((game) => game.points.total)
   const gamesPlayedScores = gamesPlayed.map((game) => game.points.total)
   const winRate = (gamesWon.length / gamesPlayed.length) * 100
   const maxScore = gamesWon.length ? Math.max(...gamesWonScores) : '-'
   const avgScore = gamesPlayedScores.reduce((a, b) => a + b, 0) / gamesPlayedScores.length
   const avgRealScore =
      gamesPlayed.reduce((tot, game) => (game.victory ? tot + game.points.total : tot), 0) /
      gamesPlayed.length

   return (
      <div className="table">
         {/* Player Name */}
         <div className="player-name">{currPlayer.name}</div>
         {/* Table */}
         <table width="100%">
            <thead>
               <tr>
                  <td>CORPORATION</td>
                  <td>
                     GAMES
                     <br />
                     PLAYED
                  </td>
                  <td>
                     GAMES
                     <br />
                     WON
                  </td>
                  <td>
                     WIN
                     <br />
                     RATE
                  </td>
                  <td>
                     MAX
                     <br />
                     SCORE
                  </td>
                  <td>
                     AVG
                     <br />
                     SCORE
                  </td>
                  <td>
                     REAL
                     <br />
                     RATING
                  </td>
               </tr>
            </thead>
            <tbody>
               {Object.values(CORP_NAMES).map((corp, idx) => (
                  <OverviewTableRow key={idx} corp={corp} currPlayer={currPlayer} />
               ))}
            </tbody>
            <tfoot>
               <tr>
                  <td>TOTAL / AVERAGE</td>
                  <td>{gamesPlayed.length}</td>
                  <td>{gamesWon.length}</td>
                  <td>{`${winRate.toFixed(2)}%`}</td>
                  <td>{maxScore}</td>
                  <td>{avgScore.toFixed(2)}</td>
                  <td>{avgRealScore.toFixed(2)}</td>
               </tr>
            </tfoot>
         </table>
      </div>
   )
}

export default OverviewTable
