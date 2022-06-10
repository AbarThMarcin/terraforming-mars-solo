import { useContext } from 'react'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import { sorted } from '../../../../util/misc'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'

const BtnSort = ({ id, text }) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { sortId, setSortId, requirementsMet } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)
   const cardsTypeId = modals.modalCardsType === 'Cards In Hand' ? 0 : 1

   const handleClickSortBtn = (e) => {
      e.stopPropagation()
      let newSortId =
         sortId[cardsTypeId].slice(0, 1) !== id
            ? `${id}a`
            : sortId[cardsTypeId].slice(1, 2) === 'a'
            ? `${id}b`
            : `${id}a`
      setSortId((oldIds) => (cardsTypeId === 0 ? [newSortId, oldIds[1]] : [oldIds[0], newSortId]))
      cardsTypeId === 0
         ? dispatchPlayer({
              type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
              payload: sorted(statePlayer.cardsInHand, newSortId, requirementsMet),
           })
         : dispatchPlayer({
              type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
              payload: sorted(statePlayer.cardsPlayed, newSortId, requirementsMet),
           })
   }

   return (
      <div
         className={`btn-sort pointer ${
            id === sortId[cardsTypeId].slice(0, 1) ? 'selected' : 'not-selected'
         }`}
         onClick={handleClickSortBtn}
      >
         {text}
      </div>
   )
}

export default BtnSort
