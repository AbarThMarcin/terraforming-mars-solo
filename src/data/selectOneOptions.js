import card134_option1 from '../assets/images/selectOne-options/card134_option1.png'
import card134_option2 from '../assets/images/selectOne-options/card134_option1.png'
import { ACTIONS_GAME } from '../util/actionsGame'
import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { getCardsWithPossibleMicrobes } from '../util/misc'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'

export const OPTION_ICONS = {
   CARD134_OPTION1: 'card134_option1',
   CARD134_OPTION2: 'card134_option2',
}

export const getOptionIcon = (actionIconName) => {
   switch (actionIconName) {
      case OPTION_ICONS.CARD134_OPTION1:
         return card134_option1
      case OPTION_ICONS.CARD134_OPTION2:
         return card134_option2
      default:
         return
   }
}

export function getOptions(cardId) {
   let options = []
   switch (cardId) {
      case 134:
         options = [OPTION_ICONS.CARD134_OPTION1, OPTION_ICONS.CARD134_OPTION2]
         break
      default:
         break
   }
   return options
}

export function funcGetOptionsActions(
   option,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   setModals
) {
   let subActions = []
   let value
   let dataCards = []
   switch (option) {
      case OPTION_ICONS.CARD134_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value }),
         })
         break
      case OPTION_ICONS.CARD134_OPTION2:
         value = 2
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalResource: {
                     cardId: dataCards[0].id,
                     amount: value,
                     data: dataCards,
                     resType: RESOURCES.MICROBE,
                  },
                  resource: true,
               }))
            },
         })
         break
      default:
         break
   }

   return subActions
}
