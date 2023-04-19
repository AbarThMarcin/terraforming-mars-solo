import { useContext } from 'react'
import { StatePlayerContext } from '../../../../../game'
import iconMln from '../../../../../../assets/images/resources/res_mln.svg'
import iconHeat from '../../../../../../assets/images/resources/res_heat.svg'

const DecreaseCostSelCard = ({ toBuyMln, setToBuyMln, toBuyHeat, setToBuyHeat }) => {
   const { statePlayer } = useContext(StatePlayerContext)

   const handleClickArrow = (operation) => {
      let resMln = toBuyMln
      let resHeat = toBuyHeat
      if (operation === 'increment') resHeat++
      if (operation === 'decrement') resHeat--
      resMln = Math.max(0, 3 - resHeat)

      setToBuyMln(resMln)
      setToBuyHeat(resHeat)
   }

   return (
      <div className="card-decrease-cost-container">
         <div className="mln">
            <img className="center full-size" src={iconMln} alt="icon_mln" />
            <span className="center">{toBuyMln}</span>
         </div>
         <div className="card-decrease-cost-header">DECREASE COST</div>
         <div className="card-decrease-cost">
            <span>{toBuyHeat}</span>
            <img src={iconHeat} alt="icon_heat" />
            {toBuyHeat > 0 && statePlayer.resources.mln > toBuyMln && (
               <div
                  className="decrease-arrow pointer decrease-arrow-left"
                  onClick={() => handleClickArrow('decrement')}
               ></div>
            )}
            {toBuyHeat < statePlayer.resources.heat && toBuyMln !== 0 && (
               <div
                  className="decrease-arrow pointer decrease-arrow-right"
                  onClick={() => handleClickArrow('increment')}
               ></div>
            )}
         </div>
      </div>
   )
}

export default DecreaseCostSelCard
