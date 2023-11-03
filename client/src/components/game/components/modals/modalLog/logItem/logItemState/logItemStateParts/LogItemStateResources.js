import { useContext } from 'react'
import { SoundContext } from '../../../../../../../../App'
import { RESOURCES, getResIcon } from '../../../../../../../../data/resources'
import { useLocation } from 'react-router-dom'
import { ModalsContext as ModalsContextGame } from '../../../../../..'
import { ModalsContext as ModalsContextStats } from '../../../../../../../mainMenu/pages/stats'
import { getCards } from '../../../../../../../../utils/cards'

const LogItemStateResources = ({ state }) => {
   const location = useLocation()
   const { sound } = useContext(SoundContext)
   const ModalsContextGameObj = useContext(ModalsContextGame)
   const ModalsContextStatsObj = useContext(ModalsContextStats)
   const elements = getResources()

   function getResources() {
      const cards = state.statePlayer.cardsPlayed.filter((card) => card.units.microbe !== 0 || card.units.animal !== 0 || card.units.science !== 0 || card.units.fighter !== 0)
      const resources = cards.map((card) => {
         let resource
         let count
         if (card.units.microbe !== 0) {
            resource = getResIcon(RESOURCES.MICROBE)
            count = card.units.microbe
         } else if (card.units.animal !== 0) {
            resource = getResIcon(RESOURCES.ANIMAL)
            count = card.units.animal
         } else if (card.units.science !== 0) {
            resource = getResIcon(RESOURCES.SCIENCE)
            count = card.units.science
         } else {
            resource = getResIcon(RESOURCES.FIGHTER)
            count = card.units.fighter
         }
         return [card.id, getCards(card.id).name, resource, count]
      })
      return resources
   }

   const handleClickCard = (cardId) => {
      sound.btnCardsClick.play()
      if (cardId) {
         // If card
         if (location.pathname === '/match') {
            ModalsContextGameObj.setModals((prev) => ({ ...prev, modalCard: getCards(cardId), cardViewOnly: true }))
         } else {
            ModalsContextStatsObj.setModalCard(getCards(cardId))
            ModalsContextStatsObj.setShowModalCard(true)
         }
      }
   }

   return (
      <div className="state-other-container">
         <div className="state-other-container-title">
            CARDS WITH RESOURCES{' ('}
            {elements.length}
            {')'}
         </div>
         <ul className="state-other-container-elements">
            {elements.length > 0 ? (
               elements.map((el, idx) => (
                  <li key={idx} className="clickable pointer" onClick={() => handleClickCard(el[0])}>
                     - {el[1]} ({el[3]} <img src={el[2]} alt=""></img>)
                  </li>
               ))
            ) : (
               <li style={{ color: '#777' }}>NO CARDS WITH RESOURCES</li>
            )}
         </ul>
      </div>
   )
}

export default LogItemStateResources
