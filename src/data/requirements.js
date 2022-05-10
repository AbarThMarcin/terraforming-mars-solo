import {
   getAllResources,
   getAllResourcesForAction,
   getCardsWithPossibleAnimals,
   getCardsWithPossibleMicrobes,
} from '../util/misc'
import { TILES, setAvailFieldsAdjacent, setAvailFieldsAny, setAvailFieldsSpecific } from './board'
import { RESOURCES } from './resources'
import { OPTION_ICONS } from './selectOneOptions'

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

export const funcRequirementsMet = (
   card,
   statePlayer,
   stateGame,
   stateBoard,
   modals,
   cost,
   actionClicked
) => {
   // Cost requirement
   if (cost !== undefined) {
      if (getAllResourcesForAction(actionClicked, statePlayer) < cost) return false
      return true
   } else {
      if (getAllResources(card, statePlayer) < card.currentCost) return false
   }
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

export const funcActionRequirementsMet = (item, statePlayer, stateGame, modals, stateBoard) => {
   let reqMet = true
   // ===================== If already used, return false =====================
   if (item.actionUsed) return false
   // ==================If inappropiate state of the game is on ===============
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
      // ================= Check specific card requirements ===================
      let value
      let cards = []
      switch (item.id) {
         // Search For Life
         case 5:
            value = statePlayer.resources.mln
            if (value < 1) reqMet = false
            break
         // Martian Rails
         case 7:
            value = statePlayer.resources.energy
            if (value < 1) reqMet = false
            break
         // Water Import From Europa
         case 12:
            value = statePlayer.resources.mln + statePlayer.resources.titan * statePlayer.valueTitan
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 12 || stateGame.globalParameters.oceans === 9) reqMet = false
            break
         // Symbiotic Fungus
         case 133:
            cards = getCardsWithPossibleMicrobes(statePlayer)
            if (cards.length === 0) reqMet = false
            break
         // Aquifer Pumping
         case 187:
            value = statePlayer.resources.mln + statePlayer.resources.steel * statePlayer.valueSteel
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 8 || stateGame.globalParameters.oceans === 9) reqMet = false
            break
         default:
            break
      }
   }

   return reqMet
}

export const funcOptionRequirementsMet = (option, statePlayer) => {
   let reqMet = true
   let card = []
   let cards = []
   switch (option) {
      case OPTION_ICONS.CARD33_OPTION2:
         card = statePlayer.cardsPlayed.find((card) => card.id === 33)
         if (card.units.microbe < 2) reqMet = false
         break
      case OPTION_ICONS.CARD34_OPTION2:
         card = statePlayer.cardsPlayed.find((card) => card.id === 34)
         if (card.units.microbe < 2) reqMet = false
         break
      case OPTION_ICONS.CARD69_OPTION1:
         if (statePlayer.resources.plant === 0) reqMet = false
         break
      case OPTION_ICONS.CARD69_OPTION2:
         if (statePlayer.resources.steel === 0) reqMet = false
         break
      case OPTION_ICONS.CARD134_OPTION2:
         cards = getCardsWithPossibleMicrobes(statePlayer)
         if (cards.length === 0) reqMet = false
         break
      case OPTION_ICONS.CARD143_OPTION2:
      case OPTION_ICONS.CARD190_OPTION2:
         cards = getCardsWithPossibleAnimals(statePlayer)
         if (cards.length === 0) reqMet = false
         break
      case OPTION_ICONS.CARD157_OPTION2:
         card = statePlayer.cardsPlayed.find((card) => card.id === 157)
         if (card.units.microbe < 3) reqMet = false
         break
      default:
         break
   }
   return reqMet
}
