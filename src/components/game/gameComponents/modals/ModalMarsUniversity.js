// Modal for viewing and selecting cards when Mars University has been played
import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, CardsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../Card'
import { getPosition, withTimeAdded } from '../../../../util/misc'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import Arrows from './modalsComponents/Arrows'
import { ACTIONS_GAME } from '../../../../util/actionsGame'

const ModalMarsUniversity = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, ANIMATION_SPEED } =
      useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { cards, setCards } = useContext(CardsContext)
   const [selectedCardId, setSelectedCardId] = useState(0)
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0', left: '42%', transform: 'translateX(-50%)' }
   const btnCancelPosition = { bottom: '0', left: '58%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const onYesFunc = () => {
      // Turn mars university phase off
      setModals((prevModals) => ({ ...prevModals, marsUniversity: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY, payload: false })
      // Discard selected card
      startAnimation(setModals)
      setAnimation(ANIMATIONS.CARD_OUT, RESOURCES.CARD, 1, setModals)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: statePlayer.cardsInHand.filter((c) => c.id !== selectedCardId),
         })
         endAnimation(setModals)
      }, ANIMATION_SPEED)
      // Draw a card
      setTimeout(() => {
         startAnimation(setModals)
         setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, 1, setModals)
      }, ANIMATION_SPEED)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: [...statePlayer.cardsInHand.filter((c) => c.id !== selectedCardId), withTimeAdded(cards[0])],
         })
         setCards(cards.slice(1))
         endAnimation(setModals)
         // Continue remaining actions
         startAnimation(setModals)
         performSubActions(stateGame.actionsLeft)
      }, ANIMATION_SPEED * 2)
   }

   const onCancelFunc = () => {
      // Turn mars university phase off
      setModals((prevModals) => ({ ...prevModals, marsUniversity: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY, payload: false })
      // Continue remaining actions
      startAnimation(setModals)
      performSubActions(stateGame.actionsLeft)
   }

   const handleClickBtnSelect = (card) => {
      selectedCardId === 0 || card.id !== selectedCardId
         ? setSelectedCardId(card.id)
         : setSelectedCardId(0)
   }

   return (
      <>
         {/* ARROWS */}
         {modals.modalCards.length > 10 && (
            <Arrows
               page={page}
               setPage={setPage}
               pages={Math.ceil(modals.modalCards.length / 10)}
            />
         )}
         <div className="modal-select-cards">
            <div className="modal-cards-box full-size" style={{ left: getBoxPosition() }}>
               {/* CARDS */}
               {statePlayer.cardsInHand.map((card, idx) => (
                  <div
                     key={idx}
                     className={`card-container small ${selectedCardId === card.id && 'selected'}`}
                     style={getPosition(statePlayer.cardsInHand.length, idx)}
                     onClick={() => setModals({ ...modals, modalCard: card, cardViewOnly: true })}
                  >
                     {/* CARD */}
                     <Card card={card} />
                     {/* SELECT BUTTON */}
                     <div
                        className={`pointer ${
                           card.id === selectedCardId ? 'btn-selected' : 'btn-select'
                        }`}
                        onClick={(e) => {
                           e.stopPropagation()
                           handleClickBtnSelect(card)
                        }}
                     >
                        {card.id === selectedCardId ? 'SELECTED' : 'SELECT'}
                     </div>
                  </div>
               ))}
            </div>
            {/* HEADER */}
            <ModalHeader text="SELECT CARD TO DISCARD" />
            {/* ACTION BUTTON */}
            <BtnAction
               text="DISCARD"
               onYesFunc={onYesFunc}
               disabled={selectedCardId === 0}
               position={btnActionPosition}
            />
            {/* CANCEL BUTTON */}
            <BtnAction text="CANCEL" onYesFunc={onCancelFunc} position={btnCancelPosition} />
         </div>
      </>
   )
}

export default ModalMarsUniversity
