import { useContext } from 'react'
import { StatePlayerContext, StateGameContext } from '../../../Game'
import OtherBtn from './OtherBtn'

const OtherPanel = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { getCardActions } = useContext(StateGameContext)
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
      if (cards.length > 0) count += cards.reduce((total, card) => total + card.tags.length, 0)
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
      const count = statePlayer.corporation.name === 'UNMI' ? cards.length + 1 : cards.length
      return [count, cards]
   }

   function getEffects() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.effect !== null)
      const count = cards.length + statePlayer.corporation.effects.length
      return [count, [...statePlayer.corporation.effects.slice(0, 1), ...cards]]
   }

   return (
      <div className="other">
         <OtherBtn
            headerForModal="CARD RESOURCES"
            amountForModal={countCardRes}
            dataForModal={cardsCardRes}
            icon={null}
         />
         <OtherBtn
            headerForModal="TAGS"
            amountForModal={countTags}
            dataForModal={cardsTags}
            icon={null}
         />
         <OtherBtn
            headerForModal="VP"
            amountForModal={countVp}
            dataForModal={cardsVp}
            icon={null}
         />
         <OtherBtn
            headerForModal="ACTIONS"
            amountForModal={countActions}
            dataForModal={cardsActions}
            icon={null}
         />
         <OtherBtn
            headerForModal="EFFECTS"
            amountForModal={countEffects}
            dataForModal={cardsEffects}
            icon={null}
         />
      </div>
   )
}

export default OtherPanel
