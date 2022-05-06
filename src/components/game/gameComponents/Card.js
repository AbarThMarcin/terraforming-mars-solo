import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../Game'

const Card = ({ card }) => {
   const { modals } = useContext(ModalsContext)
   const { requirementsMet } = useContext(StateGameContext)
   const available =
      modals.modalCardsType === 'Cards Played' || modals.other ? true : requirementsMet(card)

   return (
      <>
         <div
            className={`card full-size ${
               !modals.cardViewOnly && !modals.cardWithAction && 'pointer'
            }`}
         >
            <div>{card.currentCost}</div>
            {card.originalCost !== card.currentCost && <div>{card.originalCost}</div>}
            <div>{card.name}</div>
            <div>{card.description}</div>
         </div>
         {!available &&
            !modals.draft &&
            !modals.cardWithAction &&
            !modals.cardViewOnly &&
            !modals.sellCards && <div className="card-disabled full-size pointer"></div>}
      </>
   )
}

export default Card
