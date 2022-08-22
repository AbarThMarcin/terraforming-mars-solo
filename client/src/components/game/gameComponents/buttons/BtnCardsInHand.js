import { useContext, useState } from 'react'
import { StatePlayerContext, ModalsContext } from '../../Game'
import { SoundContext } from '../../../../App'
import AnimCard from '../animations/AnimCard'
import iconCardsInHandBtn from '../../../../assets/images/panelCorp/cardsInHandBtn.png'
import iconCardsInHandBtnBright from '../../../../assets/images/panelCorp/cardsInHandBtnBright.png'

const BtnCardsInHand = () => {
   const [hovered, setHovered] = useState(false)
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleClickBtnCardsInHand = () => {
      if (statePlayer.cardsInHand.length > 0) {
         sound.btnCardsClick.play()
         setModals((prev) => ({
            ...prev,
            modalCards: statePlayer.cardsInHand,
            modalCardsType: 'Cards In Hand',
            cards: true,
         }))
      }
   }

   return (
      <div
         className={`btn-cards-in-hand ${statePlayer.cardsInHand.length > 0 ? 'pointer' : ''}`}
         onClick={handleClickBtnCardsInHand}
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
      >
         {/* Animation Cards */}
         {modals.animation && (
            <>
               {modals.animationData.cardIn.type !== null && <AnimCard type="card-in" />}
               {modals.animationData.cardOut.type !== null && <AnimCard type="card-out" />}
            </>
         )}
         {/* Background */}
         {hovered && statePlayer.cardsInHand.length ? (
            <img src={iconCardsInHandBtnBright} alt="icon_cardsInHandBtnBright" />
         ) : (
            <img src={iconCardsInHandBtn} alt="icon_cardsInHandBtn" />
         )}
         {/* Cards Amount */}
         <span>{statePlayer.cardsInHand.length}</span>
      </div>
   )
}

export default BtnCardsInHand
