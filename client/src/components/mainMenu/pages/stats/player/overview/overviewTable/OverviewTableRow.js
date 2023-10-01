import { getCorporationById } from '../../../../../../../utils/corporation'

const OverviewTableRow = ({ corp, currPlayer }) => {
   const games = currPlayer.games
   const gamesPlayed = games.filter((game) => (game.corporation ? getCorporationById(game.corporation).name === corp : false))
   const gamesWon = gamesPlayed.filter((game) => game.victory)
   const gamesWonScores = gamesWon.map((game) => game.points.total)
   const gamesPlayedScores = gamesPlayed.map((game) => game.points.total)
   const winRate = gamesPlayed.length ? (gamesWon.length / gamesPlayed.length) * 100 : '-'
   const maxScore = gamesWon.length ? Math.max(...gamesWonScores) : '-'
   const avgScore = gamesPlayed.length ? gamesPlayedScores.reduce((a, b) => a + b, 0) / gamesPlayedScores.length : '-'
   const avgRealScore = gamesPlayed.length ? gamesPlayed.reduce((tot, game) => (game.victory ? tot + game.points.total : tot), 0) / gamesPlayed.length : '-'

   return (
      <tr>
         <td>{corp || 'NO CORP'}</td>
         <td>{gamesPlayed.length ? gamesPlayed.length : '-'}</td>
         <td>{gamesPlayed.length ? gamesWon.length : '-'}</td>
         <td>{winRate === '-' ? winRate : `${winRate.toFixed(2)}%`}</td>
         <td>{maxScore}</td>
         <td>{avgScore === '-' ? avgScore : avgScore.toFixed(2)}</td>
         <td>{avgRealScore === '-' ? avgRealScore : avgRealScore.toFixed(2)}</td>
      </tr>
   )
}

export default OverviewTableRow
