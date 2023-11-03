import { useContext, useState } from "react"
import { ModalsContext, StateGameContext, StatePlayerContext, UserContext } from "../components/game"
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from "../data/animations"
import { funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter, funcUpdateLogItemAction } from "../data/log"
import { getCards, getCardsWithDecreasedCost, getCardsWithTimeAdded, getNewCardsDrawIds } from "../utils/cards"
import { RESOURCES } from "../data/resources"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { SoundContext } from "../App"

export const useSubactionMarsUniversity = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions, ANIMATION_SPEED, setLogItems, dataForReplay } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const [selectedCardId, setSelectedCardId] = useState(0)

   const onYesFunc = async () => {
      sound.btnGeneralClick.play()
      // Turn mars university phase off
      setModals((prev) => ({ ...prev, marsUniversity: false }))
      // Get Random Cards Ids
      startAnimation(setModals)
      let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
      // Discard selected card
      setAnimation(ANIMATIONS.CARD_OUT, RESOURCES.CARD, 1, setModals)
      let newCardsInHand = JSON.parse(JSON.stringify(statePlayer.cardsInHand.filter((card) => card.id !== selectedCardId)))
      setTimeout(() => {
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCardsInHand })
         funcSetLogItemsSingleActions(`Discarded 1 card (${getCards(selectedCardId).name}) from MARS UNIVERSITY effect`, RESOURCES.CARD, -1, setLogItems)
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
         performSubActions(stateGame.actionsLeft, true)
         funcUpdateLogItemAction(setLogItems, `MUtargetIds: ${selectedCardId}`)
      }, ANIMATION_SPEED * 2)
   }

   const onCancelFunc = () => {
      sound.btnGeneralClick.play()
      // Turn mars university phase off
      setModals((prev) => ({ ...prev, marsUniversity: false }))
      // Continue remaining actions
      startAnimation(setModals)
      performSubActions(stateGame.actionsLeft, true)
   }

   const handleClickBtnSelect = (cardId) => {
      sound.btnSelectClick.play()
      if (selectedCardId === 0 || cardId !== selectedCardId) {
         setSelectedCardId(cardId)
      } else {
         setSelectedCardId(0)
      }
   }

   return { handleClickBtnSelect, onYesFunc, onCancelFunc, selectedCardId }
}
