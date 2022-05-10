import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../Game'

const Card = ({ card }) => {
   const { modals } = useContext(ModalsContext)
   const { requirementsMet } = useContext(StateGameContext)

   // If card is playable (all requirements met)
   const available = requirementsMet(card)

   // Card disabled (greyed out; new layer with half opacity is shwon) only when
   // requirements are not met, we are in the cards in hand modal 
   // (but a card is not clicked because then both modals:
   // cards and cardWithAction are shown [cards = display-none])
   // and we are not in draft phase
   const disabled =
      !available &&
      modals.cards &&
      modals.modalCardsType === 'Cards In Hand' &&
      !modals.cardWithAction && !modals.draft

   // Cursor is pointer when over card only when: card is small (draft, sellCard and
   // cardsPlayer/cardsInHand) AND when a card is not clicked because then
   // both modals: cards and cardWithAction are shown [cards = display-none]
   const pointer =
      (modals.draft || modals.sellCard || modals.cards) &&
      !modals.cardWithAction &&
      !modals.cardViewOnly

   return (
      <>
         <div className={`card full-size ${pointer && 'pointer'}`}>
            <div>{card.currentCost}</div>
            {card.originalCost !== card.currentCost && <div>{card.originalCost}</div>}
            <div>{card.name}</div>
            <div>{card.description}</div>
         </div>
         {disabled && <div className="card-disabled full-size pointer"></div>}
      </>
   )
}

export default Card
