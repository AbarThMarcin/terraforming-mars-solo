import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../../Game'

const BtnCardsPlayed = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer } = useContext(StatePlayerContext)

   const handleClickBtnCardsPlayed = () => {
      setModals({ ...modals, modalCards: statePlayer.cardsPlayed, modalCardsType: 'Cards Played', cards: true })
   }

   return (
      <div className="btn-cards-played-log pointer" onClick={handleClickBtnCardsPlayed}>
         CARDS PLAYED
      </div>
   )
}

export default BtnCardsPlayed
