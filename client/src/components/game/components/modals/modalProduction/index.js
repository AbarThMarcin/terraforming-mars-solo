/* Used to choose a card with a resource addition / deduction */
import { useState, useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../../game'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import Card from '../../card/Card'
import ModalProductionData from './ModalProductionData'
import BtnAction from '../../buttons/BtnAction'

const ModalProduction = () => {
   const { dispatchGame, performSubActions } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnap, setCardSnap] = useState(null)

   const btnActionConfirmPosition = {
      bottom: '-1%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   const handleClickConfirmBtn = () => {
      // Turn addRemoveRes phase on
      setModals((prev) => ({ ...prev, production: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Perform subactions
      performSubActions(modals.modalProduction.immProdEffects)
   }

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
