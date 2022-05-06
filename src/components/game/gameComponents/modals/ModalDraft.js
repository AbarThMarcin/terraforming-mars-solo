/* Used to show window with cards to buy in the draft phase,
window with cards to sell and window with cards to select due
to any effect/action */

import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, CardsContext, ModalsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import ModalDraftBtnChangeCorp from './modalsComponents/ModalDraftBtnChangeCorp'
import ModalBtnAction from './modalsComponents/ModalBtnAction'
import Card from '../Card'
import CardBtn from './modalsComponents/CardBtn'
import { getPosition, modifiedCards } from '../../../../util/misc'

const ModalDraft = () => {
   const { stateGame, dispatchGame } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { cards, setCards } = useContext(CardsContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [buyCost, setBuyCost] = useState(0)
   const [selectedCards, setSelectedCards] = useState([])
   const cardsDraft = stateGame.generation === 1 ? modifiedCards(cards.slice(0, 10), statePlayer) : modifiedCards(cards.slice(0, 4), statePlayer)
   const textDoneConfirmation =
      stateGame.generation === 1
         ? 'Are you sure you want to choose this corporation and these project cards?'
         : buyCost === 0
         ? "Are you sure you don't want to buy any cards?"
         : 'Are you sure you want to buy these project cards?'

   const onYesFunc = () => {
      // Decrease corporation mln resources
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -buyCost })
      // Add selected cards to the hand
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: [...statePlayer.cardsInHand, ...selectedCards],
      })
      // Remove all 4 (10 if gen = 1) cards from the CardsContext
      setTimeout(() => {
         setCards(stateGame.generation === 1 ? cards.slice(10) : cards.slice(4))
      }, 1000)
      // Set phase draft = FALSE
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Dismount draft modal
      setModals({ ...modals, confirmation: false, draft: false })
   }

   const handleClickCardBtn = (card) => {
      if (!selectedCards.includes(card)) {
         setBuyCost((v) => v + 3)
         setSelectedCards((cards) => [...cards, card])
      } else {
         setBuyCost((v) => v - 3)
         setSelectedCards((cards) => cards.filter((c) => c.id !== card.id))
      }
   }

   return (
      <>
         {/* HEADER */}
         <ModalHeader
            text={stateGame.generation === 1 ? 'BUY UP TO 10 CARDS' : 'BUY UP TO 4 CARDS'}
            eachText="3 each"
         />

         {/* CHANGE CORPORATION BUTTON */}
         {stateGame.generation === 1 && (
            <ModalDraftBtnChangeCorp dispatchGame={dispatchGame} dispatchPlayer={dispatchPlayer} />
         )}

         {/* ACTION BUTTON */}
         <ModalBtnAction
            text="DONE"
            mln={buyCost}
            textConfirmation={textDoneConfirmation}
            onYesFunc={onYesFunc}
         />

         {/* CARDS */}
         {cardsDraft.map((card, idx) => (
            <div
               key={idx}
               className={`card-container ${selectedCards.includes(card) && 'selected'}`}
               style={getPosition(cardsDraft.length, idx)}
               onClick={() => setModals({ ...modals, modalCard: card, cardViewOnly: true })}
            >
               <Card card={card} />
               <CardBtn btnText="SELECT" handleClick={() => handleClickCardBtn(card)} />
            </div>
         ))}
      </>
   )
}

export default ModalDraft
