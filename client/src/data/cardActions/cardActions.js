import { ACTIONS_PLAYER } from '../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../stateActions/actionsGame'
import { ANIMATIONS } from '../animations'
import { RESOURCES } from '../resources'
import {
   getCards,
   getCardsWithPossibleMicrobes,
   getNewCardsDrawIds,
   modifiedCards,
   withTimeAdded,
} from '../../utils/misc'
import { getOptions } from '../selectOneOptions'
import { TILES } from '../board'
import { IMM_EFFECTS } from '../immEffects/immEffects'
import { EFFECTS } from '../effects/effectIcons'
import { CORP_NAMES } from '../corpNames'
import { CARDS } from '../cards'

export const funcGetCardActions = (
   cardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   stateBoard,
   setModals,
   getEffect,
   getImmEffects,
   toBuyResources,
   cardsDeckIds,
   setCardsDeckIds,
   setCardsDrawIds,
   type,
   id,
   token,
   sound
) => {
   let subCardActions = []
   let dataCards = []
   let value = 0
   switch (cardId) {
      // ===================== UNMI CORPORATION =====================
      case CORP_NAMES.UNMI:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            },
         })
         break
      // =========================== CARDS ==========================
      // Search For Life
      case 5:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(
                  1,
                  cardsDeckIds,
                  setCardsDeckIds,
                  setCardsDrawIds,
                  type,
                  id,
                  token
               )
               setModals((prev) => ({
                  ...prev,
                  modalSelectCard: {
                     cardIdAction: cardId,
                     card: getCards(CARDS, newCardsDrawIds)[0],
                  },
                  selectCard: true,
               }))
            },
         })
         break
      // Inventors' Guild and Business Network
      case 6:
      case 110:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(
                  1,
                  cardsDeckIds,
                  setCardsDeckIds,
                  setCardsDrawIds,
                  type,
                  id,
                  token
               )
               setModals((prev) => ({
                  ...prev,
                  modalSelectCard: {
                     cardIdAction: cardId,
                     card: getCards(CARDS, newCardsDrawIds)[0],
                  },
                  selectCard: true,
               }))
            },
         })
         break
      // Martian Rails
      case 7:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 }),
         })
         value = stateBoard.filter(
            (field) =>
               field.object === TILES.CITY_NEUTRAL ||
               (field.object === TILES.CITY &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY')
         ).length
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value }),
         })
         break
      // Water Import From Europa and Aquifer Pumping
      case 12:
      case 187:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[1])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.STEEL,
               value: toBuyResources[1],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
                     payload: -toBuyResources[1],
                  }),
            })
         if (toBuyResources[2])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.TITAN,
               value: toBuyResources[2],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
                     payload: -toBuyResources[2],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         getImmEffects(IMM_EFFECTS.AQUIFER).forEach((immEffect) => subCardActions.push(immEffect))
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
            subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         break
      // Space Elevator
      case 13:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -1 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 5 }),
         })
         break
      // Development Center
      case 14:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 }),
         })
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(
                  1,
                  cardsDeckIds,
                  setCardsDeckIds,
                  setCardsDrawIds,
                  type,
                  id,
                  token
               )
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand,
                     ...modifiedCards(withTimeAdded(getCards(CARDS, newCardsDrawIds)), statePlayer),
                  ],
               })
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                  payload: [...statePlayer.cardsSeen, ...getCards(CARDS, newCardsDrawIds)],
               })
            },
         })
         break
      // Equatorial Magnetizer
      case 15:
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            },
         })
         break
      // Predators, Fish, Small Animals, Birds and Livestock
      case 24:
      case 52:
      case 54:
      case 72:
      case 184:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.ANIMAL, amount: 1 },
               }),
         })
         break
      // Security Fleet
      case 28:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.FIGHTER,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.FIGHTER, amount: 1 },
               }),
         })
         break
      // Regolith Eaters, GHG Producing Bacteria, Electro Catapult, Nitrite Reducing Bacteria
      case 33:
      case 34:
      case 69:
      case 157:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.id === cardId),
                     options: getOptions(cardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Ants and Tardigrades
      case 35:
      case 49:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.MICROBE, amount: 1 },
               }),
         })
         break
      // Space Mirrors
      case 76:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 }),
         })
         break
      // Physics Complex
      case 95:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 6,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -6 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.SCIENCE,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.SCIENCE, amount: 1 },
               }),
         })
         break
      // Ironworks
      case 101:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 1 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         }
         break
      // Steelworks
      case 103:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         }
         break
      // Ore Processor
      case 104:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 1 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         }
         break
      // Industrial Center
      case 123:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         })
         break
      // Symbiotic Fungus
      case 133:
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalResource: {
                     cardId: dataCards[0].id,
                     amount: 1,
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
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.id === cardId),
                     options: getOptions(cardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Caretaker Contract
      case 154:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.HEAT,
            value: 8,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 }),
         })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            },
         })
         break
      // Water Splitting Plant
      case 177:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -3 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         }
         break
      // Power Infrasctructure
      case 194:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.id === cardId),
                     options: null,
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Restricted Area
      case 199:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(
                  1,
                  cardsDeckIds,
                  setCardsDeckIds,
                  setCardsDrawIds,
                  type,
                  id,
                  token
               )
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand,
                     ...modifiedCards(withTimeAdded(getCards(CARDS, newCardsDrawIds)), statePlayer),
                  ],
               })
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                  payload: [...statePlayer.cardsSeen, ...getCards(CARDS, newCardsDrawIds)],
               })
            },
         })
         break
      // Underground Detonations
      case 202:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 }),
         })
         break
      // AI Central
      case 208:
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(
                  2,
                  cardsDeckIds,
                  setCardsDeckIds,
                  setCardsDrawIds,
                  type,
                  id,
                  token
               )
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand,
                     ...modifiedCards(withTimeAdded(getCards(CARDS, newCardsDrawIds)), statePlayer),
                  ],
               })
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                  payload: [...statePlayer.cardsSeen, ...getCards(CARDS, newCardsDrawIds)],
               })
            },
         })
         break
      default:
         break
   }
   return subCardActions
}
