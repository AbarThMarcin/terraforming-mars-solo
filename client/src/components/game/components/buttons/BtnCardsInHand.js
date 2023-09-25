import { useContext } from 'react'
import { StatePlayerContext, ModalsContext, StateGameContext } from '../../../game'
import { SettingsContext, SoundContext } from '../../../../App'
import AnimCard from '../animations/AnimCard'
import iconCardsInHandBtn from '../../../../assets/images/panelCorp/cardsInHandBtn.png'
import { sorted } from '../../../../utils/misc'

const BtnCardsInHand = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { requirementsMet } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { settings } = useContext(SettingsContext)
   const { sound } = useContext(SoundContext)

   const handleClickBtnCardsInHand = () => {
      if (statePlayer.cardsInHand.length > 0) {
         sound.btnCardsClick.play()
         setModals((prev) => ({
            ...prev,

            // This allows sorting right before showing cards after clicking CardsInHand btn.
            // To disable that, comment it out and uncomment line one lower.
            modalCards: sorted(statePlayer.cardsInHand, settings.sortId[0], requirementsMet),
            // modalCards: statePlayer.cardsInHand,

            modalCardsType: 'Cards In Hand',
            cards: true,
         }))
      }
   }

   return (
      <div
         className={`btn-cards-in-hand ${statePlayer.cardsInHand.length > 0 ? 'pointer' : 'empty'}`}
         onClick={handleClickBtnCardsInHand}
      >
         {/* Animation Cards */}
         {modals.animation && (
            <>
               {modals.animationData.cardIn.type !== null && <AnimCard type="card-in" />}
               {modals.animationData.cardOut.type !== null && <AnimCard type="card-out" />}
            </>
         )}
         {/* Background */}
         <img src={iconCardsInHandBtn} alt="icon_cardsInHandBtn" />
         {/* Cards Amount */}
         <span>{statePlayer.cardsInHand.length}</span>
      </div>
   )
}

export default BtnCardsInHand
