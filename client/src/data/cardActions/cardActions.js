import { ACTIONS_PLAYER } from '../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../stateActions/actionsGame'
import { ANIMATIONS } from '../animations'
import { RESOURCES } from '../resources'
import { getCards, getCardsWithPossibleMicrobes, getNewCardsDrawIds, getCardsWithTimeAdded } from '../../utils/cards'
import { getCardsWithDecreasedCost } from '../../utils/cards'
import { getOptions } from '../selectOneOptions'
import { TILES } from '../board'
import { IMM_EFFECTS } from '../immEffects/immEffects'
import { CORP_NAMES } from '../corpNames'
import { funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter } from '../log'
import { REPLAY_USERINTERACTIONS } from '../replay'

export const funcGetCardActions = (
   cardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   stateBoard,
   setModals,
   getImmEffects,
   toBuyResources,
   type,
   id,
   token,
   sound,
   setLogItems,
   dataForReplay
) => {
   let subCardActions = []
   let dataCards = []
   let value = 0
   let cardsInHand = statePlayer.cardsInHand
   switch (cardId) {
      // ===================== UNMI CORPORATION =====================
      case CORP_NAMES.UNMI:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions('TR raised by 1', RESOURCES.TR, 1, setLogItems)
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
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: REPLAY_USERINTERACTIONS.SELECTCARD,
            value: null,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, dataForReplay)
               setModals((prev) => ({
                  ...prev,
                  modalSelectCard: {
                     cardIdAction: cardId,
                     card: getCards(newCardsDrawIds)[0],
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
            type: REPLAY_USERINTERACTIONS.SELECTCARD,
            value: null,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, dataForReplay)
               setModals((prev) => ({
                  ...prev,
                  modalSelectCard: {
                     cardIdAction: cardId,
                     card: getCards(newCardsDrawIds)[0],
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
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Paid 1 energy', RESOURCES.ENERGY, -1, setLogItems)
            },
         })
         value = stateBoard.filter(
            (field) =>
               (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
               field.name !== 'PHOBOS SPACE HAVEN' &&
               field.name !== 'GANYMEDE COLONY'
         ).length
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value })
               funcSetLogItemsSingleActions(`Received ${value} MC`, RESOURCES.MLN, value, setLogItems)
            },
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
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[1])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.STEEL,
               value: toBuyResources[1],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
                     payload: -toBuyResources[1],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[1]} steel`, RESOURCES.STEEL, -toBuyResources[1], setLogItems)
               },
            })
         if (toBuyResources[2])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.TITAN,
               value: toBuyResources[2],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
                     payload: -toBuyResources[2],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[2]} titanium`, RESOURCES.TITAN, -toBuyResources[2], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         getImmEffects(IMM_EFFECTS.AQUIFER).forEach((immEffect) => subCardActions.push(immEffect))
         break
      // Space Elevator
      case 13:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -1 })
               funcSetLogItemsSingleActions('Paid 1 steel', RESOURCES.STEEL, -1, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 5 })
               funcSetLogItemsSingleActions('Received 5 MC', RESOURCES.MLN, 5, setLogItems)
            },
         })
         break
      // Development Center
      case 14:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Paid 1 energy', RESOURCES.ENERGY, -1, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, dataForReplay)
               cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)] })
               funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name})`, RESOURCES.CARD, 1, setLogItems)
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand }, stateGame)
            },
         })
         break
      // Equatorial Magnetizer
      case 15:
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions('TR raised by 1', RESOURCES.TR, 1, setLogItems)
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
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.ANIMAL, amount: 1 },
               })
               funcSetLogItemsSingleActions(`Received 1 animal to ${getCards(cardId).name}`, RESOURCES.ANIMAL, 1, setLogItems)
            },
         })
         break
      // Security Fleet
      case 28:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -1 })
               funcSetLogItemsSingleActions('Paid 1 titanium', RESOURCES.TITAN, -1, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.FIGHTER,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.FIGHTER, amount: 1 },
               })
               funcSetLogItemsSingleActions(`Received 1 fighter to ${getCards(cardId).name}`, RESOURCES.FIGHTER, 1, setLogItems)
            },
         })
         break
      // Regolith Eaters, GHG Producing Bacteria, Electro Catapult, Nitrite Reducing Bacteria
      case 33:
      case 34:
      case 69:
      case 157:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: REPLAY_USERINTERACTIONS.SELECTONE,
            value: null,
            func: () => {
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
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.MICROBE, amount: 1 },
               })
               funcSetLogItemsSingleActions(`Received 1 microbe to ${getCards(cardId).name}`, RESOURCES.MICROBE, 1, setLogItems)
            },
         })
         break
      // Space Mirrors
      case 76:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 })
               funcSetLogItemsSingleActions('Energy production increased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 1, setLogItems)
            },
         })
         break
      // Physics Complex
      case 95:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 6,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -6 })
               funcSetLogItemsSingleActions('Paid 6 energy', RESOURCES.ENERGY, -6, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.SCIENCE,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.SCIENCE, amount: 1 },
               })
               funcSetLogItemsSingleActions(`Received 1 science to ${getCards(cardId).name}`, RESOURCES.SCIENCE, 1, setLogItems)
            },
         })
         break
      // Ironworks
      case 101:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 })
               funcSetLogItemsSingleActions('Paid 4 energy', RESOURCES.ENERGY, -4, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 steel', RESOURCES.STEEL, 1, setLogItems)
            },
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         break
      // Steelworks
      case 103:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 })
               funcSetLogItemsSingleActions('Paid 4 energy', RESOURCES.ENERGY, -4, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 steel', RESOURCES.STEEL, 2, setLogItems)
            },
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         break
      // Ore Processor
      case 104:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 })
               funcSetLogItemsSingleActions('Paid 4 energy', RESOURCES.ENERGY, -4, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 titanium', RESOURCES.TITAN, 1, setLogItems)
            },
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         break
      // Industrial Center
      case 123:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               funcSetLogItemsSingleActions('Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1, setLogItems)
            },
         })
         break
      // Symbiotic Fungus
      case 133:
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: REPLAY_USERINTERACTIONS.RESOURCES,
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
            type: REPLAY_USERINTERACTIONS.SELECTONE,
            value: null,
            func: () => {
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
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
               funcSetLogItemsSingleActions('Paid 8 heat', RESOURCES.HEAT, -8, setLogItems)
            },
         })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions('TR raised by 1', RESOURCES.TR, 1, setLogItems)
            },
         })
         break
      // Water Splitting Plant
      case 177:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -3 })
               funcSetLogItemsSingleActions('Paid 3 energy', RESOURCES.ENERGY, -3, setLogItems)
            },
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         break
      // Power Infrasctructure
      case 194:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: REPLAY_USERINTERACTIONS.SELECTONE,
            value: null,
            func: () => {
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
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, dataForReplay)
               cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)] })
               funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name})`, RESOURCES.CARD, 1, setLogItems)
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand }, stateGame)
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
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[0]} MC`, RESOURCES.MLN, -toBuyResources[0], setLogItems)
               },
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  })
                  funcSetLogItemsSingleActions(`Paid ${toBuyResources[3]} heat`, RESOURCES.HEAT, -toBuyResources[3], setLogItems)
               },
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
               funcSetLogItemsSingleActions('Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2, setLogItems)
            },
         })
         break
      // AI Central
      case 208:
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: async () => {
               let newCardsDrawIds = await getNewCardsDrawIds(2, statePlayer, dispatchPlayer, type, id, token, dataForReplay)
               cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)] })
               const newCardsDrawNames = getCards(newCardsDrawIds).map((c) => c.name)
               funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand }, stateGame)
            },
         })
         break
      default:
         break
   }
   return subCardActions
}
