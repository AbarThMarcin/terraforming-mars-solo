import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../Game'
import { hasTag } from '../../util/misc'

const CardDecreaseCost = ({
   toBuyMln,
   setToBuyMln,
   toBuySteel,
   setToBuySteel,
   toBuyTitan,
   setToBuyTitan,
   setDisabled,
}) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)

   const handleClickArrow = (resource, operation) => {
      let resMln = toBuyMln
      let resSteel = toBuySteel
      let resTitan = toBuyTitan
      if (operation === 'increment') {
         resource === 'steel' ? resSteel++ : resTitan++
      } else if (operation === 'decrement') {
         resource === 'steel' ? resSteel-- : resTitan--
      }
      resMln = Math.max(
         0,
         modals.modalCard.currentCost -
            resSteel * statePlayer.valueSteel -
            resTitan * statePlayer.valueTitan
      )
      setToBuyMln(resMln)
      setToBuySteel(resSteel)
      setToBuyTitan(resTitan)

      setDisabled(
         Math.min(resMln, statePlayer.resources.mln) +
            resSteel * statePlayer.valueSteel +
            resTitan * statePlayer.valueTitan <
            modals.modalCard.currentCost
      )
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="card-decrease-cost-header">DECREASE COST</div>
         {statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building') && (
            <div className="card-decrease-cost card-decrease-cost-steel">
               <span>{toBuySteel} STEEL</span>
               {toBuySteel > 0 && (
                  <div
                     className="decrease-arrow decrease-arrow-left"
                     onClick={() => handleClickArrow('steel', 'decrement')}
                  ></div>
               )}
               {toBuySteel < statePlayer.resources.steel && toBuyMln !== 0 && (
                  <div
                     className="decrease-arrow decrease-arrow-right"
                     onClick={() => handleClickArrow('steel', 'increment')}
                  ></div>
               )}
            </div>
         )}
         {statePlayer.resources.titan > 0 && hasTag(modals.modalCard, 'space') && (
            <div className="card-decrease-cost card-decrease-cost-titan">
               <span>{toBuyTitan} TITAN</span>
               {toBuyTitan > 0 && (
                  <div
                     className="decrease-arrow decrease-arrow-left"
                     onClick={() => handleClickArrow('titan', 'decrement')}
                  ></div>
               )}
               {toBuyTitan < statePlayer.resources.titan && toBuyMln !== 0 && (
                  <div
                     className="decrease-arrow decrease-arrow-right"
                     onClick={() => handleClickArrow('titan', 'increment')}
                  ></div>
               )}
            </div>
         )}
      </div>
   )
}

export default CardDecreaseCost
