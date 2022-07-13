import { useContext } from 'react'
import { TAGS } from '../../../../../data/tags'
import { getActionCost, getActionIdsWithCost, hasTag } from '../../../../../utils/misc'
import { StatePlayerContext, StateGameContext } from '../../../Game'
import OtherSnap from './OtherSnap'
import iconCardRes from '../../../../../assets/images/resources/any.svg'
import iconTags from '../../../../../assets/images/tags/any.svg'
import iconVP from '../../../../../assets/images/vp/any.svg'
import iconActions from '../../../../../assets/images/actions/any.svg'
import iconEffects from '../../../../../assets/images/effects/any.svg'
import { CORP_NAMES } from '../../../../../data/corpNames'

const OtherPanel = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { actionRequirementsMet, getCardActions } = useContext(StateGameContext)
   const [countCardRes, cardsCardRes] = getCardRes()
   const [countTags, cardsTags] = getTags()
   const [countVp, cardsVp] = getVp()
   const [countActions, cardsActions] = getActions()
   const [countEffects, cardsEffects] = getEffects()

   function getCardRes() {
      const cards = statePlayer.cardsPlayed.filter(
         (card) =>
            card.units.microbe !== 0 ||
            card.units.animal !== 0 ||
            card.units.science !== 0 ||
            card.units.fighter !== 0
      )
      const count =
         cards.length > 0
            ? cards.reduce(
                 (total, card) =>
                    total +
                    card.units.microbe +
                    card.units.animal +
                    card.units.science +
                    card.units.fighter,
                 0
              )
            : 0
      return [count, cards]
   }

   function getTags() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.tags.length > 0)
      let count = statePlayer.corporation.tags.length
      if (cards.length > 0)
         count += cards.reduce(
            (total, card) => (hasTag(card, TAGS.EVENT) ? total + 1 : total + card.tags.length),
            0
         )
      return [count, [...cards, ...statePlayer.corporation.tags]]
   }

   function getVp() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.vp !== 0)
      const count = cards.length > 0 ? cards.reduce((total, card) => total + card.vp, 0) : 0
      return [count, cards]
   }

   function getActions() {
      const cards = statePlayer.cardsPlayed.filter(
         (card) => getCardActions(card.id, [0, 0, 0, 0]).length > 0
      )
      let count = cards.filter((card) => {
         let reqsMet = false
         let enoughToBuy = true
         if (actionRequirementsMet(card)) reqsMet = true
         if (getActionIdsWithCost().includes(card.id)) {
            const cost = getActionCost(card.id)
            let resources = statePlayer.resources.mln
            if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
            if (card.id === 187) resources += statePlayer.resources.steel * statePlayer.valueSteel
            if (card.id === 12) resources += statePlayer.resources.titan * statePlayer.valueTitan
            enoughToBuy = resources >= cost
         }
         return reqsMet && enoughToBuy
      }).length
      if (statePlayer.corporation.name === CORP_NAMES.UNMI) {
         count = actionRequirementsMet(statePlayer.corporation) ? count + 1 : count
      }
      return [count, cards]
   }

   function getEffects() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.effect !== null)
      const count = cards.length + statePlayer.corporation.effects.slice(0, 1).length
      return [count, [...statePlayer.corporation.effects.slice(0, 1), ...cards]]
   }

   return (
      <div className="other">
         <OtherSnap
            headerForModal="CARD RESOURCES"
            amountForModal={countCardRes}
            dataForModal={cardsCardRes}
            icon={iconCardRes}
         />
         <OtherSnap
            headerForModal="TAGS"
            amountForModal={countTags}
            dataForModal={cardsTags}
            icon={iconTags}
         />
         <OtherSnap
            headerForModal="VP"
            amountForModal={countVp}
            dataForModal={cardsVp}
            icon={iconVP}
         />
         <OtherSnap
            headerForModal="ACTIONS"
            amountForModal={countActions}
            dataForModal={cardsActions}
            icon={iconActions}
         />
         <OtherSnap
            headerForModal="EFFECTS"
            amountForModal={countEffects}
            dataForModal={cardsEffects}
            icon={iconEffects}
         />
      </div>
   )
}

export default OtherPanel
