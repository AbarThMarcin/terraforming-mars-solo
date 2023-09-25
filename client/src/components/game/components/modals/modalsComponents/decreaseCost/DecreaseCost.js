import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../../game'
import { hasTag } from '../../../../../../utils/misc'
import { RESOURCES } from '../../../../../../data/resources'
import { TAGS } from '../../../../../../data/tags'
import iconSteel from '../../../../../../assets/images/resources/res_steel.svg'
import iconTitan from '../../../../../../assets/images/resources/res_titan.svg'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCost = ({ toBuyMln, setToBuyMln, toBuySteel, setToBuySteel, toBuyTitan, setToBuyTitan, toBuyHeat, setToBuyHeat, setDisabled }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame, requirementsMet } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   const handleClickArrow = (resource, operation) => {
      let resMln = toBuyMln
      let resSteel = toBuySteel
      let resTitan = toBuyTitan
      let resHeat = toBuyHeat
      if (operation === 'increment') {
         resource === RESOURCES.STEEL ? resSteel++ : resource === RESOURCES.TITAN ? resTitan++ : resHeat++
      } else if (operation === 'decrement') {
         resource === RESOURCES.STEEL ? resSteel-- : resource === RESOURCES.TITAN ? resTitan-- : resHeat--
      }
      resMln = Math.max(0, modals.modalCard.currentCost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resHeat)
      if (resMln === 0 && resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat > modals.modalCard.currentCost && resHeat > 0)
         resHeat = Math.max(modals.modalCard.currentCost - (resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan), 0)

      setToBuyMln(resMln)
      setToBuySteel(resSteel)
      setToBuyTitan(resTitan)
      setToBuyHeat(resHeat)

      setDisabled(
         !requirementsMet(modals.modalCard) ||
            stateGame.phaseViewGameState ||
            stateGame.phasePlaceTile ||
            Math.min(resMln, statePlayer.resources.mln) + resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat < modals.modalCard.currentCost
      )
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="card-decrease-cost-header">DECREASE COST</div>
         {statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING) && (
            <div className="card-decrease-cost">
               <div><span>{toBuySteel}</span></div>
               <div><img src={iconSteel} alt="icon_steel" /></div>
               {toBuySteel > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow(RESOURCES.STEEL, 'decrement')}></div>}
               {toBuySteel < statePlayer.resources.steel && toBuyMln !== 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow(RESOURCES.STEEL, 'increment')}></div>
               )}
            </div>
         )}
         {statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE) && (
            <div className="card-decrease-cost">
               <div><span>{toBuyTitan}</span></div>
               <div><img src={iconTitan} alt="icon_titan" /></div>
               {toBuyTitan > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow(RESOURCES.TITAN, 'decrement')}></div>}
               {toBuyTitan < statePlayer.resources.titan && toBuyMln !== 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow(RESOURCES.TITAN, 'increment')}></div>
               )}
            </div>
         )}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && (
            <div className="card-decrease-cost">
               <div><span>{toBuyHeat}</span></div>
               <div><img src={iconHeat} alt="icon_heat" /></div>
               {toBuyHeat > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow(RESOURCES.HEAT, 'decrement')}></div>}
               {toBuyHeat < statePlayer.resources.heat && toBuyMln !== 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow(RESOURCES.HEAT, 'increment')}></div>
               )}
            </div>
         )}
      </div>
   )
}

export default DecreaseCost
