import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'

const Card = ({ card }) => {
   const { modals } = useContext(ModalsContext)
   const { checkRequirements } = useContext(StateGameContext)
   const available = modals.modalCardsType === 'Cards Played' ? true : checkRequirements(card)

   return (
      <>
         <div
            className={`card full-size ${
               !modals.cardViewOnly && !modals.cardWithAction && 'pointer'
            }`}
         >
            <div>{card.currentCost}</div>
            <div>{card.name}</div>
            <div>{card.description}</div>
         </div>
         {!available && !modals.draft && !modals.cardWithAction && !modals.cardViewOnly && (
            <div className="card-disabled"></div>
         )}
      </>
   )
}

export default Card
