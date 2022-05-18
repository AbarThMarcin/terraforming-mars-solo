/* Used to choose a card with a resource addition / deduction */
import { useState, useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../Game'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import Card from '../../Card'
import ModalProductionData from './ModalProductionData'

const ModalProduction = () => {
   const { stateGame, dispatchGame, performSubActions } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnap, setCardSnap] = useState(null)

   const handleClick = () => {
      // Turn addRemoveRes phase on
      setModals({ ...modals, production: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Perform subactions
      performSubActions(modals.modalProduction.immProdEffects)
   }

   return (
      <>
         <div
            className={`modal-other-bg full-size ${stateGame.phaseViewGameState && 'display-none'}`}
         >
            <div className="modal-resource-header">SELECT ANY PRODUCTION</div>
            <div className="modal-other-box center">
               {/* HEADER */}
               <div className="modal-other-box-header">CARD PRODUCTIONS</div>
               {/* DATA */}
               <ModalProductionData setCardSnap={setCardSnap} />
               {/* CARD SNAP FOR VP VIEW */}
               {cardSnap && (
                  <div className="modal-other-card">
                     <Card card={cardSnap} />
                  </div>
               )}
               {/* CONFIRM BUTTON */}
               <div className="modal-resource-confirm-btn pointer" onClick={handleClick}>
                  CONFIRM
               </div>
            </div>
         </div>
      </>
   )
}

export default ModalProduction
