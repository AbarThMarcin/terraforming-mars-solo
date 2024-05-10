import { useContext, useEffect } from 'react'
import { ActionsContext, ModalsContext, StateGameContext, StatePlayerContext } from '../components/game'
import { RESOURCES } from '../data/resources'
import { ANIMATIONS } from '../data/animations'
import { funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { getCardsWithDecreasedCost, getCardsWithTimeAdded, hasTag } from '../utils/cards'
import { TAGS } from '../data/tags'
import { getAllResourcesInMlnOnlyHeat } from '../utils/misc'
import { SoundContext } from '../App'

export const useSubactionSelectCard = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { performSubActions, setLogItems } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { actions, setActions } = useContext(ActionsContext)
   const { sound } = useContext(SoundContext)

   const isSelected = actions.ids.includes(modals.modalSelectCard.card.id)
   useEffect(() => {
      if (getInitSelected()) {
         setActions((prev) => ({ ...prev, ids: [modals.modalSelectCard.card.id] }))
      } else {
         setActions((prev) => ({ ...prev, ids: [] }))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   function getInitSelected() {
      if (modals.modalSelectCard.cardIdAction === 5) {
         return hasTag(modals.modalSelectCard.card, TAGS.MICROBE)
      } else {
         return false
      }
   }

   const handleClickSelect = () => {
      if (modals.modalSelectCard.cardIdAction === 5) return
      const resources = getAllResourcesInMlnOnlyHeat(statePlayer)
      if (resources < 3) return
      
      sound.btnSelectClick.play()
      if (isSelected) {
         setActions((prev) => ({ ...prev, ids: [], mln: 0, heat: 0 }))
      } else {
         let resMln = Math.min(statePlayer.resources.mln, 3)
         let resHeat = Math.min(3 - resMln, statePlayer.resources.heat)
         setActions((prev) => ({ ...prev, ids: [modals.modalSelectCard.card.id], mln: resMln, heat: resHeat }))
      }
   }

   const handleClickConfirmBtn = () => {
      sound.btnGeneralClick.play()
      // Also save action (string) for log that is being performed
      if (isSelected) funcUpdateLogItemAction(setLogItems, `ids: ${modals.modalSelectCard.card.id}`)

      // Close selectCard modal
      setModals((prev) => ({ ...prev, selectCard: false }))
      // If not selected, send empty array of subactions to subActions Performer to trigger further changes, like VP or save to server,
      // else do search for life or buy a card
      if (!isSelected) {
         performSubActions([])
      } else {
         let subActions = []
         if (modals.modalSelectCard.cardIdAction === 5) {
            // Search For Life
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.SCIENCE,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: {
                        cardId: modals.modalSelectCard.cardIdAction,
                        resource: RESOURCES.SCIENCE,
                        amount: 1,
                     },
                  })
                  funcSetLogItemsSingleActions('Received 1 science to SEARCH FOR LIFE card', RESOURCES.SCIENCE, 1, setLogItems)
               },
            })
         } else {
            // Inventors' Guild / Business Network
            if (actions.mln > 0)
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.MLN,
                  value: actions.mln,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                        payload: -actions.mln,
                     })
                     funcSetLogItemsSingleActions(`Paid ${actions.mln} MC`, RESOURCES.MLN, -actions.mln, setLogItems)
                     funcUpdateLogItemAction(setLogItems, `paidMln: ${actions.mln}`)
                  },
               })
            if (actions.Heat > 0)
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.HEAT,
                  value: actions.Heat,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                        payload: -actions.Heat,
                     })
                     funcSetLogItemsSingleActions(`Paid ${actions.Heat} heat`, RESOURCES.HEAT, -actions.Heat, setLogItems)
                     funcUpdateLogItemAction(setLogItems, `paidHeat: ${actions.heat}`)
                  },
               })
            subActions.push({
               name: ANIMATIONS.CARD_IN,
               type: RESOURCES.CARD,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                     payload: [...statePlayer.cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(modals.modalSelectCard.card), statePlayer)],
                  })
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.SET_CARDS_PURCHASED,
                     payload: [...statePlayer.cardsPurchased, modals.modalSelectCard.card],
                  })
                  funcSetLogItemsSingleActions(`Drew 1 card (${modals.modalSelectCard.card.name})`, RESOURCES.CARD, 1, setLogItems)
               },
            })
         }
         performSubActions(subActions)
      }
   }

   return { handleClickSelect, handleClickConfirmBtn }
}
