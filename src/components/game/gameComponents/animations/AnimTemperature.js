import { useContext } from 'react'
import { StateGameContext } from '../../Game'
import styled, { keyframes } from 'styled-components'
import { scale } from '../../../../util/misc'

// const StyledAnimTemp = styled.div`
//    animation-name: animate-prod-res-in;
//    animation-timing-function: ease-in-out;
//    animation-iteration-count: infinite;
//    animation-duration: ${({ animSpeed }) => animSpeed}ms;
// `

// const animateTemperature = keyframes`
//       0% {
//          height: ${7 + 3.1 * scale(({tempValue}) => tempValue, -30, 8, 0, 19)};
//       }
//       100% {
//          height: ${7 + 3.1 * scale(({tempValue}) => tempValue + 2, -30, 8, 0, 19)};
//       }
//    `

const AnimTemperature = () => {
   const { stateGame, ANIMATION_SPEED } = useContext(StateGameContext)

   const tempHeight = {
      height: `${7 + 3.1 * scale(stateGame.globalParameters.temperature, -30, 8, 0, 19)}%`,
      backgroundColor: 'blue',
   }

   return (
      <div
         className="panel-state-game-temp-cont"
         style={tempHeight}
      >
         <span className="panel-state-game-text temp">
            {stateGame.globalParameters.temperature}
         </span>
      </div>
   )
}

export default AnimTemperature
