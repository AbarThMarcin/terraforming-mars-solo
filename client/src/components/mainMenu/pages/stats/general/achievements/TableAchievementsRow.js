import { CORP_NAMES } from '../../../../../../data/corpNames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const TableAchievementsRow = ({ player, isLegend }) => {
   const maxScore = getMaxScore()
   const maxScoreCorps = getMaxScoreCorps()
   const longestStreak = getLongestStreak()
   const maxScoreMet = [maxScore >= 130, maxScore >= 140, maxScore >= 150]
   const maxScoreCorpsMet = [maxScoreCorps >= 100, maxScoreCorps >= 110, maxScoreCorps >= 120]
   const longestStreakMet = [longestStreak >= 5, longestStreak >= 9, longestStreak >= 12]

   function getMaxScore() {
      if (!player) return
      return player.games.reduce((max, game) => (game.points.total > max ? game.points.total : max), 0)
   }
   function getMaxScoreCorps() {
      if (!player) return
      const maxScoresCorps = Object.values(CORP_NAMES).map((corp) => getMaxScoreForCorp(corp))
      if (maxScoresCorps.includes('N/A')) return 'N/A'
      return Math.min(...maxScoresCorps)
   }
   function getLongestStreak() {
      if (!player) return
      const results = player.games.map((game) => {
         return { points: game.points.total, victory: game.victory }
      })
      let streak = 0
      let maxStreak = 0
      results.forEach((result) => {
         result.points >= 100 && result.victory ? streak++ : (streak = 0)
         if (streak > maxStreak) maxStreak = streak
      })
      return maxStreak
   }

   function getMaxScoreForCorp(corp) {
      const gamesCorp = player.games.filter((game) => game.corporation?.name === corp)
      if (gamesCorp.length === 0) {
         return 'N/A'
      } else {
         return gamesCorp.reduce((max, game) => (game.points.total > max ? game.points.total : max), 0)
      }
   }

   return (
      <div className={`section ${isLegend && 'legend'}`}>
         <div>
            <span>ACHIEVEMENT</span>
         </div>
         <div>
            <span>{player ? player.name : 'REQUIREMENT'}</span>
         </div>
         <div>
            <span>CURRENT RESULT</span>
         </div>
         <div>
            <FontAwesomeIcon icon={faStar} />
         </div>
         <div>
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
         </div>
         <div>
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
         </div>
         <div>
            <span>MAX SCORE IN A SINGLE GAME</span>
         </div>
         <div className={maxScoreMet[0] ? 'met' : ''}>
            <span>{!player && '130+'}</span>
         </div>
         <div className={maxScoreMet[1] ? 'met' : ''}>
            <span>{!player && '140+'}</span>
         </div>
         <div className={maxScoreMet[2] ? 'met' : ''}>
            <span>{!player && '150+'}</span>
         </div>
         <div style={{ color: 'rgba(255, 255, 255, 0.3' }}>{maxScore}</div>
         <div>
            <span>MAX SCORE WITH EVERY CORPORATION</span>
         </div>
         <div className={maxScoreCorpsMet[0] ? 'met' : ''}>
            <span>{!player && '100+'}</span>
         </div>
         <div className={maxScoreCorpsMet[1] ? 'met' : ''}>
            <span>{!player && '110+'}</span>
         </div>
         <div className={maxScoreCorpsMet[2] ? 'met' : ''}>
            <span>{!player && '120+'}</span>
         </div>
         <div style={{ color: 'rgba(255, 255, 255, 0.3' }}>{maxScoreCorps}</div>
         <div>
            <span>100+ STREAK</span>
         </div>
         <div className={longestStreakMet[0] ? 'met' : ''}>
            <span>{!player && '5'}</span>
         </div>
         <div className={longestStreakMet[1] ? 'met' : ''}>
            <span>{!player && '9'}</span>
         </div>
         <div className={longestStreakMet[2] ? 'met' : ''}>
            <span>{!player && '12'}</span>
         </div>
         <div style={{ color: 'rgba(255, 255, 255, 0.3' }}>{longestStreak}</div>
      </div>
   )
}

export default TableAchievementsRow
