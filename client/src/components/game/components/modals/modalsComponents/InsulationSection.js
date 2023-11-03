import { useContext, useState } from 'react'
import { StatePlayerContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import iconProdBg from '../../../../../assets/images/resources/res_prodBg.svg'
import iconHeat from '../../../../../assets/images/resources/res_heat.svg'
import { useSubactionSelectOption } from '../../../../../hooks/useSubactionSelectOption'

const InsulationSection = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const [heatAmount, setHeatAmount] = useState(0)

   const btnActionConfirmPosition = {
      bottom: '-5%',
      left: '50%',
      transform: 'translate(-50%, 110%)',
   }

   const { onConfirmInsulation } = useSubactionSelectOption({ heatAmount })

   return (
      <div className="select-one-section">
         {/* HEADER */}
         <div className="header">SELECT AMOUNT</div>
         {/* HEAT */}
         <div className="card-decrease-cost">
            <div className="amount">{heatAmount}</div>
            <div className="icon">
               <img src={iconProdBg} alt="icon_prodBg" />
               <img src={iconHeat} alt="icon_heat" />
            </div>
            {heatAmount > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => setHeatAmount((prevValue) => prevValue - 1)}></div>}
            {heatAmount < statePlayer.production.heat && (
               <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => setHeatAmount((prevValue) => prevValue + 1)}></div>
            )}
         </div>
         {/* CONFIRM BUTTON */}
         <BtnAction text="CONFIRM" onYesFunc={onConfirmInsulation} position={btnActionConfirmPosition} />
      </div>
   )
}

export default InsulationSection
