import { useContext } from 'react'
import { SoundContext } from '../../../../App'
import { StatePlayerContext, ModalsContext } from '../../Game'

const BtnCardsPlayed = () => {
   const { setModals } = useContext(ModalsContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { sound } = useContext(SoundContext)

   const handleClickBtnCardsPlayed = () => {
      sound.btnCardsClick.play()
      setModals((prev) => ({
         ...prev,
         modalCards: statePlayer.cardsPlayed,
         modalCardsType: 'Cards Played',
         cards: true,
      }))
   }

   return (
      <div className="btn-cards-played-log pointer" onClick={handleClickBtnCardsPlayed}>
         CARDS PLAYED
      </div>
   )
}

export default BtnCardsPlayed
