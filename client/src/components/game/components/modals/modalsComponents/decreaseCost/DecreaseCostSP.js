import { useContext } from 'react'
import { SP } from '../../../../../../data/StandardProjects'
import { StatePlayerContext } from '../../../../../game'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCostSP = ({ toBuyMln, toBuyHeat, changeSPcosts, actionClicked }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const currentCost = getCurrentCost()

   function getCurrentCost() {
      switch (actionClicked) {
         case SP.POWER_PLANT:
            return toBuyMln[1]
         case SP.ASTEROID:
            return toBuyMln[2]
         case SP.AQUIFER:
            return toBuyMln[3]
         case SP.GREENERY:
            return toBuyMln[4]
         case SP.CITY:
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
               <div><span>{toBuyHeat}</span></div>
               <div><img src={iconHeat} alt="icon_heat" /></div>
               {toBuyHeat > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => changeSPcosts('decrement', actionClicked)}></div>}
               {toBuyHeat < statePlayer.resources.heat && currentCost > 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => changeSPcosts('increment', actionClicked)}></div>
               )}
            </div>
         )}
      </div>
   )
}

export default DecreaseCostSP
