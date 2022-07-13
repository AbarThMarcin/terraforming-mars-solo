import {
   getAllResources,
   getCardsWithPossibleAnimals,
   getCardsWithPossibleMicrobes,
   getNeighbors,
   hasTag,
} from '../utils/misc'
import { ANIMATIONS } from './animations'
import { TILES, setAvailFieldsAdjacent, setAvailFieldsAny, setAvailFieldsSpecific } from './board'
import { CORP_NAMES } from './corpNames'
import { RESOURCES } from './resources'
import { OPTION_ICONS } from './selectOneOptions'
import { TAGS } from './tags'

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
   // Specific cards requirements
   ROBOTIC_WORKFORCE: 'robotic workforce',
   CEOS_FAVOURITE_PROJECT: "ceo's favourite project",
   RAD_SUITS: 'rad-suits',
   ECOLOGICAL_ZONE: 'ecological-zone',
}

export const funcRequirementsMet = (
   card,
   statePlayer,
   stateGame,
   stateBoard,
   modals,
   getImmEffects
) => {
   // If inappropiate state of the game is on, return false
   if (
      stateGame.phaseDraft ||
      stateGame.phaseViewGameState ||
      modals.sellCards ||
      stateGame.phasePlaceTile
   )
      return false
   // If cost is higher than current resources
   if (getAllResources(card, statePlayer) < card.currentCost) return false
   // Check other requirements
   let isAvailable = true
   let board = JSON.parse(JSON.stringify(stateBoard))
   let tiles = []
   card.requirements.forEach(({ type, value, other }) => {
      // Global parameters requirements
      if (type === REQUIREMENTS.TEMPERATURE) {
         if (
            other === 'max' &&
            stateGame.globalParameters.temperature -
               Math.abs(statePlayer.globParamReqModifier) * 2 >
               value
         ) {
            isAvailable = false
            return
         } else if (
            other === 'min' &&
            stateGame.globalParameters.temperature +
               Math.abs(statePlayer.globParamReqModifier) * 2 <
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
         const countTags =
            statePlayer.cardsPlayed.reduce(
               (total, card) =>
                  hasTag(card, other) && !hasTag(card, TAGS.EVENT) ? total + 1 : total,
               0
            ) + statePlayer.corporation.tags.filter((tag) => tag === other).length
         if (countTags < value) {
            isAvailable = false
            return
         }
         // Board requirements
      } else if (type === REQUIREMENTS.BOARD) {
         let availFields = []
         switch (other) {
            case TILES.CITY:
               tiles = board.filter(
                  (field) =>
                     field.object === TILES.CITY ||
                     field.object === TILES.CITY_NEUTRAL ||
                     field.object === TILES.SPECIAL_CITY_CAPITAL
               )
               availFields = setAvailFieldsAdjacent(board, tiles, false)
               break
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
               availFields = setAvailFieldsSpecific(board, tiles)
               break
            case TILES.SPECIAL_MINING_RIGHTS:
               tiles = board.filter(
                  (field) =>
                     (field.bonus.includes(RESOURCES.STEEL) ||
                        field.bonus.includes(RESOURCES.TITAN)) &&
                     !field.oceanOnly
               )
               availFields = setAvailFieldsSpecific(board, tiles)
               break
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
         // Specific cards requirements
      } else if (type === REQUIREMENTS.ROBOTIC_WORKFORCE) {
         let cards = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.BUILDING))
         cards = cards.filter((card) => {
            let isAnyProduction = false
            let prodReqMet = true
            if (card.id === 64 || card.id === 67) return true // If Mining rights or Mining Area, always include those productions
            let immEffects = getImmEffects(card.id)
            immEffects.forEach((immEffect) => {
               if (immEffect.name === ANIMATIONS.PRODUCTION_IN) {
                  isAnyProduction = true
               } else if (immEffect.name === ANIMATIONS.PRODUCTION_OUT) {
                  isAnyProduction = true
                  if (
                     immEffect.type === RESOURCES.MLN &&
                     statePlayer.production.mln - immEffect.value < -5
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.STEEL &&
                     statePlayer.production.steel < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.TITAN &&
                     statePlayer.production.steel < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.PLANT &&
                     statePlayer.production.plant < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.ENERGY &&
                     statePlayer.production.energy < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.HEAT &&
                     statePlayer.production.heat < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  }
               }
            })
            return isAnyProduction && prodReqMet
         })
         if (cards.length === 0 && statePlayer.corporation.name !== CORP_NAMES.MINING_GUILD) {
            isAvailable = false
            return
         }
      } else if (type === REQUIREMENTS.CEOS_FAVOURITE_PROJECT) {
         let cards = statePlayer.cardsPlayed.filter(
            (card) =>
               card.units.microbe > 0 ||
               card.units.animal > 0 ||
               card.units.science > 0 ||
               card.units.fighter > 0
         )
         if (cards.length === 0) {
            isAvailable = false
            return
         }
      } else if (type === REQUIREMENTS.RAD_SUITS) {
         tiles = board.filter(
            (field) =>
               field.object === TILES.CITY ||
               field.object === TILES.CITY_NEUTRAL ||
               field.object === TILES.SPECIAL_CITY_CAPITAL
         )
         if (tiles.length < 2) {
            isAvailable = false
            return
         }
      } else if (type === REQUIREMENTS.ECOLOGICAL_ZONE) {
         tiles = board.filter((field) => field.object === TILES.GREENERY)
         if (tiles.length === 0) {
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
   // ================== If specific phase of the game is on ==============
   if (
      stateGame.phaseDraft ||
      stateGame.phaseViewGameState ||
      modals.sellCards ||
      stateGame.phasePlaceTile
   )
      return false
   // UNMI check if tr has been raised
   if (item.name === CORP_NAMES.UNMI) {
      if (!item.trRaised) return false
   } else {
      // ================= Check specific card requirements ===================
      let value
      let cards = []
      switch (item.id) {
         // Search For Life
         case 5:
            value = statePlayer.resources.mln
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 1) reqMet = false
            break
         // Martian Rails, Development Center
         case 7:
         case 14:
            value = statePlayer.resources.energy
            if (value < 1) reqMet = false
            break
         // Water Import From Europa
         case 12:
            value = statePlayer.resources.mln + statePlayer.resources.titan * statePlayer.valueTitan
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 12 || stateGame.globalParameters.oceans === 9) reqMet = false
            break
         // Space Elevator
         case 13:
            value = statePlayer.resources.steel
            if (value < 1) reqMet = false
            break
         // Equatorial Magnetizer
         case 15:
            value = statePlayer.production.energy
            if (value < 1) reqMet = false
            break
         // Security Fleet
         case 28:
            value = statePlayer.resources.titan
            if (value < 1) reqMet = false
            break
         // Electro Catapult
         case 69:
            value = statePlayer.resources.plant + statePlayer.resources.steel
            if (value < 1) reqMet = false
            break
         // Space Mirrors and Industrial Center
         case 76:
         case 123:
            value = statePlayer.resources.mln
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 7) reqMet = false
            break
         // Physics Complex
         case 95:
            value = statePlayer.resources.energy
            if (value < 6) reqMet = false
            break
         // Ironworks, Steelworks, Ore Processor
         case 101:
         case 103:
         case 104:
            value = statePlayer.resources.energy
            if (value < 4 || stateGame.globalParameters.oxygen === 14) reqMet = false
            break
         // Symbiotic Fungus
         case 133:
            cards = getCardsWithPossibleMicrobes(statePlayer)
            if (cards.length === 0) reqMet = false
            break
         // Caretaker Contract
         case 154:
            value = statePlayer.resources.heat
            if (value < 8 || stateGame.globalParameters.temperature === 8) reqMet = false
            break
         // Water Splitting Plant
         case 177:
            value = statePlayer.resources.energy
            if (value < 3 || stateGame.globalParameters.oxygen === 14) reqMet = false
            break
         // Aquifer Pumping
         case 187:
            value = statePlayer.resources.mln + statePlayer.resources.steel * statePlayer.valueSteel
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 8 || stateGame.globalParameters.oceans === 9) reqMet = false
            break
         // Power Infrastructure
         case 194:
            if (statePlayer.resources.energy === 0) reqMet = false
            break
         // Restricted Area
         case 199:
            value = statePlayer.resources.mln
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 2) reqMet = false
            break
         // Underground Detonations
         case 202:
            value = statePlayer.resources.mln
            if (statePlayer.canPayWithHeat) value += statePlayer.resources.heat
            if (value < 10) reqMet = false
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
      case OPTION_ICONS.CARD19_OPTION2:
      case OPTION_ICONS.CARD134_OPTION2:
         cards = getCardsWithPossibleMicrobes(statePlayer)
         if (cards.length === 0) reqMet = false
         break
      case OPTION_ICONS.CARD19_OPTION3:
      case OPTION_ICONS.CARD143_OPTION2:
      case OPTION_ICONS.CARD190_OPTION2:
         cards = getCardsWithPossibleAnimals(statePlayer)
         if (cards.length === 0) reqMet = false
         break
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
      case OPTION_ICONS.CARD157_OPTION2:
         card = statePlayer.cardsPlayed.find((card) => card.id === 157)
         if (card.units.microbe < 3) reqMet = false
         break
      default:
         break
   }
   return reqMet
}
