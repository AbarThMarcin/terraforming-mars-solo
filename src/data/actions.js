import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ACTIONS_GAME } from '../util/actionsGame'
import { INIT_ANIMATION_DATA } from '../initStates/initModals'
import { ANIMATIONS, setAnimation } from './animations'
import { TILE_NAMES } from './board'
import { ACTIONS_BOARD } from '../util/actionsBoard'

export const ACTIONS = {
   SP_POWER_PLANT: 'Increase energy production 1 step',
   SP_ASTEROID: 'Increase temperature by 2 degrees',
   SP_AQUIFER: 'Place an ocean',
   SP_GREENERY: 'Place greenery and increase oxygen by 1%',
   SP_CITY: 'Place a city',
   CONVERT_HEAT: 'Convert heat into temperature',
   CONVERT_PLANTS: 'Convert plants into greenery',
}

export const doAction = (
   actionOrCardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   stateBoard,
   dispatchBoard,
   modals,
   setModals,
   actionPart,
   setActionPart,
   ANIMATION_SPEED
) => {
   let subActions = []
   switch (actionOrCardId) {
      // STANDARD PROJECT ACTIONS
      case ACTIONS.SP_POWER_PLANT:
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_POWER, payload: 1 })
         break
      case ACTIONS.SP_ASTEROID:
         if (stateGame.globalParameters.temperature < 8)
            dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
         break
      case ACTIONS.SP_AQUIFER:
         break
      case ACTIONS.SP_GREENERY:
         break
      case ACTIONS.SP_CITY:
         break
      // CONVERT HEAT TO TEMPERATURE ACTION
      case ACTIONS.CONVERT_HEAT:
         if (stateGame.globalParameters.temperature < 8)
            dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
         break
      // CONVERT PLANTS TO GREENERY ACTION
      case ACTIONS.CONVERT_PLANTS:
         dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
         dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA, payload: TILE_NAMES.GREENERY })
         dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILE_NAMES.GREENERY })
         dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
         break
      case 126:
         subActions.push({
            name: ANIMATIONS.NAMES.PRODUCTION_OUT,
            type: ANIMATIONS.TYPES.POWER,
            value: -1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_POWER, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.NAMES.PRODUCTION_IN,
            type: ANIMATIONS.TYPES.HEAT,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 }),
         })
         break
      default:
         break
   }
   performSubActions(subActions, ANIMATION_SPEED, modals, setModals)
}

function performSubActions(subActions, ANIMATION_SPEED, modals, setModals) {
   // Start animation
   setModals((prevModals) => ({ ...prevModals, animation: true }))
   // Loop through all subactions
   for (let i = 0; i < subActions.length; i++) {
      // Execute animation
      setTimeout(() => {
         setAnimation(subActions, i, setModals)
      }, i * ANIMATION_SPEED)
      // Execute action
      setTimeout(() => {
         subActions[i].func()
      }, (i + 1) * ANIMATION_SPEED)
   }
   // End animation
   setTimeout(() => {
      setModals((prevModals) => ({
         ...prevModals,
         animation: false,
         animationData: INIT_ANIMATION_DATA,
      }))
   }, subActions.length * ANIMATION_SPEED)
}






// zrobic kolejnosc subakcji z interakcją gracza. Da sie tak chyba tylko tworzac dodac jakis numer subakcji do stateGame czy cos...
