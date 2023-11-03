import { CORP_NAMES } from '../data/corpNames'
import { RESOURCES } from '../data/resources'

export const ACTIONS_PLAYER = {
   // Set whole state
   SET_STATE: 'Set state',
   // Set corporation
   CHANGE_CORPORATION: 'Change corporation',
   // Set Productions
   CHANGE_PROD_MLN: 'Increase production level of milions',
   CHANGE_PROD_STEEL: 'Increase production level of steel',
   CHANGE_PROD_TITAN: 'Increase production level of titan',
   CHANGE_PROD_PLANT: 'Increase production level of plants',
   CHANGE_PROD_ENERGY: 'Increase production level of energy',
   CHANGE_PROD_HEAT: 'Increase production level of heat',
   // Set Resources
   CHANGE_RES_MLN: 'Increase amount of milions',
   CHANGE_RES_STEEL: 'Increase amount of steel',
   CHANGE_RES_TITAN: 'Increase amount of titan',
   CHANGE_RES_PLANT: 'Increase amount of plants',
   CHANGE_RES_ENERGY: 'Increase amount of energy',
   CHANGE_RES_HEAT: 'Increase amount of heat',
   // Cards utils
   SET_CARDS_DECK: 'Set cards ids in deck',
   SET_CARDS_DRAW: 'Set cards ids in latest draw',
   SET_CARDS_IN_HAND: 'Set cards in hand',
   SET_CARDS_PLAYED: 'Set cards played',
   SET_CARDS_SEEN: 'Set cards seen',
   SET_CARDS_PURCHASED: 'Set cards purchase',
   // ================ For Log only ===============
   ADD_CARDS_IN_HAND: 'Add cards in hand',
   REMOVE_CARDS_IN_HAND: 'Remove cards in hand',
   ADD_CARDS_PLAYED: 'Add cards played',
   ADD_CARDS_SEEN: 'Add cards seen',
   ADD_CARDS_PURCHASED: 'Add cards purchased',
   REMOVE_CARDS_IN_DECK: 'Remove cards in deck',
   // =============================================
   SET_ACTION_USED: 'Set actionUsed parameter for aspecific card in played cards',
   ADD_BIO_RES: 'Add specific amount of specific bio resource to a specific card in played cards',
   SET_TRRAISED: 'Set trRaised parameter for UNMI only',
   // Set values of steel, titan and greenery
   CHANGE_VALUE_STEEL: 'Change steel value', // For advanced alloys
   CHANGE_VALUE_TITAN: 'Change titan value', // For advanced alloys AND phobolog
   SET_VALUE_GREENERY: 'Set greenery value', // For Ecoline
   // Set CanPayWithHeat
   SET_CANPAYWITHHEAT: 'Set true or false to the possibility of paying with heat (for Helion only)', // For Helion
   // Set globParamReqModifier
   CHANGE_PARAMETERS_REQUIREMENTS: 'Change global parameters requirements', // For Inventrix, Adaptation Technology and Special Design
   SET_SPECIAL_DESIGN_EFFECT: 'Set special design effect', // For Special Design card
   // Indentured Workers
   APPLY_INDENTURED_WORKERS_EFFECT: 'Decrease current cost of all cards by 8 (to a min of 0)',
   SET_INDENTURED_WORKERS: 'Set statePlayer.indenturedWorkersEffect',
   // Update VP
   UPDATE_VP: 'Update VP for a specific card',
   UPDATE_TOTALPOINTS: 'Update Total Points',
}

export const reducerPlayer = (state, action) => {
   switch (action.type) {
      // SET STATE
      case ACTIONS_PLAYER.SET_STATE:
         return action.payload
      // CHANGE CORPORATION
      case ACTIONS_PLAYER.CHANGE_CORPORATION:
         if (!action.payload) {
            return {
               ...state,
               corporation: null,
               production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
               resources: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
            }
         } else {
            return {
               ...state,
               corporation: action.payload,
               production: {
                  mln: action.payload.production.mln,
                  steel: action.payload.production.steel,
                  titan: action.payload.production.titan,
                  plant: action.payload.production.plant,
                  energy: action.payload.production.energy,
                  heat: action.payload.production.heat,
               },
               resources: {
                  mln: action.payload.resources.mln,
                  steel: action.payload.resources.steel,
                  titan: action.payload.resources.titan,
                  plant: action.payload.resources.plant,
                  energy: action.payload.resources.energy,
                  heat: action.payload.resources.heat,
               },
            }
         }
      // SET PRODUCTIONS
      case ACTIONS_PLAYER.CHANGE_PROD_MLN:
         return {
            ...state,
            production: {
               ...state.production,
               mln: state.production.mln + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_PROD_STEEL:
         return {
            ...state,
            production: {
               ...state.production,
               steel: state.production.steel + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_PROD_TITAN:
         return {
            ...state,
            production: {
               ...state.production,
               titan: state.production.titan + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_PROD_PLANT:
         return {
            ...state,
            production: {
               ...state.production,
               plant: state.production.plant + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_PROD_ENERGY:
         return {
            ...state,
            production: {
               ...state.production,
               energy: state.production.energy + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_PROD_HEAT:
         return {
            ...state,
            production: {
               ...state.production,
               heat: state.production.heat + action.payload,
            },
         }
      // SET RESOURCES
      case ACTIONS_PLAYER.CHANGE_RES_MLN:
         return {
            ...state,
            resources: {
               ...state.resources,
               mln: state.resources.mln + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_RES_STEEL:
         return {
            ...state,
            resources: {
               ...state.resources,
               steel: state.resources.steel + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_RES_TITAN:
         return {
            ...state,
            resources: {
               ...state.resources,
               titan: state.resources.titan + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_RES_PLANT:
         return {
            ...state,
            resources: {
               ...state.resources,
               plant: state.resources.plant + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_RES_ENERGY:
         return {
            ...state,
            resources: {
               ...state.resources,
               energy: state.resources.energy + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_RES_HEAT:
         return {
            ...state,
            resources: {
               ...state.resources,
               heat: state.resources.heat + action.payload,
            },
         }
      // SET CARDS IN HAND, CARDS PLAYED, CARDS SEEN AND CARDS PURCHASED
      case ACTIONS_PLAYER.SET_CARDS_DECK:
         return {
            ...state,
            cardsDeckIds: action.payload,
         }
      case ACTIONS_PLAYER.SET_CARDS_DRAW:
         return {
            ...state,
            cardsDrawIds: action.payload,
         }
      case ACTIONS_PLAYER.SET_CARDS_IN_HAND:
         return {
            ...state,
            cardsInHand: action.payload,
         }
      case ACTIONS_PLAYER.SET_CARDS_PLAYED:
         return {
            ...state,
            cardsPlayed: action.payload,
         }
      case ACTIONS_PLAYER.SET_CARDS_SEEN:
         return {
            ...state,
            cardsSeen: action.payload,
         }
      case ACTIONS_PLAYER.SET_CARDS_PURCHASED:
         return {
            ...state,
            cardsPurchased: action.payload,
         }
      // ================================ For Log only ==================================
      case ACTIONS_PLAYER.ADD_CARDS_IN_HAND:
         if (Array.isArray(action.payload)) {
            return { ...state, cardsInHand: [...state.cardsInHand, ...action.payload] }
         } else {
            return { ...state, cardsInHand: [...state.cardsInHand, [action.payload]] }
         }
      case ACTIONS_PLAYER.REMOVE_CARDS_IN_HAND:
         return {
            ...state,
            cardsInHand: state.cardsInHand.filter((c) => {
               if (Array.isArray(action.payload)) {
                  return !action.payload.includes(c.id)
               } else {
                  return c.id !== action.payload
               }
            }),
         }
      case ACTIONS_PLAYER.ADD_CARDS_PLAYED:
         if (Array.isArray(action.payload)) {
            return { ...state, cardsPlayed: [...state.cardsPlayed, ...action.payload] }
         } else {
            return { ...state, cardsPlayed: [...state.cardsPlayed, [action.payload]] }
         }
      case ACTIONS_PLAYER.ADD_CARDS_SEEN:
         if (Array.isArray(action.payload)) {
            return { ...state, cardsSeen: [...state.cardsSeen, ...action.payload] }
         } else {
            return { ...state, cardsSeen: [...state.cardsSeen, [action.payload]] }
         }
      case ACTIONS_PLAYER.ADD_CARDS_PURCHASED:
         if (Array.isArray(action.payload)) {
            return { ...state, cardsPurchased: [...state.cardsPurchased, ...action.payload] }
         } else {
            return { ...state, cardsPurchased: [...state.cardsPurchased, [action.payload]] }
         }
      case ACTIONS_PLAYER.REMOVE_CARDS_IN_DECK:
         return {
            ...state,
            cardsDeckIds: state.cardsDeckIds.filter((id) => {
               if (Array.isArray(action.payload)) {
                  return !action.payload.includes(id)
               } else {
                  return id !== action.payload
               }
            }),
         }
      // ================================================================================
      case ACTIONS_PLAYER.SET_ACTION_USED:
         // If payload.cardId === 'UNMI'
         if (action.payload.cardId === CORP_NAMES.UNMI) {
            return {
               ...state,
               corporation: {
                  ...state.corporation,
                  actionUsed: action.payload.actionUsed,
               },
            }
            // If payload.cardId is provided and it is not 'UNMI'
         } else if (action.payload.cardId !== undefined) {
            return {
               ...state,
               cardsPlayed: [
                  ...state.cardsPlayed.map((card) => {
                     if (card.id === action.payload.cardId) {
                        return { ...card, actionUsed: action.payload.actionUsed }
                     } else {
                        return { ...card }
                     }
                  }),
               ],
            }
            // If payload.cardId is not provided
         } else if (action.payload.cardId === undefined) {
            return {
               ...state,
               cardsPlayed: [
                  ...state.cardsPlayed.map((card) => ({
                     ...card,
                     actionUsed: action.payload.actionUsed,
                  })),
               ],
               corporation: {
                  ...state.corporation,
                  actionUsed: action.payload.actionUsed,
               },
            }
         }
         break
      case ACTIONS_PLAYER.ADD_BIO_RES:
         return {
            ...state,
            cardsPlayed: state.cardsPlayed.map((card) => {
               if (card.id === action.payload.cardId) {
                  if (action.payload.resource === RESOURCES.MICROBE) {
                     return {
                        ...card,
                        units: {
                           microbe: card.units.microbe + action.payload.amount,
                           animal: 0,
                           science: 0,
                           fighter: 0,
                        },
                     }
                  } else if (action.payload.resource === RESOURCES.ANIMAL) {
                     return {
                        ...card,
                        units: {
                           microbe: 0,
                           animal: card.units.animal + action.payload.amount,
                           science: 0,
                           fighter: 0,
                        },
                     }
                  } else if (action.payload.resource === RESOURCES.SCIENCE) {
                     return {
                        ...card,
                        units: {
                           microbe: 0,
                           animal: 0,
                           science: card.units.science + action.payload.amount,
                           fighter: 0,
                        },
                     }
                  } else if (action.payload.resource === RESOURCES.FIGHTER) {
                     return {
                        ...card,
                        units: {
                           microbe: 0,
                           animal: 0,
                           science: 0,
                           fighter: card.units.fighter + action.payload.amount,
                        },
                     }
                  }
               } else {
                  return card
               }
               return card
            }),
         }
      case ACTIONS_PLAYER.SET_TRRAISED:
         if (state.corporation.name === CORP_NAMES.UNMI) {
            return {
               ...state,
               corporation: {
                  ...state.corporation,
                  trRaised: action.payload,
               },
            }
         } else {
            return state
         }
      // SET VALUES OF STEEL, TITAN AND GREENERY
      case ACTIONS_PLAYER.CHANGE_VALUE_STEEL:
         return {
            ...state,
            valueSteel: state.valueSteel + action.payload,
         }
      case ACTIONS_PLAYER.CHANGE_VALUE_TITAN:
         return {
            ...state,
            valueTitan: state.valueTitan + action.payload,
         }
      case ACTIONS_PLAYER.SET_VALUE_GREENERY:
         return {
            ...state,
            valueGreenery: action.payload,
         }
      // CAN PAY WITH HEAT - HELION ONLY
      case ACTIONS_PLAYER.SET_CANPAYWITHHEAT:
         return {
            ...state,
            canPayWithHeat: action.payload,
         }
      // GLOBAL PARAMETERS REQUIREMENTS
      case ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS:
         return {
            ...state,
            globParamReqModifier: state.globParamReqModifier + action.payload,
         }
      case ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT:
         return {
            ...state,
            specialDesignEffect: action.payload,
         }
      // INDENTURED WORKERS
      case ACTIONS_PLAYER.APPLY_INDENTURED_WORKERS_EFFECT:
         return {
            ...state,
            cardsInHand: state.cardsInHand.map((card) => ({
               ...card,
               currentCost: Math.max(0, card.currentCost - 8),
            })),
            cardsPlayed: state.cardsPlayed.map((card) => ({
               ...card,
               currentCost: Math.max(0, card.currentCost - 8),
            })),
            indenturedWorkersEffect: true,
         }
      case ACTIONS_PLAYER.SET_INDENTURED_WORKERS:
         return {
            ...state,
            indenturedWorkersEffect: action.payload,
         }
      // UPDATE VP
      case ACTIONS_PLAYER.UPDATE_VP:
         return {
            ...state,
            cardsPlayed: state.cardsPlayed.map((card) => {
               if (card.id === action.payload.cardId) {
                  return { ...card, vp: action.payload.vp }
               } else {
                  return card
               }
            }),
         }
      case ACTIONS_PLAYER.UPDATE_TOTALPOINTS:
         return {
            ...state,
            totalPoints: action.payload,
         }
      default:
         return state
   }
}
