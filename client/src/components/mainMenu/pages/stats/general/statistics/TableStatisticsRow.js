import { useContext } from 'react'
import { TABS } from '../../../../../../App'
import BtnGoTo from '../../btnGoTo/BtnGoTo'
import { PlayersContext, TabTypeContext } from '../../../ranking'

const TableStatisticsRow = ({ player }) => {
   const { setCurrPlayerId } = useContext(PlayersContext)
   const { setType } = useContext(TabTypeContext)
   const gamesCount = getGamesCount()
   const avgPoints = getAvgPoints()
   const winRate = getWinRate()
   const maxScore = getMaxScore()
   const longestStreak = getLongestStreak()
   const realRating = getRealRating()

   function getGamesCount() {
      return player.games.length
   }
   function getAvgPoints() {
      const totalPoints = player.games.reduce((total, game) => total + game.points.total, 0)
      return (totalPoints / gamesCount).toFixed(2)
   }
   function getWinRate() {
      const wins = player.games.reduce((total, game) => (game.victory ? total + 1 : total), 0)
      return `${Math.floor((wins / gamesCount) * 100)}%`
   }
   function getMaxScore() {
      return player.games.reduce(
         (max, game) => (game.points.total > max ? game.points.total : max),
         0
      )
   }
   function getLongestStreak() {
      const results = player.games.map((game) => {
         return { points: game.points.total, victory: game.victory }
      })
      let streak = 0
      let maxStreak = 0
      results.forEach((result) => {
         result.points > 100 && result.victory ? streak++ : (streak = 0)
         if (streak > maxStreak) maxStreak = streak
      })
      return maxStreak
   }
   function getRealRating() {
      const totalPoints = player.games.reduce(
         (total, game) => (game.victory ? total + game.points.total : total),
         0
      )
      return (totalPoints / gamesCount).toFixed(2)
   }

   function handleClickBtnGames() {
      setCurrPlayerId(player._id)
      setType(TABS.GAMES)
   }
   function handleClickBtnMoreStats() {
      setCurrPlayerId(player._id)
      setType(TABS.PLAYER_OVERVIEW)
   }

   return (
      <div className="row">
         <div>{player.name}</div>
         <div>{gamesCount}</div>
         <div>{avgPoints}</div>
         <div>{winRate}</div>
         <div>{maxScore}</div>
         <div>{longestStreak}</div>
         <div>
            <BtnGoTo text="GAMES" action={handleClickBtnGames} />
         </div>
         <div>
            <BtnGoTo text="MORE STATS" action={handleClickBtnMoreStats} />
         </div>
         <div>{realRating}</div>
      </div>
   )
}

export default TableStatisticsRow
