import { getNeighbors } from '../utils/board'
import { RESOURCES } from './resources'

import city from '../assets/images/tiles/tile_city.svg'
import cityNeutral from '../assets/images/tiles/tile_cityNeutral.svg'
import greenery from '../assets/images/tiles/tile_greenery.svg'
import greeneryNeutral from '../assets/images/tiles/tile_greeneryNeutral.svg'
import ocean from '../assets/images/tiles/tile_ocean.svg'
import cityCapital from '../assets/images/tiles/tile_cityCapital.svg'
import miningRightsArea from '../assets/images/tiles/tile_miningRightsArea.svg'
import ecologicalZone from '../assets/images/tiles/tile_ecologicalZone.svg'
import naturalPreserve from '../assets/images/tiles/tile_naturalPreserve.svg'
import moholeArea from '../assets/images/tiles/tile_moholeArea.svg'
import restrictedArea from '../assets/images/tiles/tile_restrictedArea.svg'
import commercialDistrict from '../assets/images/tiles/tile_commercialDistrict.svg'
import nuclearZone from '../assets/images/tiles/tile_nuclearZone.svg'
import industrialCenter from '../assets/images/tiles/tile_industrialCenter.svg'
import lavaFlows from '../assets/images/tiles/tile_lavaFlows.svg'

export const TILES = {
   // Neutral tiles
   GREENERY_NEUTRAL: 'NEUTRAL GREENERY',
   CITY_NEUTRAL: 'NEUTRAL CITY',
   // Base tiles
   GREENERY: 'GREENERY',
   CITY: 'CITY',
   OCEAN: 'OCEAN',
   // Special tiles
   SPECIAL_CITY_CAPITAL: 'CAPITAL CITY',
   SPECIAL_CITY_PHOBOS: 'CITY ON PHOBOS',
   SPECIAL_CITY_GANYMEDE: 'CITY ON GANYMEDE',
   SPECIAL_CITY_NOCTIS: 'NOCTIS CITY',
   SPECIAL_MINING_RIGHTS: 'MINING RIGHTS TILE',
   SPECIAL_MINING_AREA: 'MINING AREA TILE',
   SPECIAL_ECOLOGICAL_ZONE: 'ECOLOGICAL ZONE TILE',
   SPECIAL_NATURAL_PRESERVE: 'NATURAL PRESERVE TILE',
   SPECIAL_RESEARCH_OUTPOST: 'RESEARCH OUTPOST TILE',
   SPECIAL_MOHOLE_AREA: 'MOHOLE AREA TILE',
   SPECIAL_RESTRICTED_AREA: 'RESTRICTED AREA TILE',
   SPECIAL_COMMERCIAL_DISTRICT: 'COMMERCIAL DISTRICT TILE',
   SPECIAL_NUCLEAR_ZONE: 'NUCLEAR ZONE TILE',
   SPECIAL_INDUSTRIAL_CENTER: 'INDUSTRIAL CENTER TILE',
   SPECIAL_LAVA_FLOWS: 'LAVA FLOWS TILE',
   SPECIAL_URBANIZED_AREA: 'URBANIZED AREA TILE',
}

export const assignIconToTileData = (fieldObject) => {
   switch (fieldObject) {
      case TILES.OCEAN:
         return ocean
      case TILES.GREENERY:
         return greenery
      case TILES.GREENERY_NEUTRAL:
         return greeneryNeutral
      case TILES.CITY:
         return city
      case TILES.CITY_NEUTRAL:
         return cityNeutral
      case TILES.SPECIAL_CITY_CAPITAL:
         return cityCapital
      case TILES.SPECIAL_NATURAL_PRESERVE:
         return naturalPreserve
      case TILES.SPECIAL_MINING_AREA:
      case TILES.SPECIAL_MINING_RIGHTS:
         return miningRightsArea
      case TILES.SPECIAL_COMMERCIAL_DISTRICT:
         return commercialDistrict
      case TILES.SPECIAL_NUCLEAR_ZONE:
         return nuclearZone
      case TILES.SPECIAL_INDUSTRIAL_CENTER:
         return industrialCenter
      case TILES.SPECIAL_ECOLOGICAL_ZONE:
         return ecologicalZone
      case TILES.SPECIAL_LAVA_FLOWS:
         return lavaFlows
      case TILES.SPECIAL_MOHOLE_AREA:
         return moholeArea
      case TILES.SPECIAL_RESTRICTED_AREA:
         return restrictedArea
      default:
         return
   }
}

export const setAvailFieldsAny = (board) => {
   return board.map((field) => ({
      ...field,
      available: !field.object && !field.oceanOnly && field.name !== 'PHOBOS SPACE HAVEN' && field.name !== 'GANYMEDE COLONY' && field.name !== 'NOCTIS CITY',
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
         tileNeighbors = getNeighbors(tile.x, tile.y, board).filter((tileNeighbor) => tileNeighbor.bonus.includes(RESOURCES.STEEL) || tileNeighbor.bonus.includes(RESOURCES.TITAN))
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
            field.name !== 'NOCTIS CITY' &&
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
            field.name !== 'NOCTIS CITY' &&
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
