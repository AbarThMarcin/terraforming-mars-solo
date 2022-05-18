import {
   TILES,
   setAvailFieldsAny,
   setAvailFieldsSpecific,
   setAvailFieldsAdjacent,
} from '../data/board'
import { RESOURCES } from '../data/resources'
import { getNeighbors } from './misc'

export const ACTIONS_BOARD = {
   // Set available all fields based on the tile in payload
   SET_AVAILABLE: 'Changes available parameter to true based on the tile in payload',
   // Set specific field's object to a given object and make all fields unavailable
   SET_OBJECT: "Set specific field's object to a given object",
}

export const reducerBoard = (state, action) => {
   switch (action.type) {
      // Set available
      case ACTIONS_BOARD.SET_AVAILABLE:
         let board = JSON.parse(JSON.stringify(state))
         let tiles = []
         switch (action.payload) {
            case TILES.GREENERY:
               tiles = board.filter(
                  (field) =>
                     field.object !== null &&
                     field.object !== TILES.GREENERY_NEUTRAL &&
                     field.object !== TILES.CITY_NEUTRAL &&
                     field.object !== TILES.OCEAN
               )
               let availFields = JSON.parse(
                  JSON.stringify(
                     setAvailFieldsAdjacent(board, tiles, true).filter(
                        (field) => field.available === true
                     )
                  )
               )
               if (availFields.length > 0) {
                  return setAvailFieldsAdjacent(board, tiles, true)
               } else {
                  return setAvailFieldsAny(board)
               }
            case TILES.OCEAN:
            case TILES.SPECIAL_MOHOLE_AREA:
               tiles = board.filter((field) => !field.object && field.oceanOnly)
               return setAvailFieldsSpecific(board, tiles)
            case TILES.CITY:
            case TILES.SPECIAL_CITY_CAPITAL:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.CITY ||
                     field.object === TILES.CITY_NEUTRAL ||
                     field.object === TILES.SPECIAL_CITY_CAPITAL
               )
               return setAvailFieldsAdjacent(board, tiles, false)
            case TILES.SPECIAL_URBANIZED_AREA:
               tiles = board.filter((field) => {
                  let neighbors = getNeighbors(field.x, field.y, board)
                  return (
                     neighbors.filter(
                        (nb) =>
                           nb.object === TILES.CITY ||
                           nb.object === TILES.CITY_NEUTRAL ||
                           nb.object === TILES.SPECIAL_CITY_CAPITAL
                     ).length >= 2
                  )
               })
               return setAvailFieldsSpecific(board, tiles)
            case TILES.SPECIAL_MINING_RIGHTS:
               tiles = board.filter(
                  (field) =>
                     (field.bonus.includes(RESOURCES.STEEL) ||
                        field.bonus.includes(RESOURCES.TITAN)) &&
                     !field.oceanOnly
               )
               return setAvailFieldsSpecific(board, tiles)
            case TILES.SPECIAL_MINING_AREA:
               tiles = board.filter(
                  (field) =>
                     field.object !== null &&
                     field.object !== TILES.CITY_NEUTRAL &&
                     field.object !== TILES.OCEAN &&
                     field.object !== TILES.GREENERY_NEUTRAL &&
                     field.name !== 'PHOBOS SPACE HAVEN' &&
                     field.name !== 'GANYMEDE COLONY'
               )
               return setAvailFieldsAdjacent(board, tiles, true, true)
            case TILES.SPECIAL_RESTRICTED_AREA:
            case TILES.SPECIAL_COMMERCIAL_DISTRICT:
            case TILES.SPECIAL_NUCLEAR_ZONE:
               return setAvailFieldsAny(board)
            case TILES.SPECIAL_LAVA_FLOWS:
               tiles = board.filter(
                  (field) =>
                     field.name === 'THARSIS THOLUS' ||
                     field.name === 'ASCRAEUS MONS' ||
                     field.name === 'PAVONIS MONS' ||
                     field.name === 'ARSIA MONS'
               )
               return setAvailFieldsSpecific(board, tiles)
            case TILES.SPECIAL_ECOLOGICAL_ZONE:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.GREENERY || field.object === TILES.GREENERY_NEUTRAL
               )
               return setAvailFieldsAdjacent(board, tiles, true)
            case TILES.SPECIAL_NATURAL_PRESERVE:
            case TILES.SPECIAL_RESEARCH_OUTPOST:
               tiles = board.filter((field) => field.object !== null)
               return setAvailFieldsAdjacent(board, tiles, false)
            case TILES.SPECIAL_INDUSTRIAL_CENTER:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.CITY ||
                     field.object === TILES.CITY_NEUTRAL ||
                     field.object === TILES.SPECIAL_CITY_CAPITAL
               )
               return setAvailFieldsAdjacent(board, tiles)
            case TILES.SPECIAL_CITY_NOCTIS:
               tiles = board.filter((field) => field.name === 'NOCTIS CITY')
               return setAvailFieldsSpecific(board, tiles)
            case TILES.SPECIAL_CITY_PHOBOS:
               tiles = board.filter((field) => field.name === 'PHOBOS SPACE HAVEN')
               return setAvailFieldsSpecific(board, tiles)
            case TILES.SPECIAL_CITY_GANYMEDE:
               tiles = board.filter((field) => field.name === 'GANYMEDE COLONY')
               return setAvailFieldsSpecific(board, tiles)
            default:
               return state
         }
      // Set specific field's object to a given object and make all fields unavailable
      case ACTIONS_BOARD.SET_OBJECT:
         return state.map((field) => {
            if (
               field.x === action.payload.x &&
               field.y === action.payload.y &&
               field.name === action.payload.name
            ) {
               return { ...field, available: false, object: action.payload.obj }
            } else {
               return { ...field, available: false }
            }
         })
      default:
         return state
   }
}
