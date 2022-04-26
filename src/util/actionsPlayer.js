export const ACTIONS_PLAYER = {
   // Set corporation
   CHANGE_CORPORATION: 'Change corporation',
   // Set Productions
   CHANGE_PROD_MLN: 'Increase production level of milions',
   CHANGE_PROD_STEEL: 'Increase production level of steel',
   CHANGE_PROD_TITAN: 'Increase production level of titan',
   CHANGE_PROD_PLANTS: 'Increase production level of plants',
   CHANGE_PROD_POWER: 'Increase production level of power',
   CHANGE_PROD_HEAT: 'Increase production level of heat',
   // Set Resources
   CHANGE_RES_MLN: 'Increase amount of milions',
   CHANGE_RES_STEEL: 'Increase amount of steel',
   CHANGE_RES_TITAN: 'Increase amount of titan',
   CHANGE_RES_PLANTS: 'Increase amount of plants',
   CHANGE_RES_POWER: 'Increase amount of power',
   CHANGE_RES_HEAT: 'Increase amount of heat',
   // Set Cards in Hand and Cards Played
   SET_CARDS_IN_HAND: 'Set cards in hand',
   SET_CARDS_PLAYED: 'Set cards played',
   // Set card resources, tags, VP, actions and effects
   SET_CARD_RESOURCES: 'Set card resources',
   SET_TAGS: 'Set tags',
   SET_VP: 'Set VP',
   SET_ACTIONS: 'Set actions',
   SET_EFFECTS: 'Set effects',
   // Set values of steel, titan and greenery
   SET_VALUE_STEEL: 'Set steel value',
   SET_VALUE_TITAN: 'Set titan value',
   SET_VALUE_GREENERY: 'Set greenery value',
   // Set CanPayWithHeat
   SET_CANPAYWITHHEAT: 'Set true or false to the possibility of paying with heat (for Helion only)',
   // Set globParamReqModifier
   SET_PARAMETERS_REQUIREMENTS: 'Change global parameters requirements',
}

export const reducerPlayer = (state, action) => {
   switch (action.type) {
      // CHANGE CORPORATION
      case ACTIONS_PLAYER.CHANGE_CORPORATION:
         if (Object.keys(action.payload).length === 0) {
            return {}
         } else {
            return {
               ...state,
               corporation: action.payload,
               production: {
                  mln: action.payload.startingConditions.production.mln,
                  steel: action.payload.startingConditions.production.steel,
                  titan: action.payload.startingConditions.production.titan,
                  plants: action.payload.startingConditions.production.plants,
                  power: action.payload.startingConditions.production.power,
                  heat: action.payload.startingConditions.production.heat,
               },
               resources: {
                  mln: action.payload.startingConditions.resources.mln,
                  steel: action.payload.startingConditions.resources.steel,
                  titan: action.payload.startingConditions.resources.titan,
                  plants: action.payload.startingConditions.resources.plants,
                  power: action.payload.startingConditions.resources.power,
                  heat: action.payload.startingConditions.resources.heat,
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
      case ACTIONS_PLAYER.CHANGE_PROD_PLANTS:
         return {
            ...state,
            production: {
               ...state.production,
               plants: state.production.plants + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_PROD_POWER:
         return {
            ...state,
            production: {
               ...state.production,
               power: state.production.power + action.payload,
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
      case ACTIONS_PLAYER.CHANGE_RES_PLANTS:
         return {
            ...state,
            resources: {
               ...state.resources,
               plants: state.resources.plants + action.payload,
            },
         }
      case ACTIONS_PLAYER.CHANGE_RES_POWER:
         return {
            ...state,
            resources: {
               ...state.resources,
               power: state.resources.power + action.payload,
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
      // SET CARDS IN HAND AND CARDS PLAYED
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
      // SET CARD RESOURCES, TAGS, VP, ACTIONS AND EFFECTS
      case ACTIONS_PLAYER.SET_CARD_RESOURCES:
         return {
            ...state,
            cardResources: action.payload,
         }
      case ACTIONS_PLAYER.SET_TAGS:
         return {
            ...state,
            tags: action.payload,
         }
      case ACTIONS_PLAYER.SET_VP:
         return {
            ...state,
            vp: action.payload,
         }
      case ACTIONS_PLAYER.SET_ACTIONS:
         return {
            ...state,
            actions: action.payload,
         }
      case ACTIONS_PLAYER.SET_EFFECTS:
         return {
            ...state,
            effects: action.payload,
         }
      // SET VALUES OF STEEL, TITAN AND GREENERY
      case ACTIONS_PLAYER.SET_VALUE_STEEL:
         return {
            ...state,
            valueSteel: action.payload,
         }
      case ACTIONS_PLAYER.SET_VALUE_TITAN:
         return {
            ...state,
            valueTitan: action.payload,
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
      case ACTIONS_PLAYER.SET_PARAMETERS_REQUIREMENTS:
         return {
            ...state,
            globParamReqModifier: action.payload,
         }

      default:
         return state
   }
}