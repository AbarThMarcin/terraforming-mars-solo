import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ACTIONS_GAME } from '../util/actionsGame'
import { ANIMATIONS } from './animations'
import { TILES } from './board'
import { ACTIONS_BOARD } from '../util/actionsBoard'
import { RESOURCES } from './resources'

export const IMM_EFFECTS = {
   POWER_PLANT: 'Increase energy production 1 step',
   TEMPERATURE: 'Increase temperature by 2 degrees',
   AQUIFER: 'Place an ocean',
   GREENERY: 'Place greenery and increase oxygen by 1%',
   CITY: 'Place a city',
}

export const funcGetImmEffects = (
   actionOrCardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   stateBoard,
   dispatchBoard,
   modals,
   setModals
) => {
   let subActions = []
   switch (actionOrCardId) {
      // =================== SP POWER PLANT ===================
      case IMM_EFFECTS.POWER_PLANT:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 }),
         })
         break
      // =================== INCREASE TEMPERATURE BY 2 DEGREES ===================
      case IMM_EFFECTS.TEMPERATURE:
         if (stateGame.globalParameters.temperature < 8) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat production
            if (
               stateGame.globalParameters.temperature === -26 ||
               stateGame.globalParameters.temperature === -22
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
               })
               // Bonus ocean
            } else if (stateGame.globalParameters.temperature === -2) {
               subActions = [
                  ...subActions,
                  ...funcGetImmEffects(
                     IMM_EFFECTS.AQUIFER,
                     statePlayer,
                     dispatchPlayer,
                     stateGame,
                     dispatchGame,
                     stateBoard,
                     dispatchBoard,
                     modals,
                     setModals
                  ),
               ]
            }
         }
         break
      // =================== PLACE OCEAN TILE ===================
      case IMM_EFFECTS.AQUIFER:
         if (stateGame.globalParameters.oceans < 9) {
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
                  dispatchGame({
                     type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                     payload: TILES.OCEAN,
                  })
                  dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.OCEAN })
               },
            })
            // Increase oceans meter
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         break
      // =================== PLACE GREENERY TILE ===================
      case IMM_EFFECTS.GREENERY:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.GREENERY,
               })
               dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.GREENERY })
            },
         })
         // Increase oxygen
         if (stateGame.globalParameters.oxygen < 14) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         // Bonus temperature
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature < 8
         ) {
            subActions = [
               ...subActions,
               ...funcGetImmEffects(
                  IMM_EFFECTS.TEMPERATURE,
                  statePlayer,
                  dispatchPlayer,
                  stateGame,
                  dispatchGame,
                  stateBoard,
                  dispatchBoard,
                  modals,
                  setModals
               ),
            ]
         }
         break
      // =================== PLACE CITY TILE ===================
      case IMM_EFFECTS.CITY:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.CITY })
            },
         })
         break
      // =================== CARD IMMEDIATE EFFECTS ==================
      // GHG Factories
      case 126:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: -1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 }),
         })
         break
      // Research Outpost
      case 20:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_RESEARCH_OUTPOST,
               })
            },
         })
         break
      // Open City
      case 108:
         subActions = [
            ...subActions,
            ...funcGetImmEffects(
               IMM_EFFECTS.CITY,
               statePlayer,
               dispatchPlayer,
               stateGame,
               dispatchGame,
               stateBoard,
               dispatchBoard,
               modals,
               setModals
            ),
         ]
         break
      case 8:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_CITY_CAPITAL,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_CITY_CAPITAL,
               })
            },
         })
         break
      default:
         break
   }
   return subActions
}
