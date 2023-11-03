import { useContext, useState } from "react"
import { ModalsContext, StateGameContext, StatePlayerContext } from "../components/game"
import { funcSetLogItemsSingleActions, funcUpdateLogItemAction } from "../data/log"
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from "../data/animations"
import { getCards, getCardsWithDecreasedCost, getCardsWithTimeAdded } from "../utils/cards"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { RESOURCES } from "../data/resources"
import { SoundContext } from "../App"

export const useSubactionBusinessContacts = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions, ANIMATION_SPEED, setLogItems } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const [selectedCardIds, setSelectedCardIds] = useState([])
   
   const handleClickBtnSelect = (cardId) => {
      sound.btnSelectClick.play()
      if (!selectedCardIds.includes(cardId)) {
         setSelectedCardIds([...selectedCardIds, cardId])
      } else {
         setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId))
      }
   }

   const onYesFunc = () => {
      sound.btnGeneralClick.play()
      // Save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `ids: ${selectedCardIds.join(', ')}`)

      // Turn business contacts phase off
      setModals((prev) => ({ ...prev, businessContacts: false }))
      // Draw card(s)
      startAnimation(setModals)
      setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, modals.modalBusCont.selectCount, setModals)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: [...statePlayer.cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(selectedCardIds)), statePlayer)],
         })
         if (modals.modalBusCont.selectCount === 1) {
            funcSetLogItemsSingleActions(`Drew 1 card (${getCards(selectedCardIds)[0].name})`, RESOURCES.CARD, 1, setLogItems)
         } else {
            const newCardsDrawNames = getCards(selectedCardIds).map((c) => c.name)
            funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
         }

         endAnimation(setModals)
         // Continue remaining actions
         startAnimation(setModals)
         performSubActions(stateGame.actionsLeft)
      }, ANIMATION_SPEED)
   }

   return { onYesFunc, handleClickBtnSelect, selectedCardIds }
}
