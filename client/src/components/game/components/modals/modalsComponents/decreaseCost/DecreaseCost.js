import { useContext } from 'react'
import { StatePlayerContext, ModalsContext, ActionsContext } from '../../../../../game'
import { hasTag } from '../../../../../../utils/cards'
import { RESOURCES } from '../../../../../../data/resources'
import { TAGS } from '../../../../../../data/tags'
import iconSteel from '../../../../../../assets/images/resources/res_steel.svg'
import iconTitan from '../../../../../../assets/images/resources/res_titan.svg'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'
import { useActionCard } from '../../../../../../hooks/useActionCard'

const DecreaseCost = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)
   const { actions } = useContext(ActionsContext)

   const { handleClickArrow } = useActionCard()

   return (
      <div className="card-decrease-cost-container">
         <div className="card-decrease-cost-header">DECREASE COST</div>
         {statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING) && (
            <div className="card-decrease-cost">
               <div><span>{actions.steel}</span></div>
               <div><img src={iconSteel} alt="icon_steel" /></div>
               {actions.steel > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow(RESOURCES.STEEL, 'decrement')}></div>}
               {actions.steel < statePlayer.resources.steel && actions.mln !== 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow(RESOURCES.STEEL, 'increment')}></div>
               )}
            </div>
         )}
         {statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE) && (
            <div className="card-decrease-cost">
               <div><span>{actions.titan}</span></div>
               <div><img src={iconTitan} alt="icon_titan" /></div>
               {actions.titan > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow(RESOURCES.TITAN, 'decrement')}></div>}
               {actions.titan < statePlayer.resources.titan && actions.mln !== 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow(RESOURCES.TITAN, 'increment')}></div>
               )}
            </div>
         )}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && (
            <div className="card-decrease-cost">
               <div><span>{actions.heat}</span></div>
               <div><img src={iconHeat} alt="icon_heat" /></div>
               {actions.heat > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow(RESOURCES.HEAT, 'decrement')}></div>}
               {actions.heat < statePlayer.resources.heat && actions.mln !== 0 && (
                  <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow(RESOURCES.HEAT, 'increment')}></div>
               )}
            </div>
         )}
      </div>
   )
}

export default DecreaseCost
