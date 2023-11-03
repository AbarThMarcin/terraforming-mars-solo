/* Modal component used to choose between building production; opens ONLY when used Robotic Workforce */
import { useState } from 'react'
import Card from '../../card/Card'
import ModalProductionData from './ModalProductionData'
import BtnAction from '../../buttons/BtnAction'
import { useSubactionProduction } from '../../../../../hooks/useSubactionProduction'

const ModalProduction = () => {
   const [cardSnap, setCardSnap] = useState(null)

   const btnActionConfirmPosition = {
      bottom: '-1%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   const { handleClickConfirmBtn } = useSubactionProduction()

   return (
      <>
         {/* HEADER */}
         <div className="modal-resource-header">SELECT ANY PRODUCTION</div>
         {/* BOX */}
         <div className="modal-standard-projects-box other center" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="header">CARD PRODUCTIONS</div>
            {/* DATA */}
            <ModalProductionData setCardSnap={setCardSnap} />
            {/* CARD SNAP FOR VP VIEW */}
            {cardSnap && (
               <div className="card-container medium">
                  <Card card={cardSnap} />
               </div>
            )}
            {/* CONFIRM BUTTON */}
            <BtnAction text="CONFIRM" onYesFunc={handleClickConfirmBtn} position={btnActionConfirmPosition} />
         </div>
      </>
   )
}

export default ModalProduction
