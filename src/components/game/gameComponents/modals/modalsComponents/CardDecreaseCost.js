import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import { hasTag } from '../../../../../util/misc'

const CardDecreaseCost = ({
   toBuyMln,
   setToBuyMln,
   toBuySteel,
   setToBuySteel,
   toBuyTitan,
   setToBuyTitan,
   toBuyHeat,
   setToBuyHeat,
   setDisabled,
}) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { requirementsMet } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   const handleClickArrow = (resource, operation) => {
      let resMln = toBuyMln
      let resSteel = toBuySteel
      let resTitan = toBuyTitan
      let resHeat = toBuyHeat
      if (operation === 'increment') {
         resource === 'steel' ? resSteel++ : resource === 'titan' ? resTitan++ : resHeat++
      } else if (operation === 'decrement') {
         resource === 'steel' ? resSteel-- : resource === 'titan' ? resTitan-- : resHeat--
      }
      resMln = Math.max(
         0,
         modals.modalCard.currentCost -
            resSteel * statePlayer.valueSteel -
            resTitan * statePlayer.valueTitan -
            resHeat
      )
      if (
         resMln === 0 &&
         resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat >
            modals.modalCard.currentCost &&
         resHeat > 0
      )
         resHeat = Math.max(
            modals.modalCard.currentCost -
               (resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan),
            0
         )

      setToBuyMln(resMln)
      setToBuySteel(resSteel)
      setToBuyTitan(resTitan)
      setToBuyHeat(resHeat)

      setDisabled(
         Math.min(resMln, statePlayer.resources.mln) +
            resSteel * statePlayer.valueSteel +
            resTitan * statePlayer.valueTitan +
            resHeat <
            modals.modalCard.currentCost || !requirementsMet(modals.modalCard)
      )
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="card-decrease-cost-header">DECREASE COST</div>
         {statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building') && (
            <div className="card-decrease-cost">
               <span>{toBuySteel} STEEL</span>
               {toBuySteel > 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-left"
                     onClick={() => handleClickArrow('steel', 'decrement')}
                  ></div>
               )}
               {toBuySteel < statePlayer.resources.steel && toBuyMln !== 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-right"
                     onClick={() => handleClickArrow('steel', 'increment')}
                  ></div>
               )}
            </div>
         )}
         {statePlayer.resources.titan > 0 && hasTag(modals.modalCard, 'space') && (
            <div className="card-decrease-cost">
               <span>{toBuyTitan} TITAN</span>
               {toBuyTitan > 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-left"
                     onClick={() => handleClickArrow('titan', 'decrement')}
                  ></div>
               )}
               {toBuyTitan < statePlayer.resources.titan && toBuyMln !== 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-right"
                     onClick={() => handleClickArrow('titan', 'increment')}
                  ></div>
               )}
            </div>
         )}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && (
            <div className="card-decrease-cost">
               <span>{toBuyHeat} HEAT</span>
               {toBuyHeat > 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-left"
                     onClick={() => handleClickArrow('heat', 'decrement')}
                  ></div>
               )}
               {toBuyHeat < statePlayer.resources.heat && toBuyMln !== 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-right"
                     onClick={() => handleClickArrow('heat', 'increment')}
                  ></div>
               )}
            </div>
         )}
      </div>
   )
}

export default CardDecreaseCost
