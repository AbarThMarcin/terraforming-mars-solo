import { useContext } from 'react'
import { ActionsContext, ModalsContext, StateGameContext, StatePlayerContext, UserContext } from '../components/game'
import { funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { getCards, getCardsWithDecreasedCost, getCardsWithTimeAdded } from '../utils/cards'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { RESOURCES } from '../data/resources'
import { SoundContext } from '../App'
import { MATCH_TYPES } from '../data/app'
import { replayData } from '../data/replay'
import { getParameterValueFromLogObject } from '../utils/misc'

export const useSubactionBusinessContacts = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions, ANIMATION_SPEED, setLogItems, dataForReplay, currentLogItem } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const { actions, setActions } = useContext(ActionsContext)
   const { type } = useContext(UserContext)
   const selectCount = type === MATCH_TYPES.REPLAY ? replayData.modalBusCont.selectCount : modals.modalBusCont.selectCount

   const handleClickBtnSelect = (cardId) => {
      sound.btnSelectClick.play()
      if (!actions.ids.includes(cardId)) {
         setActions((prev) => ({ ...prev, ids: [...actions.ids, cardId] }))
      } else {
         setActions((prev) => ({ ...prev, ids: actions.ids.filter((id) => id !== cardId) }))
      }
   }

   const onYesFunc = async (furtherActions) => {
      sound.btnGeneralClick.play()
      // Save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `ids: ${actions.ids.join(', ')}`)

      const actionsLeft = furtherActions ? furtherActions : stateGame.actionsLeft

      // Turn business contacts phase off
      setModals((prev) => ({ ...prev, businessContacts: false }))
      // Draw card(s)
      startAnimation(setModals)
      setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, selectCount, setModals)
      setTimeout(() => {
         if (type === MATCH_TYPES.REPLAY) {
            const ids = getParameterValueFromLogObject(dataForReplay, currentLogItem, 'ids')
            dispatchPlayer({
               type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND,
               payload: getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(ids)), statePlayer),
            })
            if (selectCount === 1) {
               funcSetLogItemsSingleActions(`Drew 1 card (${getCards(ids)[0].name})`, RESOURCES.CARD, 1, setLogItems)
            } else {
               const newCardsDrawNames = getCards(ids).map((c) => c.name)
               funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
            }
         } else {
            dispatchPlayer({
               type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
               payload: [...statePlayer.cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(actions.ids)), statePlayer)],
            })
            if (selectCount === 1) {
               funcSetLogItemsSingleActions(`Drew 1 card (${getCards(actions.ids)[0].name})`, RESOURCES.CARD, 1, setLogItems)
            } else {
               const newCardsDrawNames = getCards(actions.ids).map((c) => c.name)
               funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
            }
         }

         endAnimation(setModals)
         // Continue remaining actions
         startAnimation(setModals)
         performSubActions(actionsLeft)
      }, ANIMATION_SPEED)
   }

   return { onYesFunc, handleClickBtnSelect }
}
