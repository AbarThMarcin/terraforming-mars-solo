/* Used to choose a card with a resource addition / deduction */
import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../game'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import Card from '../../card/Card'
import { ANIMATIONS, endAnimation, setAnimation } from '../../../../../data/animations'
import ModalResourceData from './ModalResourceData'
import { ACTIONS_PLAYER } from '../../../../../stateActions/actionsPlayer'
import { RESOURCES, getResIcon } from '../../../../../data/resources'
import BtnAction from '../../buttons/BtnAction'
import { SoundContext } from '../../../../../App'
import { CARDS } from '../../../../../data/cards'
import { getCards } from '../../../../../utils/misc'
import { funcSetLogItemsSingleActions } from '../../../../../data/log/log'

const ModalResource = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, ANIMATION_SPEED, setLogItems } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const [cardSnap, setCardSnap] = useState(null)

   const btnActionConfirmPosition = {
      bottom: '-1%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   const handleClickConfirmBtn = () => {
      // Turn addRemoveRes phase on
      setModals((prev) => ({ ...prev, resource: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Add Resource
      let resource
      let card = statePlayer.cardsPlayed.find((card) => card.id === modals.modalResource.cardId)
      if (card.units.microbe) resource = RESOURCES.MICROBE
      if (card.units.animal) resource = RESOURCES.ANIMAL
      if (card.units.science) resource = RESOURCES.SCIENCE
      if (card.units.fighter) resource = RESOURCES.FIGHTER
      setAnimation(ANIMATIONS.RESOURCES_IN, modals.modalResource.resType === null ? resource : modals.modalResource.resType, modals.modalResource.amount, setModals, sound)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.ADD_BIO_RES,
            payload: {
               cardId: modals.modalResource.cardId,
               resource: modals.modalResource.resType === null ? resource : modals.modalResource.resType,
               amount: modals.modalResource.amount,
            },
         })
         funcSetLogItemsSingleActions(
            modals.modalResource.amount === 1
               ? `Received 1 ${modals.modalResource.resType === null ? resource : modals.modalResource.resType} to ${getCards(CARDS, [modals.modalResource.cardId])[0].name} card`
               : `Received ${modals.modalResource.amount} ${modals.modalResource.resType === null ? resource : modals.modalResource.resType}s to ${
                    getCards(CARDS, [modals.modalResource.cardId])[0].name
                 } card`,
            getResIcon(RESOURCES.ANIMAL),
            modals.modalResource.amount,
            setLogItems
         )
         performSubActions(stateGame.actionsLeft)
         endAnimation(setModals)
      }, ANIMATION_SPEED)
   }

   return (
      <>
         {/* HEADER */}
         <div className="modal-resource-header">SELECT ANY RESOURCE</div>
         {/* BOX */}
         <div className="modal-standard-projects-box other center" onClick={(e) => e.stopPropagation()}>
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
            <BtnAction text="CONFIRM" onYesFunc={handleClickConfirmBtn} position={btnActionConfirmPosition} />
         </div>
      </>
   )
}

export default ModalResource
