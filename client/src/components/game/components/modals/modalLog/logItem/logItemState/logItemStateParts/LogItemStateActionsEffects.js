import { useContext } from 'react'
import { SoundContext } from '../../../../../../../../App'
import { ACTION_ICONS, getActionIcon } from '../../../../../../../../data/cardActions/actionIcons'
import { CARDS } from '../../../../../../../../data/cards'
import { CORP_NAMES } from '../../../../../../../../data/corpNames'
import { getEffectIcon } from '../../../../../../../../data/effects/effectIcons'
import { getCorporationByName, getCorpShortName } from '../../../../../../../../utils/corporation'
import { getCards } from '../../../../../../../../utils/cards'
import { useLocation } from 'react-router-dom'
import { ModalsContext as ModalsContextGame } from '../../../../../..'
import { ModalsContext as ModalsContextStats } from '../../../../../../../mainMenu/pages/stats'

const LogItemStateActionsEffects = ({ state, type }) => {
   const location = useLocation()
   const ModalsContextGameObj = useContext(ModalsContextGame)
   const ModalsContextStatsObj = useContext(ModalsContextStats)
   const { sound } = useContext(SoundContext)
   const isUnmi = state.statePlayer.corporation.name === CORP_NAMES.UNMI
   const getActions = () => {
      let actions = []
      if (isUnmi) actions.push([0, getCorpShortName(CORP_NAMES.UNMI), getActionIcon(ACTION_ICONS.ACTION_UNMI)])
      const cards = state.statePlayer.cardsPlayed.filter((card) =>
         CARDS.filter((c) => c.iconNames.action !== null)
            .map((c) => c.id)
            .includes(card.id)
      )
      if (cards.length > 0) {
         cards.forEach((card) => {
            actions.push([card.id, getCorpShortName(card.name), getActionIcon(card.iconNames.action)])
         })
      }
      return actions
   }
   const getEffects = () => {
      let effects = []
      if (!isUnmi) effects.push([0, getCorpShortName(state.statePlayer.corporation.name), getEffectIcon(state.statePlayer.corporation.effects[0])])
      const cards = state.statePlayer.cardsPlayed.filter((card) =>
         CARDS.filter((c) => c.effect !== null)
            .map((c) => c.id)
            .includes(card.id)
      )
      if (cards.length > 0) {
         cards.forEach((card) => {
            effects.push([card.id, getCorpShortName(card.name), getEffectIcon(card.effect)])
         })
      }

      return effects
   }
   const elements = type === 'ACTIONS' ? getActions() : getEffects()

   const handleClickCard = (cardId) => {
      sound.btnCardsClick.play()
      if (cardId) {
         // If card
         if (location.pathname === '/match') {
            ModalsContextGameObj.setModals((prev) => ({ ...prev, modalCard: getCards([cardId])[0], cardViewOnly: true }))
         } else {
            ModalsContextStatsObj.setModalCard(getCards([cardId])[0])
            ModalsContextStatsObj.setShowModalCard(true)
         }
      } else {
         // If corporation
         if (location.pathname === '/match') {
            ModalsContextGameObj.setModals((prev) => ({ ...prev, corp: true }))
         } else {
            ModalsContextStatsObj.setModalCorpId(getCorporationByName(state.statePlayer.corporation.name).id)
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
                  <li key={idx} className="pointer" onClick={() => handleClickCard(el[0])}>
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
