import { useContext } from 'react'
import { SoundContext } from '../../../../../../../../App'
import { ACTION_ICONS, getActionIcon } from '../../../../../../../../data/cardActions/actionIcons'
import { CARDS } from '../../../../../../../../data/cards'
import { CORP_NAMES } from '../../../../../../../../data/corpNames'
import { getEffectIcon } from '../../../../../../../../data/effects/effectIcons'
import { getCorporationById, getShorterName } from '../../../../../../../../utils/corporation'
import { getCards } from '../../../../../../../../utils/cards'
import { useLocation } from 'react-router-dom'
import { ModalsContext as ModalsContextGame, StateGameContext } from '../../../../../..'
import { ModalsContext as ModalsContextStats } from '../../../../../../../mainMenu/pages/stats'

const LogItemStateActionsEffects = ({ state, type }) => {
   const location = useLocation()
   const ModalsContextGameObj = useContext(ModalsContextGame)
   const ModalsContextStatsObj = useContext(ModalsContextStats)
   const { stateGame } = useContext(StateGameContext)
   const { sound } = useContext(SoundContext)
   const corporationObj = state.statePlayer.corporation ? getCorporationById(state.statePlayer.corporation) : null
   const isUnmi = corporationObj.name === CORP_NAMES.UNMI

   const getActions = () => {
      let actions = []
      if (isUnmi) actions.push([0, getShorterName(CORP_NAMES.UNMI), getActionIcon(ACTION_ICONS.ACTION_UNMI)])
      const cardsPlayedIds = state.statePlayer.cardsPlayed.map(c => c.id)
      const cards = CARDS.filter((c) => c.iconNames.action !== null && cardsPlayedIds.includes(c.id))
      if (cards.length > 0) {
         cards.forEach((card) => {
            actions.push([card.id, getShorterName(card.name), getActionIcon(card.iconNames.action)])
         })
      }
      return actions
   }

   const getEffects = () => {
      let effects = []
      if (!isUnmi) effects.push([0, getShorterName(corporationObj.name), getEffectIcon(corporationObj.effects[0])])
      const cardsPlayedIds = state.statePlayer.cardsPlayed.map(c => c.id)
      const cards = CARDS.filter((c) => c.effect !== null && cardsPlayedIds.includes(c.id))
      if (cards.length > 0) {
         cards.forEach((card) => {
            effects.push([card.id, getShorterName(card.name), getEffectIcon(card.effect)])
         })
      }

      return effects
   }
   const elements = type === 'ACTIONS' ? getActions() : getEffects()

   const handleClickCard = (cardId) => {
      if (stateGame.replayActionId) return
      sound.btnCardsClick.play()
      if (cardId) {
         // If clicked on card
         if (location.pathname === '/match') {
            ModalsContextGameObj.setModals((prev) => ({ ...prev, modalCard: getCards(cardId), cardViewOnly: true }))
         } else {
            ModalsContextStatsObj.setModalCard(getCards(cardId))
            ModalsContextStatsObj.setShowModalCard(true)
         }
      } else {
         // If clicked on corporation
         if (location.pathname === '/match') {
            ModalsContextGameObj.setModals((prev) => ({ ...prev, corp: true }))
         } else {
            ModalsContextStatsObj.setModalCorpId(corporationObj.id)
            ModalsContextStatsObj.setShowModalCorp(true)
         }
      }
   }

   return (
      <div className="state-other-container">
         <div className="state-other-container-title">
            {type}
            {' ('}
            {elements.length}
            {')'}
         </div>
         <ul className="state-other-container-elements">
            {elements.length > 0 ? (
               elements.map((el, idx) => (
                  <li key={idx} className="clickable pointer" onClick={() => handleClickCard(el[0])}>
                     <img src={el[2]} alt=""></img> {el[1]}
                  </li>
               ))
            ) : (
               <li style={{ color: '#777' }}>NO {type}</li>
            )}
         </ul>
      </div>
   )
}

export default LogItemStateActionsEffects
