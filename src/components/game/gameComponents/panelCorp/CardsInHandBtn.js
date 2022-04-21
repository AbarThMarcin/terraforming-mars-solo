import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../Game'

const CardsInHandBtn = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickBtnCardsInHand = () => {
      if (statePlayer.cardsInHand.length > 0) {
         setModals({
            ...modals,
            modalCards: statePlayer.cardsInHand,
            modalCardsType: 'Cards In Hand',
            cards: true,
         })
      }
   }

   return (
      <div
         className={`cards-in-hand-btn ${statePlayer.cardsInHand.length > 0 ? 'pointer' : ''}`}
         onClick={handleClickBtnCardsInHand}
      >
         {statePlayer.cardsInHand.length}
      </div>
   )
}

export default CardsInHandBtn
