/* Used to show window with cards to sell */

import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import ModalBtnAction from './modalsComponents/ModalBtnAction'
import Card from '../Card'
import CardBtn from './modalsComponents/CardBtn'
import { getPosition } from '../../../../util/misc'

const ModalSellCards = () => {
   const { stateGame } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [mlnBack, setMlnBack] = useState(0)
   const [selectedCards, setSelectedCards] = useState([])
   const textSellConfirmation = 'Are you sure you want to sell these project cards?'

   const onYesFunc = () => {
      // Remove selected cards from Cards in Hand
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: statePlayer.cardsInHand.filter((c) => !selectedCards.includes(c)),
      })
      // Add mlns to player's mln resource
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: mlnBack })
      // Dismount confirmation, sellCards and standardProjects modals
      setModals({ ...modals, confirmation: false, sellCards: false, standardProjects: false })
   }

   const handleClickCardBtn = (card) => {
      if (!selectedCards.includes(card)) {
         setMlnBack((v) => v + 1)
         setSelectedCards((cards) => [...cards, card])
      } else {
         setMlnBack((v) => v - 1)
         setSelectedCards((cards) => cards.filter((c) => c.id !== card.id))
      }
   }

   return (
      <div
         className={`
            modal-draft center
            ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}
         `}
      >
         {/* HEADER */}
         <ModalHeader text="SELL PATENT" eachText="1 each" />

         {/* ACTION BUTTON */}
         <ModalBtnAction
            text="SELL"
            mln={mlnBack}
            textConfirmation={textSellConfirmation}
            onYesFunc={onYesFunc}
         />

         {/* CANCEL BUTTON */}
         <ModalBtnAction text="CANCEL" />

         {/* CARDS */}
         {statePlayer.cardsInHand.map((card, idx) => (
            <div
               key={idx}
               className={`card-container ${selectedCards.includes(card) && 'selected'}`}
               style={getPosition(statePlayer.cardsInHand.length, idx)}
               onClick={() => setModals({ ...modals, modalCard: card, cardViewOnly: true })}
            >
               <Card card={card} />
               <CardBtn btnText="SELECT" handleClick={() => handleClickCardBtn(card)} />
            </div>
         ))}
      </div>
   )
}

export default ModalSellCards
