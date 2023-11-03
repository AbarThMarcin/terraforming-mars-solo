import { useContext } from 'react'
import { TAGS } from '../../../../../data/tags'
import { hasTag } from '../../../../../utils/cards'
import { StateGameContext, StatePlayerContext } from '../../../../game'
import OtherSnap from './OtherSnap'
import iconCardRes from '../../../../../assets/images/resources/res_any.svg'
import iconTags from '../../../../../assets/images/tags/tag_any.svg'
import iconVP from '../../../../../assets/images/vp/vp_any.svg'
import iconActions from '../../../../../assets/images/actions/action_any.svg'
import iconEffects from '../../../../../assets/images/effects/effect_any.svg'
import { getActions } from '../../../../../utils/misc'

const OtherPanel = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { actionRequirementsMet } = useContext(StateGameContext)
   const [countCardRes, cardsCardRes] = getCardRes()
   const [countTags, cardsTags] = getTags()
   const [countVp, cardsVp] = getVp()
   const [countActions, cardsActions] = getActions(statePlayer, actionRequirementsMet)
   const [countEffects, cardsEffects] = getEffects()

   function getCardRes() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.units.microbe !== 0 || card.units.animal !== 0 || card.units.science !== 0 || card.units.fighter !== 0)
      const count = cards.length > 0 ? cards.reduce((total, card) => total + card.units.microbe + card.units.animal + card.units.science + card.units.fighter, 0) : 0
      return [count, cards]
   }

   function getTags() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.tags.length > 0)
      let count = statePlayer.corporation ? statePlayer.corporation.tags.length : 0
      if (cards.length > 0) count += cards.reduce((total, card) => (hasTag(card, TAGS.EVENT) ? total + 1 : total + card.tags.length), 0)
      return statePlayer.corporation ? [count, [...cards, ...statePlayer.corporation.tags]] : [count, []]
   }

   function getVp() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.vp !== 0)
      const count = cards.length > 0 ? cards.reduce((total, card) => total + card.vp, 0) : 0
      return [count, cards]
   }

   function getEffects() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.effect !== null)
      const count = statePlayer.corporation ? cards.length + statePlayer.corporation.effects.slice(0, 1).length : 0
      return statePlayer.corporation ? [count, [...statePlayer.corporation.effects.slice(0, 1), ...cards]] : [count, []]
   }

   return (
      <div className="other">
         <OtherSnap headerForModal="CARD RESOURCES" amountForModal={countCardRes} dataForModal={cardsCardRes} icon={iconCardRes} />
         <OtherSnap headerForModal="TAGS" amountForModal={countTags} dataForModal={cardsTags} icon={iconTags} />
         <OtherSnap headerForModal="VP" amountForModal={countVp} dataForModal={cardsVp} icon={iconVP} />
         <OtherSnap headerForModal="ACTIONS" amountForModal={countActions} dataForModal={cardsActions} icon={iconActions} />
         <OtherSnap headerForModal="EFFECTS" amountForModal={countEffects} dataForModal={cardsEffects} icon={iconEffects} />
      </div>
   )
}

export default OtherPanel
