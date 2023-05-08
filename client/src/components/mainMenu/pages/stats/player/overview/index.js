import OverviewChart from './OverviewChart'
import OverviewTable from './overviewTable'

const chart1_ranges = ['160+', '150 - 159', '140 - 149', '130 - 139', '120 - 129', '110 - 119', '100 - 109', '90 - 99', '80 - 89', '70 - 79', '60 - 69', '59-']
const chart2_ranges = ['100+', '99-']
const hiddenIndexes = [0, 17, 26, 35, 43, 52, 61, 70, 79, 88, 100]

const Overview = ({ currPlayer }) => {
   const gamesPlayed = currPlayer.games
   const gamesUnforfeited = currPlayer.games.filter((game) => !game.forfeited)
   const gamesWon = currPlayer.games.filter((game) => game.victory)

   function chart1_getGamesWonByPoints() {
      let arr = []
      arr.push(getPercentage(160, null))
      arr.push(getPercentage(150, 159))
      arr.push(getPercentage(140, 149))
      arr.push(getPercentage(130, 139))
      arr.push(getPercentage(120, 129))
      arr.push(getPercentage(110, 119))
      arr.push(getPercentage(100, 109))
      arr.push(getPercentage(90, 99))
      arr.push(getPercentage(80, 89))
      arr.push(getPercentage(70, 79))
      arr.push(getPercentage(60, 69))
      arr.push(getPercentage(null, 59))
      return arr
   }

   function chart2_getGamesWonByPoints() {
      let arr = []
      arr.push(getPercentage(100, null))
      arr.push(getPercentage(null, 99))
      return arr
   }

   function getPercentage(min, max) {
      const totalGames = gamesUnforfeited.length
      const gamesInRange = gamesUnforfeited.filter((game) => {
         const points = game.points.total
         let inRange = true
         if (min) {
            if (points < min) inRange = false
         }
         if (max) {
            if (points > max) inRange = false
         }
         return inRange
      }).length
      return totalGames === 0 ? 0 : ((gamesInRange / totalGames) * 100).toFixed(0)
   }

   return (
      <div className="overview">
         <OverviewTable currPlayer={currPlayer} gamesPlayed={gamesPlayed} gamesWon={gamesWon} />
         <div className="charts">
            <div className="charts-title">GAMES BY SCORE</div>
            <OverviewChart id={1} getGamesWonByPoints={chart1_getGamesWonByPoints} ranges={chart1_ranges} hiddenIndexes={hiddenIndexes} />
            <OverviewChart id={2} getGamesWonByPoints={chart2_getGamesWonByPoints} ranges={chart2_ranges} hiddenIndexes={hiddenIndexes} />
         </div>
      </div>
   )
}

export default Overview
