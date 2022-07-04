/* Used to choose a card with a resource addition / deduction */
import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import { ACTIONS_GAME } from '../../../../../initStates/actionsGame'
import Card from '../../Card'
import { ANIMATIONS, endAnimation, setAnimation } from '../../../../../data/animations'
import ModalResourceData from './ModalResourceData'
import { ACTIONS_PLAYER } from '../../../../../initStates/actionsPlayer'
import { RESOURCES } from '../../../../../data/resources'
import BtnAction from '../../buttons/BtnAction'

const ModalResource = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { dispatchGame, ANIMATION_SPEED } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnap, setCardSnap] = useState(null)

   const btnActionConfirmPosition = {
      bottom: '-1%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   const handleClickConfirmBtn = () => {
      // Turn addRemoveRes phase on
      setModals({ ...modals, resource: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Add Resource
      let resource
      let card = statePlayer.cardsPlayed.find((card) => card.id === modals.modalResource.cardId)
      if (card.units.microbe) resource = RESOURCES.MICROBE
      if (card.units.animal) resource = RESOURCES.ANIMAL
      if (card.units.science) resource = RESOURCES.SCIENCE
      if (card.units.fighter) resource = RESOURCES.FIGHTER
      setAnimation(
         ANIMATIONS.RESOURCES_IN,
         modals.modalResource.resType === null ? resource : modals.modalResource.resType,
         modals.modalResource.amount,
         setModals
      )
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.ADD_BIO_RES,
            payload: {
               cardId: modals.modalResource.cardId,
               resource:
                  modals.modalResource.resType === null ? resource : modals.modalResource.resType,
               amount: modals.modalResource.amount,
            },
         })
         endAnimation(setModals)
      }, ANIMATION_SPEED)
   }

   return (
      <>
         {/* HEADER */}
         <div className="modal-resource-header">SELECT ANY RESOURCE</div>
         {/* BOX */}
         <div
            className="modal-standard-projects-box other center"
            onClick={(e) => e.stopPropagation()}
         >
            {/* HEADER */}
            <div className="header">CARD RESOURCES</div>
            {/* DATA */}
            <ModalResourceData setCardSnap={setCardSnap} />
            {/* CARD SNAP FOR VP VIEW */}
            {cardSnap && (
               <div className="card-container medium">
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
      </>
   )
}

export default ModalResource
