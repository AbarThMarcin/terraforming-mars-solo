import { getAllResources } from '../util/misc'
import { TILES, setAvailFieldsAdjacent, setAvailFieldsAny, setAvailFieldsSpecific } from './board'
import { RESOURCES } from './resources'

export const REQUIREMENTS = {
   // Global parameters requirements
   TEMPERATURE: 'temperature',
   OXYGEN: 'oxygen',
   OCEAN: 'ocean',
   // Production requirements
   PRODUCTION: 'production',
   // Resources requirements
   RESOURCES: 'resources',
   // Tags requirements
   TAGS: 'tags',
   // Board requirements
   BOARD: 'board',
}

export const funcRequirementsMet = (card, statePlayer, stateGame, stateBoard, modals) => {
   // Cost requirement
   if (getAllResources(card, statePlayer) < card.currentCost) return false
   // If inappropiate state of the game is on, return false
   if (
      stateGame.phaseDraft ||
      stateGame.phaseViewGameState ||
      modals.sellCards ||
      stateGame.phasePlaceTile
   )
      return false
   // Check other requirements
   let isAvailable = true
   card.requirements.forEach(({ type, value, other }) => {
      // Global parameters requirements
      if (type === REQUIREMENTS.TEMPERATURE) {
         if (
            other === 'max' &&
            stateGame.globalParameters.temperature - Math.abs(statePlayer.globParamReqModifier) >
               value
         ) {
            isAvailable = false
            return
         } else if (
            other === 'min' &&
            stateGame.globalParameters.temperature + Math.abs(statePlayer.globParamReqModifier) <
               value
         ) {
            isAvailable = false
            return
         }
      } else if (type === REQUIREMENTS.OXYGEN) {
         if (
            other === 'max' &&
            stateGame.globalParameters.oxygen - Math.abs(statePlayer.globParamReqModifier) > value
         ) {
            isAvailable = false
            return
         } else if (
            other === 'min' &&
            stateGame.globalParameters.oxygen + Math.abs(statePlayer.globParamReqModifier) < value
         ) {
            isAvailable = false
            return
         }
      } else if (type === REQUIREMENTS.OCEAN) {
         if (
            other === 'max' &&
            stateGame.globalParameters.oceans - Math.abs(statePlayer.globParamReqModifier) > value
         ) {
            isAvailable = false
            return
         } else if (
            other === 'min' &&
            stateGame.globalParameters.oceans + Math.abs(statePlayer.globParamReqModifier) < value
         ) {
            isAvailable = false
            return
         }
         // Production requirements
      } else if (type === REQUIREMENTS.PRODUCTION) {
         switch (other) {
            case RESOURCES.MLN:
               if (statePlayer.production.mln < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.STEEL:
               if (statePlayer.production.steel < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.TITAN:
               if (statePlayer.production.titan < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.PLANT:
               if (statePlayer.production.plant < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.ENERGY:
               if (statePlayer.production.energy < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.HEAT:
               if (statePlayer.production.heat < value) {
                  isAvailable = false
                  return
               }
               break
            default:
               break
         }
         // Resources requirements
      } else if (type === REQUIREMENTS.RESOURCES) {
         switch (other) {
            case RESOURCES.MLN:
               if (statePlayer.resources.mln < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.STEEL:
               if (statePlayer.resources.steel < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.TITAN:
               if (statePlayer.resources.titan < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.PLANT:
               if (statePlayer.resources.plant < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.ENERGY:
               if (statePlayer.resources.energy < value) {
                  isAvailable = false
                  return
               }
               break
            case RESOURCES.HEAT:
               if (statePlayer.resources.heat < value) {
                  isAvailable = false
                  return
               }
               break
            default:
               return
         }
         // Tags requirements
      } else if (type === REQUIREMENTS.TAGS) {
         const countTags = statePlayer.tags.reduce(
            (total, v) => (v === other ? total + 1 : total),
            0
         )
         if (countTags < value) {
            isAvailable = false
            return
         }
         // Board requirements
      } else if (type === REQUIREMENTS.BOARD) {
         let board = JSON.parse(JSON.stringify(stateBoard))
         let availFields = []
         let tiles = []
         switch (other) {
            case TILES.CITY:
            case TILES.SPECIAL_CITY_CAPITAL:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.CITY ||
                     field.object === TILES.CITY_NEUTRAL ||
                     field.object === TILES.SPECIAL_CITY_CAPITAL
               )
               availFields = setAvailFieldsAdjacent(board, tiles, false)
               break
            case TILES.SPECIAL_CITY_NOCTIS:
               tiles = board.filter((field) => field.name === 'NOCTIC CITY')
               availFields = setAvailFieldsSpecific(board, tiles)
               break
            case TILES.SPECIAL_CITY_PHOBOS:
               tiles = board.filter((field) => field.name === 'PHOBOS SPACE HAVEN')
               availFields = setAvailFieldsSpecific(board, tiles)
               break
            case TILES.SPECIAL_CITY_GANYMEDE:
               tiles = board.filter((field) => field.name === 'GANYMEDE COLONY')
               availFields = setAvailFieldsSpecific(board, tiles)
               break
            case TILES.SPECIAL_MINING_RIGHTS:
               tiles = board.filter(
                  (field) =>
                     field.bonus.includes(RESOURCES.STEEL) || field.bonus.includes(RESOURCES.TITAN)
               )
               availFields = setAvailFieldsAdjacent(board, tiles, true)
               break
            case TILES.SPECIAL_MINING_AREA:
               tiles = board.filter(
                  (field) =>
                     field.bonus.includes(RESOURCES.STEEL) || field.bonus.includes(RESOURCES.TITAN)
               )
               availFields = setAvailFieldsAdjacent(board, tiles, true, true)
               break
            case TILES.SPECIAL_ECOLOGICAL_ZONE:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.GREENERY || field.object === TILES.GREENERY_NEUTRAL
               )
               availFields = setAvailFieldsAdjacent(board, tiles, true)
               break
            case TILES.SPECIAL_NATURAL_PRESERVE:
            case TILES.SPECIAL_RESEARCH_OUTPOST:
               tiles = board.filter((field) => field.object !== null)
               availFields = setAvailFieldsAdjacent(board, tiles, false)
               break
            case TILES.SPECIAL_MOHOLE_AREA:
               tiles = board.filter((field) => !field.object && field.oceanOnly)
               availFields = setAvailFieldsSpecific(board, tiles)
               break
            case TILES.GREENERY:
            case TILES.SPECIAL_RESTRICTED_AREA:
            case TILES.SPECIAL_COMMERCIAL_DISTRICT:
            case TILES.SPECIAL_NUCLEAR_ZONE:
               availFields = setAvailFieldsAny(board)
               break
            case TILES.SPECIAL_INDUSTRIAL_CENTER:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.CITY ||
                     field.object === TILES.CITY_NEUTRAL ||
                     field.object === TILES.SPECIAL_CITY_CAPITAL
               )
               availFields = setAvailFieldsAdjacent(board, tiles)
               break
            case TILES.SPECIAL_LAVA_FLOWS:
               tiles = board.filter(
                  (field) =>
                     field.name === 'THARSIS THOLUS' ||
                     field.name === 'ASCRAEUS MONS' ||
                     field.name === 'PAVONIS MONS' ||
                     field.name === 'ARSIA MONS'
               )
               availFields = setAvailFieldsSpecific(board, tiles)
               break
            default:
               break
         }
         availFields = availFields.filter((field) => field.available === true)
         if (availFields.length === 0) {
            isAvailable = false
            return
         }
      }
   })
   return isAvailable
}

export const funcActionRequirementsMet = (item, statePlayer, stateGame, modals) => {
   // If already used, return false
   if (item.actionUsed) return false
   // If inappropiate state of the game is on
   if (
      stateGame.phaseDraft ||
      stateGame.phaseViewGameState ||
      modals.sellCards ||
      stateGame.phasePlaceTile
   )
      return false
   // UNMI check if tr has been raised
   if (item.name === 'UNMI') {
      if (!item.trRaised) return false
   } else {
      // Check specific card requirements
      switch (item) {
         case 1:
            return false
         default:
            break
      }
   }

   return true
}
