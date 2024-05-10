import { useContext } from 'react'
import { ActionsContext, StatePlayerContext } from '../../../../../game'
import { useActionSP } from '../../../../../../hooks/useActionSP'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCostSP = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { actions } = useContext(ActionsContext)

   const { handleClickArrow } = useActionSP()

   return (
      <div className="card-decrease-cost-container">
         <div className="card-decrease-cost-header">DECREASE COST</div>
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

export default DecreaseCostSP
