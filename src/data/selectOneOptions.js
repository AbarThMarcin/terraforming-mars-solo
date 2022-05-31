import { ACTIONS_GAME } from '../util/actionsGame'
import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { getCardsWithPossibleAnimals, getCardsWithPossibleMicrobes } from '../util/misc'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import microbe from '../assets/images/selectOne-options/microbe.svg'
import plant from '../assets/images/selectOne-options/plant.svg'
import animal2 from '../assets/images/selectOne-options/animal2.svg'
import card19_option1 from '../assets/images/selectOne-options/card19_option1.svg'
import card19_option2 from '../assets/images/selectOne-options/card19_option2.svg'
import card33_option2 from '../assets/images/selectOne-options/card33_option2.svg'
import card34_option2 from '../assets/images/selectOne-options/card34_option2.svg'
import card69_option1 from '../assets/images/selectOne-options/card69_option1.svg'
import card69_option2 from '../assets/images/selectOne-options/card69_option2.svg'
import card74_option2 from '../assets/images/selectOne-options/card74_option2.svg'
import card74_option3 from '../assets/images/selectOne-options/card74_option3.svg'
import card115_option1 from '../assets/images/selectOne-options/card115_option1.svg'
import card115_option2 from '../assets/images/selectOne-options/card115_option2.svg'
import card124_option1 from '../assets/images/selectOne-options/card124_option1.svg'
import card124_option2 from '../assets/images/selectOne-options/card124_option2.svg'
import card134_option2 from '../assets/images/selectOne-options/card134_option2.svg'
import card143_option1 from '../assets/images/selectOne-options/card143_option1.svg'
import card143_option2 from '../assets/images/selectOne-options/card143_option2.svg'
import card157_option2 from '../assets/images/selectOne-options/card157_option2.svg'
import card190_option1 from '../assets/images/selectOne-options/card190_option1.svg'
import { IMM_EFFECTS } from './immEffects/immEffects'

export const OPTION_ICONS = {
   CARD19_OPTION1: 'card19_option1',
   CARD19_OPTION2: 'card19_option2',
   CARD19_OPTION3: 'card19_option3',
   CARD33_OPTION1: 'card33_option1',
   CARD33_OPTION2: 'card33_option2',
   CARD34_OPTION1: 'card34_option1',
   CARD34_OPTION2: 'card34_option2',
   CARD69_OPTION1: 'card69_option1',
   CARD69_OPTION2: 'card69_option2',
   CARD74_OPTION1: 'card74_option1',
   CARD74_OPTION2: 'card74_option2',
   CARD74_OPTION3: 'card74_option3',
   CARD115_OPTION1: 'card115_option1',
   CARD115_OPTION2: 'card115_option2',
   CARD124_OPTION1: 'card124_option1',
   CARD124_OPTION2: 'card124_option2',
   CARD134_OPTION1: 'card134_option1',
   CARD134_OPTION2: 'card134_option2',
   CARD143_OPTION1: 'card143_option1',
   CARD143_OPTION2: 'card143_option2',
   CARD157_OPTION1: 'card157_option1',
   CARD157_OPTION2: 'card157_option2',
   CARD190_OPTION1: 'card190_option1',
   CARD190_OPTION2: 'card190_option2',
   CARD152_OPTION1: 'card152_option1', // Insulation
   CARD194_OPTION1: 'card194_option1', // Power Infrastructure
}

export const getOptionIcon = (actionIconName) => {
   switch (actionIconName) {
      case OPTION_ICONS.CARD19_OPTION1:
         return card19_option1
      case OPTION_ICONS.CARD19_OPTION2:
         return card19_option2
      case OPTION_ICONS.CARD19_OPTION3:
      case OPTION_ICONS.CARD190_OPTION2:
         return animal2
      case OPTION_ICONS.CARD33_OPTION1:
      case OPTION_ICONS.CARD34_OPTION1:
      case OPTION_ICONS.CARD157_OPTION1:
         return microbe
      case OPTION_ICONS.CARD33_OPTION2:
         return card33_option2
      case OPTION_ICONS.CARD34_OPTION2:
         return card34_option2
      case OPTION_ICONS.CARD69_OPTION1:
         return card69_option1
      case OPTION_ICONS.CARD69_OPTION2:
         return card69_option2
      case OPTION_ICONS.CARD74_OPTION1:
      case OPTION_ICONS.CARD134_OPTION1:
         return plant
      case OPTION_ICONS.CARD74_OPTION2:
         return card74_option2
      case OPTION_ICONS.CARD74_OPTION3:
         return card74_option3
      case OPTION_ICONS.CARD115_OPTION1:
         return card115_option1
      case OPTION_ICONS.CARD115_OPTION2:
         return card115_option2
      case OPTION_ICONS.CARD124_OPTION1:
         return card124_option1
      case OPTION_ICONS.CARD124_OPTION2:
         return card124_option2
      case OPTION_ICONS.CARD134_OPTION2:
         return card134_option2
      case OPTION_ICONS.CARD143_OPTION1:
         return card143_option1
      case OPTION_ICONS.CARD143_OPTION2:
         return card143_option2
      case OPTION_ICONS.CARD157_OPTION2:
         return card157_option2
      case OPTION_ICONS.CARD190_OPTION1:
         return card190_option1
      default:
         return
   }
}

export function getOptions(cardId) {
   let options = []
   switch (cardId) {
      case 19:
         options = [
            OPTION_ICONS.CARD19_OPTION1,
            OPTION_ICONS.CARD19_OPTION2,
            OPTION_ICONS.CARD19_OPTION3,
         ]
         break
      case 33:
         options = [OPTION_ICONS.CARD33_OPTION1, OPTION_ICONS.CARD33_OPTION2]
         break
      case 34:
         options = [OPTION_ICONS.CARD34_OPTION1, OPTION_ICONS.CARD34_OPTION2]
         break
      case 69:
         options = [OPTION_ICONS.CARD69_OPTION1, OPTION_ICONS.CARD69_OPTION2]
         break
      case 74:
         options = [OPTION_ICONS.CARD74_OPTION1]
         break
      case 115:
         options = [OPTION_ICONS.CARD115_OPTION1, OPTION_ICONS.CARD115_OPTION2]
         break
      case 124:
         options = [OPTION_ICONS.CARD124_OPTION1, OPTION_ICONS.CARD124_OPTION2]
         break
      case 134:
         options = [OPTION_ICONS.CARD134_OPTION1, OPTION_ICONS.CARD134_OPTION2]
         break
      case 143:
         options = [OPTION_ICONS.CARD143_OPTION1, OPTION_ICONS.CARD143_OPTION2]
         break
      case 157:
         options = [OPTION_ICONS.CARD157_OPTION1, OPTION_ICONS.CARD157_OPTION2]
         break
      case 190:
         options = [OPTION_ICONS.CARD190_OPTION1, OPTION_ICONS.CARD190_OPTION2]
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
   getImmEffects,
   modals,
   setModals,
   energyAmount,
   heatAmount
) {
   let subActions = []
   let value
   let dataCards = []
   switch (option) {
      // Imported Hydrogen
      case OPTION_ICONS.CARD19_OPTION1:
         value = 3
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value }),
         })
         break
      case OPTION_ICONS.CARD19_OPTION2:
         value = 3
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
      case OPTION_ICONS.CARD19_OPTION3:
         value = 2
         dataCards = getCardsWithPossibleAnimals(statePlayer)
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
                     resType: RESOURCES.ANIMAL,
                  },
                  resource: true,
               }))
            },
         })
         break
      // Regolith Eaters
      case OPTION_ICONS.CARD33_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: 33,
                     resource: RESOURCES.MICROBE,
                     amount: value,
                  },
               }),
         })
         break
      case OPTION_ICONS.CARD33_OPTION2:
         value = 2
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: 33,
                     resource: RESOURCES.MICROBE,
                     amount: -value,
                  },
               }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN)]
         break
      // GHG Producing Bacteria
      case OPTION_ICONS.CARD34_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: 34,
                     resource: RESOURCES.MICROBE,
                     amount: value,
                  },
               }),
         })
         break
      case OPTION_ICONS.CARD34_OPTION2:
         value = 2
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: 34,
                     resource: RESOURCES.MICROBE,
                     amount: -value,
                  },
               }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Electro Catapult
      case OPTION_ICONS.CARD69_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -value }),
         })
         value = 7
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value }),
         })
         break
      case OPTION_ICONS.CARD69_OPTION2:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.STEEL,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -value }),
         })
         value = 7
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value }),
         })
         break
      // Viral Enhancers
      case OPTION_ICONS.CARD74_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value }),
         })
         break
      case OPTION_ICONS.CARD74_OPTION2:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: modals.modalCard.id,
                     resource: RESOURCES.MICROBE,
                     amount: value,
                  },
               }),
         })
         break
      case OPTION_ICONS.CARD74_OPTION3:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: modals.modalCard.id,
                     resource: RESOURCES.ANIMAL,
                     amount: value,
                  },
               }),
         })
         break
      // Artificial Photosynthesis
      case OPTION_ICONS.CARD115_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value }),
         })
         break
      case OPTION_ICONS.CARD115_OPTION2:
         value = 2
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value }),
         })
         break
      // Hired Raiders
      case OPTION_ICONS.CARD124_OPTION1:
         value = 2
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: value }),
         })
         break
      case OPTION_ICONS.CARD124_OPTION2:
         value = 3
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value }),
         })
         break
      // Extreme-Cold Fungus
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
      // Large Convoy
      case OPTION_ICONS.CARD143_OPTION1:
         value = 5
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value }),
         })
         break
      case OPTION_ICONS.CARD143_OPTION2:
         value = 4
         dataCards = getCardsWithPossibleAnimals(statePlayer)
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
                     resType: RESOURCES.ANIMAL,
                  },
                  resource: true,
               }))
            },
         })
         break
      // Nitrine Reducing Bacteria
      case OPTION_ICONS.CARD157_OPTION1:
         value = 1
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: 157,
                     resource: RESOURCES.MICROBE,
                     amount: value,
                  },
               }),
         })
         break
      case OPTION_ICONS.CARD157_OPTION2:
         value = 3
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MICROBE,
            value: value,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: {
                     cardId: 157,
                     resource: RESOURCES.MICROBE,
                     amount: -value,
                  },
               }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TR)]
         break
      // Local Heat Trapping
      case OPTION_ICONS.CARD190_OPTION1:
         value = 4
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value }),
         })
         break
      case OPTION_ICONS.CARD190_OPTION2:
         value = 2
         dataCards = getCardsWithPossibleAnimals(statePlayer)
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
                     resType: RESOURCES.ANIMAL,
                  },
                  resource: true,
               }))
            },
         })
         break
      case OPTION_ICONS.CARD152_OPTION1:
         if (heatAmount) {
            subActions.push({
               name: ANIMATIONS.PRODUCTION_OUT,
               type: RESOURCES.HEAT,
               value: heatAmount,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_PROD_HEAT,
                     payload: -heatAmount,
                  }),
            })
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: heatAmount,
               func: () =>
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: heatAmount }),
            })
         }
         break
      case OPTION_ICONS.CARD194_OPTION1:
         if (energyAmount) {
            subActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.ENERGY,
               value: energyAmount,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_ENERGY,
                     payload: -energyAmount,
                  }),
            })
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: energyAmount,
               func: () =>
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: energyAmount }),
            })
         }
         break
      default:
         break
   }

   return subActions
}
