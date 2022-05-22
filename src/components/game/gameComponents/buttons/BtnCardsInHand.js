import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../Game'
import AnimCard from '../animations/AnimCard'

const BtnCardsInHand = () => {
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
         className={`btn-cards-in-hand ${statePlayer.cardsInHand.length > 0 ? 'pointer' : ''}`}
         onClick={handleClickBtnCardsInHand}
      >
         {modals.animation && (
            <>
               {modals.animationData.cardIn.type !== null && <AnimCard type="card-in" />}
               {modals.animationData.cardOut.type !== null && <AnimCard type="card-out" />}
            </>
         )}
         <div className="full-size" style={{ backgroundColor: 'red' }}>
            {statePlayer.cardsInHand.length}
         </div>
      </div>
   )
}

export default BtnCardsInHand