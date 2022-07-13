// Modal for viewing and selecting cards when Business Contacts OR Invention Contest has been played
import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, CardsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../Card'
import { getPosition, modifiedCards, withTimeAdded } from '../../../../utils/misc'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import Arrows from './modalsComponents/Arrows'

const ModalBusinessContacts = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, ANIMATION_SPEED } =
      useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { cards, setCards } = useContext(CardsContext)
   const [selectedCardIds, setSelectedCardIds] = useState([])
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0', left: '50%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const onYesFunc = () => {
      // Turn business contacts phase off
      setModals((prevModals) => ({ ...prevModals, businessContacts: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_BUSINESS_CONTACTS, payload: false })
      // Draw card(s)
      startAnimation(setModals)
      setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, modals.modalBusCont.selectCount, setModals)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: [
               ...statePlayer.cardsInHand,
               ...modifiedCards(withTimeAdded(cards.filter((card) => selectedCardIds.includes(card.id))), statePlayer),
            ],
         })
         setCards(cards.slice(modals.modalBusCont.cardsCount))
         endAnimation(setModals)
         // Continue remaining actions
         startAnimation(setModals)
         performSubActions(stateGame.actionsLeft)
      }, ANIMATION_SPEED)
   }

   const handleClickBtnSelect = (card) => {
      if (!selectedCardIds.includes(card.id)) {
         setSelectedCardIds([...selectedCardIds, card.id])
      } else {
         setSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== card.id))
      }
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
               {modifiedCards(cards.slice(0, modals.modalBusCont.cardsCount), statePlayer).map((card, idx) => (
                  <div
                     key={idx}
                     className={`card-container small ${selectedCardIds.includes(card.id) && 'selected'}`}
                     style={getPosition(modals.modalBusCont.cardsCount, idx)}
                     onClick={() => setModals({ ...modals, modalCard: card, cardViewOnly: true })}
                  >
                     {/* CARD */}
                     <Card card={card} />
                     {/* SELECT BUTTON */}
                     <div
                        className={`pointer ${
                           selectedCardIds.includes(card.id) ? 'btn-selected' : 'btn-select'
                        }`}
                        onClick={(e) => {
                           e.stopPropagation()
                           handleClickBtnSelect(card)
                        }}
                     >
                        {selectedCardIds.includes(card.id) ? 'SELECTED' : 'SELECT'}
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
               disabled={selectedCardIds.length !== modals.modalBusCont.selectCount}
               position={btnActionPosition}
            />
         </div>
      </>
   )
}

export default ModalBusinessContacts
