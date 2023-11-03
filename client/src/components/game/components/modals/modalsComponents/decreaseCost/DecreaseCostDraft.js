import { useContext } from 'react'
import { ActionsContext, StatePlayerContext } from '../../../../../game'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'
import { useActionDraft } from '../../../../../../hooks/useActionDraft'

const DecreaseCostDraft = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { actions } = useContext(ActionsContext)

   const { handleClickArrow } = useActionDraft()

   return (
      <div className="card-decrease-cost-container draft">
         <div className="card-decrease-cost">
            <div><span>{actions.heat}</span></div>
            <div><img src={iconHeat} alt="icon_heat" /></div>
            {actions.heat > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow('decrement')}></div>}
            {actions.heat < statePlayer.resources.heat && actions.mln !== 0 && (
               <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow('increment')}></div>
            )}
         </div>
      </div>
   )
}

export default DecreaseCostDraft
