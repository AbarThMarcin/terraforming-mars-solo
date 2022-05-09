/* Used to choose a card with a resource addition / deduction */
import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import Card from '../../Card'
import { ANIMATIONS, endAnimation, setAnimation } from '../../../../../data/animations'
import ModalResourceData from './ModalResourceData'
import { ACTIONS_PLAYER } from '../../../../../util/actionsPlayer'

const ModalResource = () => {
   const { dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, ANIMATION_SPEED } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnap, setCardSnap] = useState(null)

   const handleClick = () => {
      // Turn addRemoveRes phase on
      setModals({ ...modals, resource: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Add Resource
      setAnimation(
         ANIMATIONS.RESOURCES_IN,
         modals.modalResource.resType,
         modals.modalResource.amount,
         setModals
      )
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.ADD_BIO_RES,
            payload: {
               cardId: modals.modalResource.cardId,
               resource: modals.modalResource.resType,
               amount: modals.modalResource.amount,
            },
         })
         endAnimation(setModals)
      }, ANIMATION_SPEED)
   }

   return (
      <>
         <div
            className={`modal-other-bg full-size ${stateGame.phaseViewGameState && 'display-none'}`}
         >
            <div className="modal-resource-header">SELECT ANY RESOURCE</div>
            <div className="modal-other-box center">
               {/* HEADER */}
               <div className="modal-other-box-header">CARD RESOURCES</div>
               {/* DATA */}
               <ModalResourceData setCardSnap={setCardSnap} />
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

export default ModalResource
