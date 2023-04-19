// Modal for viewing and selecting cards when Business Contacts OR Invention Contest has been played
import { useContext, useEffect, useState } from 'react'
import {
   StateGameContext,
   StatePlayerContext,
   ModalsContext,
   StateBoardContext,
   UserContext,
   CorpsContext,
} from '../../../game'
import { SoundContext } from '../../../../App'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getCards, getPosition, modifiedCards, withTimeAdded } from '../../../../utils/misc'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import Arrows from './modalsComponents/arrows/Arrows'
import { CARDS } from '../../../../data/cards'
import { updateGameData } from '../../../../api/activeGame'

const ModalBusinessContacts = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { stateGame, dispatchGame, performSubActions, logItems, ANIMATION_SPEED } =
      useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, user } = useContext(UserContext)
   const { initCorpsIds } = useContext(CorpsContext)
   const { sound } = useContext(SoundContext)
   const [selectedCardIds, setSelectedCardIds] = useState([])
   const [page, setPage] = useState(1)
   const cardsSeen = getCards(CARDS, modals.modalBusCont.cards)

   const btnActionPosition = { bottom: '0', left: '50%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   // Add cards to the cardsSeen
   useEffect(() => {
      // Update active game on server only if user is logged
      if (!user) return

      const cardsSeenIds = statePlayer.cardsSeen.map((c) => c.id)
      if (!cardsSeenIds.includes(cardsSeen[0].id)) {
         const newCards = [...statePlayer.cardsSeen, ...cardsSeen]
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: newCards })
         // Update Server Data
         const updatedData = {
            statePlayer: { ...statePlayer, cardsSeen: newCards },
            stateGame,
            stateModals: modals,
            stateBoard,
            corps: initCorpsIds,
            logItems,
         }
         updateGameData(user.token, updatedData, type)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const onYesFunc = () => {
      // Turn business contacts phase off
      setModals((prev) => ({ ...prev, businessContacts: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_BUSINESS_CONTACTS, payload: false })
      // Draw card(s)
      startAnimation(setModals)
      setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, modals.modalBusCont.selectCount, setModals)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: [
               ...statePlayer.cardsInHand,
               ...modifiedCards(withTimeAdded(getCards(CARDS, selectedCardIds)), statePlayer),
            ],
         })
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
               {modifiedCards(cardsSeen, statePlayer).map((card, idx) => (
                  <div
                     key={idx}
                     className={`card-container small ${
                        selectedCardIds.includes(card.id) && 'selected'
                     }`}
                     style={getPosition(modals.modalBusCont.cards.length, idx)}
                     onClick={() => {
                        sound.btnCardsClick.play()
                        setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
                     }}
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
            <ModalHeader text="SELECT CARD" />
            {/* ACTION BUTTON */}
            <BtnAction
               text="DONE"
               onYesFunc={onYesFunc}
               disabled={selectedCardIds.length !== modals.modalBusCont.selectCount}
               position={btnActionPosition}
            />
         </div>
      </>
   )
}

export default ModalBusinessContacts
