import { useContext } from 'react'
import { SettingsContext, SoundContext } from '../../../../App'
import { StatePlayerContext, ModalsContext, StateGameContext } from '../../../game'
import { getCardsSorted } from '../../../../utils/cards'

const BtnCardsPlayed = () => {
   const { setModals } = useContext(ModalsContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { requirementsMet } = useContext(StateGameContext)
   const { settings } = useContext(SettingsContext)
   const { sound } = useContext(SoundContext)

   const handleClickBtnCardsPlayed = () => {
      sound.btnCardsClick.play()
      setModals((prev) => ({
         ...prev,

         // This allows sorting right before showing cards after clicking CardsPlayed btn.
         // To disable that, comment it out and uncomment line one lower.
         modalCards: getCardsSorted(statePlayer.cardsPlayed, settings.sortId[1], requirementsMet),
         // modalCards: statePlayer.cardsPlayed,

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
