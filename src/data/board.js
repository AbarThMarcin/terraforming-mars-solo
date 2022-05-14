import { getNeighbors } from '../util/misc'
import { RESOURCES } from './resources'

export const TILES = {
   // Neutral tiles
   GREENERY_NEUTRAL: 'greenery-neutral',
   CITY_NEUTRAL: 'city-neutral',
   // Base tiles
   GREENERY: 'greenery',
   CITY: 'city',
   OCEAN: 'ocean',
   // Special tiles
   SPECIAL_CITY_CAPITAL: 'special-city-capital',
   SPECIAL_CITY_PHOBOS: 'special-city-phobos',
   SPECIAL_CITY_GANYMEDE: 'special-city-ganymede',
   SPECIAL_CITY_NOCTIS: 'special-city-noctis',
   SPECIAL_MINING_RIGHTS: 'special-mining-rights',
   SPECIAL_MINING_AREA: 'special-mining-area',
   SPECIAL_ECOLOGICAL_ZONE: 'special-ecological-zone',
   SPECIAL_NATURAL_PRESERVE: 'special-natural-preserve',
   SPECIAL_RESEARCH_OUTPOST: 'special-research-outpost',
   SPECIAL_MOHOLE_AREA: 'special-mohole-area',
   SPECIAL_RESTRICTED_AREA: 'special-restricted-area',
   SPECIAL_COMMERCIAL_DISTRICT: 'special-commercial-district',
   SPECIAL_NUCLEAR_ZONE: 'special-nuclear-zone',
   SPECIAL_INDUSTRIAL_CENTER: 'special-industrial-center',
   SPECIAL_LAVA_FLOWS: 'special-lava-flows',
   SPECIAL_URBANIZED_AREA: 'special-urbanized-area',
}

export const setAvailFieldsAny = (board) => {
   return board.map((field) => ({
      ...field,
      available:
         !field.object &&
         !field.oceanOnly &&
         field.name !== 'PHOBOS SPACE HAVEN' &&
         field.name !== 'GANYMEDE COLONY' &&
         field.name !== 'NOCTIC CITY',
   }))
}

export const setAvailFieldsSpecific = (board, tiles) => {
   return board.map((field) => ({
      ...field,
      available: !field.object && isIncluded(tiles, field),
   }))
}

export const setAvailFieldsAdjacent = (board, tiles, adjacent, isMiningArea = false) => {
   let allNeighbors = []
   tiles.forEach((tile) => {
      let tileNeighbors = []
      if (isMiningArea) {
         tileNeighbors = getNeighbors(tile.x, tile.y, board).filter(
            (tileNeighbor) =>
               tileNeighbor.bonus.includes(RESOURCES.STEEL) ||
               tileNeighbor.bonus.includes(RESOURCES.TITAN)
         )
      } else {
         tileNeighbors = getNeighbors(tile.x, tile.y, board)
      }

      allNeighbors = [...allNeighbors, ...tileNeighbors]
   })
   if (adjacent || isMiningArea) {
      return board.map((field) => ({
         ...field,
         available:
            !field.oceanOnly &&
            !field.object &&
            field.name !== 'PHOBOS SPACE HAVEN' &&
            field.name !== 'GANYMEDE COLONY' &&
            field.name !== 'NOCTIC CITY' &&
            isIncluded(allNeighbors, field),
      }))
   } else {
      return board.map((field) => ({
         ...field,
         available:
            !field.oceanOnly &&
            !field.object &&
            field.name !== 'PHOBOS SPACE HAVEN' &&
            field.name !== 'GANYMEDE COLONY' &&
            field.name !== 'NOCTIC CITY' &&
            !isIncluded(allNeighbors, field),
      }))
   }
}

function isIncluded(tiles, field) {
   let value = false
   tiles.forEach((tile) => {
      if (tile.x === field.x && tile.y === field.y && tile.name === field.name) {
         value = true
         return
      }
   })
   return value
}
