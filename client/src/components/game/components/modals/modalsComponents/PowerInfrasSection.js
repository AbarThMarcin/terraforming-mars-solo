import { useContext, useState } from 'react'
import { StatePlayerContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import iconEnergy from '../../../../../assets/images/resources/res_energy.svg'
import { useSubactionSelectOption } from '../../../../../hooks/useSubactionSelectOption'

const PowerInfrasSection = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const [energyAmount, setEnergyAmount] = useState(0)

   const btnActionConfirmPosition = {
      bottom: '-5%',
      left: '50%',
      transform: 'translate(-50%, 110%)',
   }

   const { onConfirmPowerInfra } = useSubactionSelectOption({ energyAmount })

   return (
      <div className="select-one-section">
         {/* HEADER */}
         <div className="header">SELECT AMOUNT</div>
         {/* ENERGY */}
         <div className="card-decrease-cost">
            <div className="amount">{energyAmount}</div>
            <div className="icon">
               <img src={iconEnergy} alt="icon_energy" />
            </div>
            {energyAmount > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => setEnergyAmount((prevValue) => prevValue - 1)}></div>}
            {energyAmount < statePlayer.resources.energy && (
               <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => setEnergyAmount((prevValue) => prevValue + 1)}></div>
            )}
         </div>
         {/* CONFIRM BUTTON */}
         <BtnAction text="CONFIRM" onYesFunc={onConfirmPowerInfra} position={btnActionConfirmPosition} />
      </div>
   )
}

export default PowerInfrasSection
