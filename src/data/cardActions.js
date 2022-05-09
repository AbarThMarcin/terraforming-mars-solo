import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ACTIONS_GAME } from '../util/actionsGame'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import { getCardsWithPossibleMicrobes } from '../util/misc'
import add1animal from '../assets/images/actions/add1animal.png'
import raise1tr from '../assets/images/actions/raise1tr.png'
import add1microbeOther from '../assets/images/actions/add1microbeOther.png'
import add2microbes from '../assets/images/actions/add2microbes.png'
import { getOptions } from './selectOneOptions'

export const ACTION_ICONS = {
   ADD1ANIMAL: 'add1animal',
   RAISE1TR: 'raise1tr',
   ADD1MICROBEOTHER: 'add1microbeOther',
   ADD2MICROBES: 'add2microbes',
}

export const getActionIcon = (actionIconName) => {
   switch (actionIconName) {
      case ACTION_ICONS.RAISE1TR:
         return raise1tr
      case ACTION_ICONS.ADD1ANIMAL:
         return add1animal
      case ACTION_ICONS.ADD1MICROBEOTHER:
         return add1microbeOther
      case ACTION_ICONS.ADD2MICROBES:
         return add2microbes
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
   let dataCards = []
   switch (cardId) {
      // UNMI CORPORATION
      case 'UNMI':
         value = 3
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MLN,
            value: value,
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
      // Symbiotic Fungus
      case 133:
         value = 1
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         subCardActions.push({
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
      // Extreme-Cold Fungus
      case 134:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.Id === 134),
                     options: getOptions(cardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      default:
         break
   }
   return subCardActions
}
