import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ACTIONS_GAME } from '../util/actionsGame'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import add1animal from '../assets/images/actions/add1animal.png'
import raise1tr from '../assets/images/actions/raise1tr.png'

export const ACTION_ICONS = {
   ADD1ANIMAL: 'add1animal',
   RAISE1TR: 'raise1tr',
}

export const getActionIcon = (actionIconName) => {
   switch (actionIconName) {
      case ACTION_ICONS.RAISE1TR:
         return raise1tr
      case ACTION_ICONS.ADD1ANIMAL:
         return add1animal
      default:
         return
   }
}

export const funcGetCardActions = (
   cardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   stateBoard,
   dispatchBoard,
   modals,
   setModals
) => {
   let subCardActions = []
   let value
   switch (cardId) {
      // UNMI CORPORATION
      case 'UNMI':
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -3 })
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            },
         })
         break
      // Livestock
      case 184:
         value = 1
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.ANIMAL, amount: value },
               }),
         })
         break
      default:
         break
   }
   return subCardActions
}
