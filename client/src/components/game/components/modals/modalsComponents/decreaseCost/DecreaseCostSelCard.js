import { useContext } from 'react'
import { ActionsContext, StatePlayerContext } from '../../../../../game'
import iconMln from '../../../../../../assets/images/resources/res_mln.svg'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCostSelCard = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { actions, setActions } = useContext(ActionsContext)

   const handleClickArrow = (operation) => {
      let resMln = actions.mln
      let resHeat = actions.heat
      if (operation === 'increment') resHeat++
      if (operation === 'decrement') resHeat--
      resMln = Math.max(0, 3 - resHeat)

      setActions(prev => ({ ...prev, mln: resMln, heat: resHeat }))
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="mln">
            <img className="center full-size" src={iconMln} alt="icon_mln" />
            <span className="center">{actions.mln}</span>
         </div>
         <div className="card-decrease-cost-header">DECREASE COST</div>
         <div className="card-decrease-cost">
            <div><span>{actions.heat}</span></div>
            <div><img src={iconHeat} alt="icon_heat" /></div>
            {actions.heat > 0 && statePlayer.resources.mln > actions.mln && (
               <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow('decrement')}></div>
            )}
            {actions.heat < statePlayer.resources.heat && actions.mln !== 0 && (
               <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow('increment')}></div>
            )}
         </div>
      </div>
   )
}

export default DecreaseCostSelCard
