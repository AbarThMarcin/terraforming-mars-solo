import { ACTION_ICONS, getActionIcon } from '../../../../../../../../data/cardActions/actionIcons'
import { CARDS } from '../../../../../../../../data/cards'
import { CORP_NAMES } from '../../../../../../../../data/corpNames'
import { getEffectIcon } from '../../../../../../../../data/effects/effectIcons'
import { getShortName } from '../../../../../../../../utils/misc'

const LogItemStateActionsEffects = ({ state, type }) => {
   const isUnmi = state.statePlayer.corporation.name === CORP_NAMES.UNMI
   const getActions = () => {
      let actions = []
      if (isUnmi) actions.push([getShortName(CORP_NAMES.UNMI), getActionIcon(ACTION_ICONS.ACTION_UNMI)])
      const cards = state.statePlayer.cardsPlayed.filter((card) =>
         CARDS.filter((c) => c.iconNames.action !== null)
            .map((c) => c.id)
            .includes(card.id)
      )
      if (cards.length > 0) {
         cards.forEach((card) => {
            actions.push([getShortName(card.name), getActionIcon(card.iconNames.action)])
         })
      }

      return actions
   }
   const getEffects = () => {
      let effects = []
      if (!isUnmi) effects.push([getShortName(state.statePlayer.corporation.name), getEffectIcon(state.statePlayer.corporation.effects[0])])
      const cards = state.statePlayer.cardsPlayed.filter((card) =>
         CARDS.filter((c) => c.effect !== null)
            .map((c) => c.id)
            .includes(card.id)
      )
      if (cards.length > 0) {
         cards.forEach((card) => {
            effects.push([getShortName(card.name), getEffectIcon(card.effect)])
         })
      }

      return effects
   }
   const elements = type === 'ACTIONS' ? getActions() : getEffects()

   return (
      <div className="state-other-container">
         <div className="state-other-container-title">{type}{' ('}{elements.length}{')'}</div>
         <ul className="state-other-container-elements">
            {elements.length > 0 ? (
               elements.map((el, idx) => (
                  <li key={idx}>
                     <img src={el[1]} alt=''></img> {el[0]}
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
