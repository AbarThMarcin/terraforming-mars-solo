/* Used to choose a card with a resource addition / deduction */
import { useState, useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../Game'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import Card from '../../Card'
import ModalProductionData from './ModalProductionData'
import BtnAction from '../../buttons/BtnAction'

const ModalProduction = () => {
   const { stateGame, dispatchGame, performSubActions } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnap, setCardSnap] = useState(null)

   const btnActionConfirmPosition = { bottom: '-1%', left: '50%', transform: 'translate(-50%, 100%) scale(1.2)' }

   const handleClickConfirmBtn = () => {
      // Turn addRemoveRes phase on
      setModals({ ...modals, production: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Perform subactions
      performSubActions(modals.modalProduction.immProdEffects)
   }

   return (
      <>
         <div
            className={`modal-background ${stateGame.phaseViewGameState && 'display-none'}`}
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
               <BtnAction
                  text="CONFIRM"
                  onYesFunc={handleClickConfirmBtn}
                  position={btnActionConfirmPosition}
               />
            </div>
         </div>
      </>
   )
}

export default ModalProduction
