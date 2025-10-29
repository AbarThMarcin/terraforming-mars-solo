import { useContext } from "react"
import { ActionsContext, ModalsContext, StateGameContext, StatePlayerContext, UserContext } from "../components/game"
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from "../data/animations"
import { funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter, funcUpdateLogItemAction } from "../data/log"
import { getCards, getCardsWithDecreasedCost, getCardsWithTimeAdded, getNewCardsDrawIds } from "../utils/cards"
import { RESOURCES } from "../data/resources"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { SoundContext } from "../App"

export const useSubactionMarsUniversity = (furtherActions) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions, ANIMATION_SPEED, setLogItems, dataForReplay } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const { actions, setActions } = useContext(ActionsContext)

   const onYesFunc = async () => {
      sound.btnGeneralClick.play()

      const actionsLeft = furtherActions ? furtherActions : stateGame.actionsLeft

      // Turn mars university phase off
      setModals((prev) => ({ ...prev, marsUniversity: false }))
      // Get Random Cards Ids
      startAnimation(setModals)
      let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
      // Discard selected card
      setAnimation(ANIMATIONS.CARD_OUT, RESOURCES.CARD, 1, setModals)
      let newCardsInHand = JSON.parse(JSON.stringify(statePlayer.cardsInHand.filter((card) => card.id !== actions.ids[0])))
      setTimeout(() => {
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCardsInHand })
         funcSetLogItemsSingleActions(`Discarded 1 card (${getCards(actions.ids[0]).name}) from MARS UNIVERSITY effect`, RESOURCES.CARD, -1, setLogItems)
         endAnimation(setModals)
      }, ANIMATION_SPEED)
      // Draw a card
      setTimeout(() => {
         startAnimation(setModals)
         setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, 1, setModals)
      }, ANIMATION_SPEED)
      newCardsInHand = [...newCardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: newCardsInHand,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_SEEN,
            payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)],
         })
         funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from MARS UNIVERSITY effect`, RESOURCES.CARD, 1, setLogItems)
         let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
         newStatePlayer = {
            ...newStatePlayer,
            cardsInHand: newCardsInHand,
         }
         funcUpdateLastLogItemAfter(setLogItems, newStatePlayer, stateGame)
         endAnimation(setModals)
         // Continue remaining actions
         startAnimation(setModals)
         console.log('performSubActions with TRUE (noTrigger) from useSubactionMarsUniversity')
         performSubActions(actionsLeft, true)
         funcUpdateLogItemAction(setLogItems, `MUtargetIds: ${actions.ids[0]}`)
      }, ANIMATION_SPEED * 2)
   }

   const onCancelFunc = (furtherActions) => {
      sound.btnGeneralClick.play()

      const actionsLeft = furtherActions ? furtherActions : stateGame.actionsLeft

      // Turn mars university phase off
      setModals((prev) => ({ ...prev, marsUniversity: false }))
      // Continue remaining actions
      startAnimation(setModals)
      performSubActions(actionsLeft, true)
   }

   const handleClickBtnSelect = (cardId) => {
      sound.btnSelectClick.play()
      if (actions.ids.length === 0 || actions.ids[0] !== cardId) {
         setActions((prev) => ({ ...prev, ids: [cardId] }))
      } else {
         setActions((prev) => ({ ...prev, ids: [] }))
      }
   }

   return { handleClickBtnSelect, onYesFunc, onCancelFunc }
}
