import { useContext } from 'react'
import { SoundContext } from '../../../../../../../../App'
import { ModalsContext as ModalsContextGame } from '../../../../../..'
import { ModalsContext as ModalsContextStats } from '../../../../../../../mainMenu/pages/stats'
import { useLocation } from 'react-router-dom'
import { getCards } from '../../../../../../../../utils/cards'

const LogItemStateCards = ({ state, cardsType }) => {
   const location = useLocation()
   const ModalsContextGameObj = useContext(ModalsContextGame)
   const ModalsContextStatsObj = useContext(ModalsContextStats)
   const { sound } = useContext(SoundContext)

   const handleClickCard = (cardId) => {
      if (cardId) {
         const card = getCards(cardId)
         sound.btnCardsClick.play()
         if (location.pathname === '/match') {
            ModalsContextGameObj.setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
         } else {
            ModalsContextStatsObj.setModalCard(card)
            ModalsContextStatsObj.setShowModalCard(true)
         }
      }
   }

   return (
      <div className="state-other-container">
         <div className="state-other-container-title">
            {cardsType}
            {' ('}
            {cardsType === 'CARDS IN HAND' ? state.statePlayer.cardsInHand.length : state.statePlayer.cardsPlayed.length}
            {')'}
         </div>
         <ul className="state-other-container-elements">
            {cardsType === 'CARDS IN HAND' ? (
               state.statePlayer.cardsInHand.length > 0 ? (
                  state.statePlayer.cardsInHand.map((cardId, idx) => (
                     <li key={idx} className="clickable pointer" onClick={() => handleClickCard(cardId)}>
                        - {getCards(cardId).name} ({cardId})
                     </li>
                  ))
               ) : (
                  <li style={{ color: '#777' }}>NO CARDS IN HAND</li>
               )
            ) : state.statePlayer.cardsPlayed.length > 0 ? (
               state.statePlayer.cardsPlayed.map((card, idx) => (
                  <li key={idx} className="clickable pointer" onClick={() => handleClickCard(card.id)}>
                     - {getCards(card.id).name} ({card.id})
                  </li>
               ))
            ) : (
               <li style={{ color: '#777' }}>NO CARDS PLAYED</li>
            )}
         </ul>
      </div>
   )
}

export default LogItemStateCards
