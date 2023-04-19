import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../../../../game'
import { getActionCost, hasTag } from '../../../../../../utils/misc'
import { RESOURCES } from '../../../../../../data/resources'
import { TAGS } from '../../../../../../data/tags'
import iconMln from '../../../../../../assets/images/resources/res_mln.svg'
import iconSteel from '../../../../../../assets/images/resources/res_steel.svg'
import iconTitan from '../../../../../../assets/images/resources/res_titan.svg'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCostAction = ({
   toBuyMln,
   setToBuyMln,
   toBuySteel,
   setToBuySteel,
   toBuyTitan,
   setToBuyTitan,
   toBuyHeat,
   setToBuyHeat,
   actionClicked,
}) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)
   const cost = getActionCost(actionClicked)

   const handleClickArrow = (resource, operation) => {
      let resMln = toBuyMln
      let resSteel = toBuySteel
      let resTitan = toBuyTitan
      let resHeat = toBuyHeat
      if (operation === 'increment') {
         resource === RESOURCES.STEEL
            ? resSteel++
            : resource === RESOURCES.TITAN
            ? resTitan++
            : resHeat++
      } else if (operation === 'decrement') {
         resource === RESOURCES.STEEL
            ? resSteel--
            : resource === RESOURCES.TITAN
            ? resTitan--
            : resHeat--
      }
      resMln = Math.max(
         0,
         cost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resHeat
      )
      if (
         resMln === 0 &&
         resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat > cost &&
         resHeat > 0
      )
         resHeat = Math.max(
            cost - (resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan),
            0
         )

      setToBuyMln(resMln)
      setToBuySteel(resSteel)
      setToBuyTitan(resTitan)
      setToBuyHeat(resHeat)
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="mln">
            <img className="center full-size" src={iconMln} alt="icon_mln" />
            <span className="center">{toBuyMln}</span>
         </div>
         <div className="card-decrease-cost-header">DECREASE COST</div>
         {statePlayer.resources.steel > 0 &&
            (hasTag(modals.modalCard, TAGS.BUILDING) || actionClicked === 187) && (
               <div className="card-decrease-cost">
                  <span>{toBuySteel}</span>
                  <img src={iconSteel} alt="icon_steel" />
                  {toBuySteel > 0 && (
                     <div
                        className="decrease-arrow pointer decrease-arrow-left"
                        onClick={() => handleClickArrow(RESOURCES.STEEL, 'decrement')}
                     ></div>
                  )}
                  {toBuySteel < statePlayer.resources.steel && toBuyMln !== 0 && (
                     <div
                        className="decrease-arrow pointer decrease-arrow-right"
                        onClick={() => handleClickArrow(RESOURCES.STEEL, 'increment')}
                     ></div>
                  )}
               </div>
            )}
         {statePlayer.resources.titan > 0 &&
            (hasTag(modals.modalCard, TAGS.SPACE) || actionClicked === 12) && (
               <div className="card-decrease-cost">
                  <span>{toBuyTitan}</span>
                  <img src={iconTitan} alt="icon_titan" />
                  {toBuyTitan > 0 && (
                     <div
                        className="decrease-arrow pointer decrease-arrow-left"
                        onClick={() => handleClickArrow(RESOURCES.TITAN, 'decrement')}
                     ></div>
                  )}
                  {toBuyTitan < statePlayer.resources.titan && toBuyMln !== 0 && (
                     <div
                        className="decrease-arrow pointer decrease-arrow-right"
                        onClick={() => handleClickArrow(RESOURCES.TITAN, 'increment')}
                     ></div>
                  )}
               </div>
            )}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && (
            <div className="card-decrease-cost">
               <span>{toBuyHeat}</span>
               <img src={iconHeat} alt="icon_heat" />
               {toBuyHeat > 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-left"
                     onClick={() => handleClickArrow(RESOURCES.HEAT, 'decrement')}
                  ></div>
               )}
               {toBuyHeat < statePlayer.resources.heat && toBuyMln !== 0 && (
                  <div
                     className="decrease-arrow pointer decrease-arrow-right"
                     onClick={() => handleClickArrow(RESOURCES.HEAT, 'increment')}
                  ></div>
               )}
            </div>
         )}
      </div>
   )
}

export default DecreaseCostAction
