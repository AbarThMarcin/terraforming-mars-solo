import { useContext } from 'react'
import { StatePlayerContext } from '../../../../../game'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCostDraft = ({ toBuyMln, setToBuyMln, toBuyHeat, setToBuyHeat }) => {
   const { statePlayer } = useContext(StatePlayerContext)

   const handleClickArrow = (operation) => {
      if (operation === 'increment') {
         setToBuyMln(--toBuyMln)
         setToBuyHeat(++toBuyHeat)
      }
      if (operation === 'decrement') {
         setToBuyMln(++toBuyMln)
         setToBuyHeat(--toBuyHeat)
      }
   }

   return (
      <div className="card-decrease-cost-container draft">
         <div className="card-decrease-cost">
            <div><span>{toBuyHeat}</span></div>
            <div><img src={iconHeat} alt="icon_heat" /></div>
            {toBuyHeat > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => handleClickArrow('decrement')}></div>}
            {toBuyHeat < statePlayer.resources.heat && toBuyMln !== 0 && (
               <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => handleClickArrow('increment')}></div>
            )}
         </div>
      </div>
   )
}

export default DecreaseCostDraft
