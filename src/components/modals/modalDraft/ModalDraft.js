import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, CardsContext, ModalsContext } from '../../../Game'
import { ACTIONS_GAME } from '../../../util/dispatchGame'
import { ACTIONS_PLAYER } from '../../../util/dispatchPlayer'
import ModalDraftChangeCorpBtn from './ModalDraftChangeCorpBtn'
import ModalDraftHeader from './ModalDraftHeader'
import ModalDraftDoneBtn from './ModalDraftDoneBtn'
import Card from '../../card/Card'
import CardBtn from '../../card/CardBtn'
import { getPosition } from '../../../util/misc'

const ModalDraft = () => {
   const { stateGame, dispatchGame } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { cards, setCards } = useContext(CardsContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [buyCost, setBuyCost] = useState(0)
   const [selectedCards, setSelectedCards] = useState([])
   const cardsDraft = stateGame.generation === 1 ? cards.slice(0, 10) : cards.slice(0, 4)
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
      setCards(stateGame.generation === 1 ? cards.slice(10) : cards.slice(4))
      // Set phase draft = FALSE
      dispatchGame({ type: ACTIONS_GAME.SET_DRAFT_PHASE, payload: false })
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
      <div className={`modal-draft center ${modals.cards && 'hidden'}`}>
         {/* HEADER */}
         <ModalDraftHeader
            text={stateGame.generation === 1 ? 'BUY UP TO 10 CARDS' : 'BUY UP TO 4 CARDS'}
         />

         {/* CHANGE CORPORATION BUTTON */}
         {stateGame.generation === 1 && (
            <ModalDraftChangeCorpBtn dispatchGame={dispatchGame} dispatchPlayer={dispatchPlayer} />
         )}

         {/* DONE BUTTON */}
         <ModalDraftDoneBtn
            buyCost={buyCost}
            textDoneConfirmation={textDoneConfirmation}
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
      </div>
   )
}

export default ModalDraft
