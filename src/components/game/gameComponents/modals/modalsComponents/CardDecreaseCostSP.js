import { useContext } from 'react'
import { StatePlayerContext } from '../../../Game'

const CardDecreaseCostSP = ({ toBuyMln, toBuyHeat, changeSPcosts, actionClicked }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const currentCost = getCurrentCost()

   function getCurrentCost() {
      switch (actionClicked) {
         case 'POWER PLANT':
            return toBuyMln[1]
         case 'ASTEROID':
            return toBuyMln[2]
         case 'AQUIFER':
            return toBuyMln[3]
         case 'GREENERY':
            return toBuyMln[4]
         case 'CITY':
            return toBuyMln[5]
         default:
            break
      }
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="card-decrease-cost-header">DECREASE COST</div>
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && (
            <div className="card-decrease-cost">
               <span>{toBuyHeat} HEAT</span>
               {toBuyHeat > 0 && (
                  <div
                     className="decrease-arrow decrease-arrow-left"
                     onClick={() => changeSPcosts('decrement', actionClicked)}
                  ></div>
               )}
               {toBuyHeat < statePlayer.resources.heat && currentCost > 0 && (
                  <div
                     className="decrease-arrow decrease-arrow-right"
                     onClick={() => changeSPcosts('increment', actionClicked)}
                  ></div>
               )}
            </div>
         )}
      </div>
   )
}

export default CardDecreaseCostSP
