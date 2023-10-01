import { range } from '../../../../../../utils/array'
import styled, { keyframes } from 'styled-components'

const StyledBar = styled.div`
   position: relative;
   height: calc(var(--default-size) * 0.8);
   background: rgb(15, 85, 52);
   background: linear-gradient(90deg, rgba(15, 85, 52, 1) 0%, rgba(0, 209, 115, 1) 100%);
   font-size: calc(var(--default-size) * 0.8);
   line-height: var(--default-size);
   animation: ${({ width }) => barAnimation(width)} 0.5s cubic-bezier(0.72, 0, 0.36, 1.1);
   width: ${({ width }) => width}%;
`
const barAnimation = (width) => keyframes`
   from {
      width: 0
   }
   to {
      width: ${width}%
   }
`
const OverviewChart = ({ id, getGamesWonByPoints, ranges, hiddenIndexes }) => {
   const gamesWonByPoints = getGamesWonByPoints()
   const maxPercentage = Math.max(...gamesWonByPoints)
   const chart1Width = 75 * (100 / maxPercentage)
   const hiddenIndex = hiddenIndexes.findIndex((el) => el >= maxPercentage)

   function hideAxis(id) {
      return id > hiddenIndex
   }

   return (
      <div className={`chart-container chart-container-${id}`}>
         {/* Chart background */}
         <div className="chart-bg" style={{ width: `${chart1Width}%` }}>
            {/* Axis Y Ranges */}
            <div className="ranges">
               {ranges.map((range, idx) => (
                  <div key={idx}>{range}</div>
               ))}
            </div>
            {/* Vertical Lines */}
            <div className="axisY">
               <span>0%</span>
            </div>
            {range(1, 10).map((id) => {
               return (
                  !hideAxis(id) && (
                     <div key={id} className="axisY axisY-help" style={{ left: `${id * 10}%` }}>
                        <span>{`${id * 10}%`}</span>
                     </div>
                  )
               )
            })}
            {/* Bars with Numbers */}
            <div className="bars">
               {gamesWonByPoints.map((game, idx) => (
                  <StyledBar key={Math.random()} width={game}>
                     <span className="bar-percentage">{`${game}%`}</span>
                  </StyledBar>
               ))}
            </div>
         </div>
      </div>
   )
}

export default OverviewChart
