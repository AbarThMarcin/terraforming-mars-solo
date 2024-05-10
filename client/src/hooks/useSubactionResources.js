import { useContext } from 'react'
import { SoundContext } from '../App'
import { ModalsContext, StateGameContext, StatePlayerContext } from '../components/game'
import { funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { ANIMATIONS, endAnimation, setAnimation } from '../data/animations'
import { RESOURCES } from '../data/resources'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { getCards } from '../utils/cards'
import { ACTIONS_GAME } from '../stateActions/actionsGame'

export const useSubactionResources = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, ANIMATION_SPEED, setLogItems } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleClickResCard = (itemId) => {
      sound.btnSelectClick.play()
      setModals((prev) => ({
         ...prev,
         modalResource: { ...prev.modalResource, cardId: itemId },
      }))
   }

   const handleClickConfirmBtn = () => {
      sound.btnGeneralClick.play()
      // Also save action (string) for log that is being performed
      if (modals.modalCard.id === 163 && modals.modalResource.resType === RESOURCES.ANIMAL) {
         funcUpdateLogItemAction(setLogItems, `targetId2: ${modals.modalResource.cardId}`)
      } else {
         funcUpdateLogItemAction(setLogItems, `targetId: ${modals.modalResource.cardId}`)
      }

      // Turn addRemoveRes phase off
      setModals((prev) => ({ ...prev, resource: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Add Resource
      let resource
      let card = statePlayer.cardsPlayed.find((card) => card.id === modals.modalResource.cardId)
      if (card.units.microbe) resource = RESOURCES.MICROBE
      if (card.units.animal) resource = RESOURCES.ANIMAL
      if (card.units.science) resource = RESOURCES.SCIENCE
      if (card.units.fighter) resource = RESOURCES.FIGHTER
      setAnimation(ANIMATIONS.RESOURCES_IN, modals.modalResource.resType === null ? resource : modals.modalResource.resType, modals.modalResource.amount, setModals, sound)
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.ADD_BIO_RES,
            payload: {
               cardId: modals.modalResource.cardId,
               resource: modals.modalResource.resType === null ? resource : modals.modalResource.resType,
               amount: modals.modalResource.amount,
            },
         })
         funcSetLogItemsSingleActions(
            modals.modalResource.amount === 1
               ? `Received 1 ${modals.modalResource.resType === null ? resource : modals.modalResource.resType} to ${getCards(modals.modalResource.cardId).name}`
               : `Received ${modals.modalResource.amount} ${modals.modalResource.resType === null ? resource : modals.modalResource.resType}s to ${
                    getCards(modals.modalResource.cardId).name
                 }`,
            modals.modalResource.resType,
            modals.modalResource.amount,
            setLogItems
         )
         performSubActions(stateGame.actionsLeft)
         endAnimation(setModals)
      }, ANIMATION_SPEED)
   }

   return { handleClickResCard, handleClickConfirmBtn }
}
