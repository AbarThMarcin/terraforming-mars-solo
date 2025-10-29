import { SP, getNameOfSP } from '../data/StandardProjects'
import { TILES } from '../data/board'
import { CARDS } from '../data/cards'
import { CORP_NAMES } from '../data/corpNames'
import { EFFECTS } from '../data/effects/effectIcons'
import { getSPeffectsToCall, performImmediateCorpEffect } from '../data/effects/effects'
import { IMM_EFFECTS } from '../data/immEffects/immEffects'
import { LOG_ICONS, LOG_TYPES } from '../data/log'
import { RESOURCES } from '../data/resources'
import { OPTION_ICONS } from '../data/selectOneOptions'
import { TAGS } from '../data/tags'
import { INIT_MODALS } from '../initStates/initModals'
import { INIT_STATE_GAME } from '../initStates/initStateGame'
import { INIT_STATE_PLAYER } from '../initStates/initStatePlayer'
import { ACTIONS_BOARD, reducerBoard } from '../stateActions/actionsBoard'
import { ACTIONS_GAME, reducerGame } from '../stateActions/actionsGame'
import { ACTIONS_PLAYER, reducerPlayer } from '../stateActions/actionsPlayer'
import { range } from './array'
import { getField, getNeighbors } from './board'
import { canCardHaveAnimals, canCardHaveMicrobes, canCardHaveScience, getCards, getCardsWithDecreasedCost, getCardsWithTimeAdded, getCardsWithTimePlayed, hasTag } from './cards'
import { getCorporationById } from './corporation'
import { updateVP } from './points'

// Functions to convert main statePlayer (not in logItems) between the version in game and the version in DB in active game
// For active game there are two below functions that convert WHOLE statePlayer states, while conversion between game and
// ended game are done for cards only (because there are no "current" states for ended games)
export const getThinerStatePlayerForActive = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      ...newStatePlayer,
      corporation: newStatePlayer.corporation ? newStatePlayer.corporation.id : null,
      cardsInHand: newStatePlayer.cardsInHand.map((c) => getThinerCardForActive(c)),
      cardsPlayed: newStatePlayer.cardsPlayed.map((c) => getThinerCardForActive(c)),
      cardsSeen: newStatePlayer.cardsSeen.map((c) => getThinerCardForActive(c)),
      cardsPurchased: newStatePlayer.cardsPurchased.map((c) => getThinerCardForActive(c)),
   }

   return newStatePlayer
}
export const getStatePlayerWithAllDataFromActive = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      ...newStatePlayer,
      corporation: getCorporationById(newStatePlayer.corporation),
      cardsInHand: newStatePlayer.cardsInHand.map((c) => getFullCardFromThiner(c)),
      cardsPlayed: newStatePlayer.cardsPlayed.map((c) => getFullCardFromThiner(c)),
      cardsSeen: newStatePlayer.cardsSeen.map((c) => getFullCardFromThiner(c)),
      cardsPurchased: newStatePlayer.cardsPurchased.map((c) => getFullCardFromThiner(c)),
   }
   return newStatePlayer
}
const getFullCardFromThiner = (thinerCard) => {
   return { ...CARDS[thinerCard.id - 1], ...thinerCard }
}
// -------------------------------------------------------------------------------------------------------------------------

// To convert cards in game (without inDeck) containing all data to thiner (what exactly? check getThinerCardForEnded)
// cards for ended game. For active game there are two functions that convert WHOLE statePlayer states, while conversion from game to
// ended game in DB is done for cards object only (because there are no "current" states for ended games). There is no
// function for conversion the other way because in case we need more details for cards object in game when clicking
// replay, or for stats / ranking, we will just send more details for cards object into ended game in the getThinerCardForEnded
// function
export const getThinerCardsForEndedGame = (statePlayer) => {
   let copyStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   const newCards = {
      played: copyStatePlayer.cardsPlayed.map((c) => getThinerCardForEnded(c)),
      seen: copyStatePlayer.cardsSeen.map((c) => getThinerCardForEnded(c)),
      purchased: copyStatePlayer.cardsPurchased.map((c) => getThinerCardForEnded(c)),
      inDeck: copyStatePlayer.cardsDeckIds,
   }

   return newCards
}
// ------------------------------------------------------------------------------------------------------------------

// Functions to convert cards between cards with all data (for main statePlayer, NOT Log) and thiner versions of cards
// for active game and ended game. In game, cards are in main statePlayer, in active game in DB cards are also
// in main statePlayer, but in ended game cards are in the object - cards: { played, seen, purchased }
function getThinerCardForActive(c) {
   return { id: c.id, currentCost: c.currentCost, vp: c.vp, units: c.units, actionUsed: c.actionUsed, timeAdded: c.timeAdded, timePlayed: c.timePlayed }
}
function getThinerCardForEnded(c) {
   return { id: c.id, currentCost: c.currentCost, vp: c.vp, units: c.units }
}
// -------------------------------------------------------------------------------------------------------------------

// To convert whole stateGame (containing all boolean phases, etc) to only TR and globalParameters (THIS IS FOR LOG)
export const getThinerLogStateGame = (stateGame) => {
   let newStateGame = JSON.parse(JSON.stringify(stateGame))
   newStateGame = {
      tr: newStateGame.tr,
      globalParameters: newStateGame.globalParameters,
   }

   return newStateGame
}
// ------------------------------------------------------------------------------------------------------------------

// To convert main statePlayer into a thiner state FOR LOG in game -> STATEBEFORE / STATEAFTER
export const getThinerLogStatePlayer = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      production: newStatePlayer.production,
      resources: newStatePlayer.resources,
      corporation: newStatePlayer.corporation ? newStatePlayer.corporation.id : null,
      cardsPlayed: newStatePlayer.cardsPlayed.map((c) => getThinerCardPlayedForLogInGame(c)),
      cardsInHand: newStatePlayer.cardsInHand.map((c) => c.id),
      totalPoints: newStatePlayer.totalPoints,
   }
   return newStatePlayer
}
function getThinerCardPlayedForLogInGame(c) {
   return { id: c.id, vp: c.vp, units: c.units }
}
// ------------------------------------------------------------------------------------------------------------------

// Parses action string in every logItem and creates an object that contains main action and every parameter
export function parseActionStringToObject(actionString) {
   if (!actionString) return
   const actionObj = {}
   actionString = actionString.trim()

   // Parse first word
   let word = ''
   if (actionString.includes('[')) {
      word = actionString.slice(0, actionString.indexOf('['))
   } else {
      word = actionString
   }
   actionObj[word] = true
   actionString = actionString.slice(word.length)

   // Parse the rest of the string
   while (actionString.length > 0) {
      const match = actionString.match(/([a-zA-Z1-2\s]+):\s*([^;\]]+)(;|\])?/)
      if (match) {
         const [, key, value, delimiter] = match
         if (key.trim() === 'ids' || key.trim().slice(0, 5) === 'coord' || key.trim() === 'MUtargetIds' || key.trim() === 'option') {
            if (!actionObj[key.trim()]) actionObj[key.trim()] = []
            actionObj[key.trim()].push(
               ...value.split(',').map((idOrOption) => {
                  if (!isNaN(idOrOption.trim())) {
                     return parseInt(idOrOption.trim())
                  } else {
                     return idOrOption.trim()
                  }
               })
            )
         } else {
            if (!isNaN(value)) {
               actionObj[key.trim()] = parseInt(value)
            } else {
               actionObj[key.trim()] = value
            }
         }
         actionString = actionString.slice(match[0].length)
         if (delimiter === ']') {
            break // End of the string
         }
      } else {
         return null // Invalid format
      }
   }
   return actionObj
}

// Returns the same object as given full logItems BUT without object "details" in every logItem
export const getLogConvertedForDB = (logItems) => {
   return logItems.map((logItem) => {
      const newLogItem = {}
      for (const key in logItem) {
         if (key !== 'details') {
            newLogItem[key] = logItem[key]
         }
      }
      return newLogItem
   })
}

// Converts thin logItems (that contains only for strings: type, title, titleIcon and action) into an object
// with the same data but also object "details" in every logItem
export const getLogAndStatesConvertedForGame = (logItems, initStateBoard, cardsInOrder, forfeited, logItemIdForReplay = -1) => {
   // Result, after modification
   let convertedLogItems = []

   // Ids of cards in the deck
   let nextCards = JSON.parse(JSON.stringify(cardsInOrder))

   // Init State Player
   const initCardsIds = nextCards.slice(0, 10)
   const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.includes(id))
   const initCards = getCards(initCardsIds)
   let statePlayer = JSON.parse(
      JSON.stringify({
         ...INIT_STATE_PLAYER,
         cardsSeen: initCards,
         cardsDeckIds: leftCardsIds,
         cardsDrawIds: initCardsIds,
      })
   )

   // Init State Game
   let stateGame = JSON.parse(JSON.stringify(INIT_STATE_GAME))

   // All data for board object
   let stateBoard = JSON.parse(JSON.stringify(initStateBoard))

   // Init State Modal
   const stateModal = JSON.parse(JSON.stringify(INIT_MODALS))

   // Custom dispatchers to send modification payloads to existing reducerPlayer, reducerGame and reducerBoard functions
   // Because we are not in custom hook, neither in a component
   function updateStatePlayer(action) {
      statePlayer = reducerPlayer(statePlayer, action)
   }
   function updateStateGame(action) {
      stateGame = reducerGame(stateGame, action)
   }
   function updateStateBoard(action) {
      stateBoard = reducerBoard(stateBoard, action)
   }
   for (let i = 0; i < logItems.length; i++) {
      const logItem = logItems[i]

      // Set Corporation phase to true only for logItem index === 1 and false for any other logItem index
      if (i === 1) {
         updateStateGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: true })
      } else {
         updateStateGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: false })
      }
      // Set phase draft for all logItems with type === draft
      if (logItem.type === LOG_TYPES.DRAFT) {
         if (i === 1) {
            updateStateGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
         } else {
            updateStateGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
         }
      } else {
         updateStateGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      }
      stateModal.modalCards = false

      // Leave loop if logItem occured after the one user clicked
      if (i === logItemIdForReplay) break
      const newLogItem = remove_id(JSON.parse(JSON.stringify(logItem)))
      if (logItem.type === LOG_TYPES.GENERATION) {
         // ================================================== GENERATION ==============================================
         // If logItem is a generation, return the same object
         if (i !== 0) updateStateGame({ type: ACTIONS_GAME.INCREMENT_GEN }) // Increment gen for any logItem.type = GENERATION except the first one because we already have initial gen = 1
         convertedLogItems.push(newLogItem)
      } else {
         const actionObj = parseActionStringToObject(logItem.action)
         if (actionObj.draft) {
            // ================================================== DRAFT =================================================
            // If gen 1, set corporation and add corp resources and production to statePlayer
            if (stateGame.generation === 1) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_CORPORATION, payload: getCorporationById(actionObj.corpId) })
               performImmediateCorpEffect(getCorporationById(actionObj.corpId), updateStatePlayer, updateStateGame)
            }
            // Add stateBefore and steps
            newLogItem.details = { stateBefore: { statePlayer: getThinerLogStatePlayer(statePlayer), stateGame: getThinerLogStateGame(stateGame) } }
            newLogItem.details.steps = []
            // If bought 1+ cards:
            if (actionObj.ids) {
               // Update mln resource and add step
               if (actionObj.paidMln) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
                  addStep(newLogItem, `Paid ${actionObj.paidMln} MC for cards in draft phase`, RESOURCES.MLN, -actionObj.paidMln)
               }
               // Update heat resource and add step
               if (actionObj.paidHeat) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
                  addStep(newLogItem, `Paid ${actionObj.paidHeat} heat for cards in draft phase`, RESOURCES.HEAT, -actionObj.paidHeat)
               }
               // Update cardsInHand and add step
               updateCardsState_BoughtCards(actionObj.ids, statePlayer, updateStatePlayer)
               addStep(newLogItem, `Purchased ${actionObj.ids.length} card${actionObj.ids.length > 1 ? 's' : ''} in the draft phase`, RESOURCES.CARD, actionObj.ids.length)
            }
            // Update nextCards even if no cards have been bought
            if (stateGame.generation === 1) nextCards.splice(0, 10)

            // Set phase draft to false
            updateStateGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
            updateStateGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: false })

            // Add stateAfter
            newLogItem.details.stateAfter = { statePlayer: getThinerLogStatePlayer(statePlayer), stateGame: getThinerLogStateGame(stateGame) }
            convertedLogItems.push(newLogItem)
         } else {
            newLogItem.details = { stateBefore: { statePlayer: getThinerLogStatePlayer(statePlayer), stateGame: getThinerLogStateGame(stateGame) } }
            newLogItem.details.steps = []
            if (actionObj.forcedInventrix) {
               // ================================================ FORCED INVENTRIX =======================================
               // Update cards in hand and nextCards
               updateCardsState_ReceivedCards(3, statePlayer, updateStatePlayer, nextCards)
               // Add step
               const card1name = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 3].name
               const card2name = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
               const card3name = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
               addStep(newLogItem, `Drew 3 cards (${card1name}, ${card2name} and ${card3name})`, RESOURCES.CARD, 3)
            } else if (actionObj.forcedTharsis) {
               // ================================================= FORCED THARSIS ========================================
               performTileActionsForLog(actionObj, newLogItem)
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
               addStep(newLogItem, 'Received 3 MC from THARSIS REPUBLIC effect', RESOURCES.MLN, 3)
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               addStep(newLogItem, 'MC production increased by 1 from THARSIS REPUBLIC effect', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            } else if (actionObj.spSellPatent) {
               // ================================================= SP SELL PATENT ========================================
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: statePlayer.cardsInHand.filter((c) => !actionObj.ids.includes(c.id)) })
               addStep(newLogItem, actionObj.ids.length === 1 ? 'Sold 1 card' : `Sold ${actionObj.ids.length} cards`, RESOURCES.CARD, -actionObj.ids.length)
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: actionObj.ids.length })
               addStep(newLogItem, `Received ${actionObj.ids.length} MC`, RESOURCES.MLN, actionObj.ids.length)
            } else if (actionObj.immEffect) {
               // ============================================= CARD IMMEDIATE ACTION =====================================
               // Decrease Corporation Resources
               if (actionObj.paidMln) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
                  addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
               }
               if (actionObj.paidSteel) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -actionObj.paidSteel })
                  addStep(newLogItem, `Paid ${actionObj.paidSteel} steel`, RESOURCES.STEEL, -actionObj.paidSteel)
               }
               if (actionObj.paidTitan) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -actionObj.paidTitan })
                  addStep(newLogItem, `Paid ${actionObj.paidTitan} titanium`, RESOURCES.TITAN, -actionObj.paidTitan)
               }
               if (actionObj.paidHeat) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
                  addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
               }
               // Remove this card from Cards In Hand
               updateCardsState_Played(statePlayer, updateStatePlayer, actionObj.id)

               // Perform immediate effect
               performImmEffectForLog({ actionObj, newLogItem })
               // Perform effects
               getCards(actionObj.id).effectsToCall.forEach((effect) => funcPerformEffect(effect, newLogItem, actionObj))
            } else if (actionObj.cardAction) {
               // ================================================== CARD ACTION ==========================================
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_ACTION_USED, payload: { cardId: actionObj.id, actionUsed: true } })
               performCardActionForLog(actionObj, newLogItem)
            } else if (actionObj.sp) {
               // =============================================== STANDARD PROJECT ========================================
               // Decrease Corporation Resources
               if (actionObj.paidMln) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
                  addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
               }
               if (actionObj.paidHeat) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
                  addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
               }
               // Perform immediate effect
               if (actionObj.id === 5) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
                  addStep(newLogItem, 'MC production increased by 1', RESOURCES.MLN, 1)
               }
               performImmEffectForLog({ actionObj, immEffectName: getNameOfSP(actionObj.id), newLogItem })
               // Perform effects
               let spEffectsToCall = []
               switch (actionObj.id) {
                  case 1:
                  case 2:
                  case 3:
                     spEffectsToCall = [EFFECTS.EFFECT_STANDARD_TECHNOLOGY]
                     break
                  case 4:
                     spEffectsToCall = getSPeffectsToCall(SP.GREENERY)
                     break
                  case 5:
                     spEffectsToCall = getSPeffectsToCall(SP.CITY)
                     break
                  default:
                     break
               }
               spEffectsToCall.forEach((effect) => funcPerformEffect(effect, newLogItem, actionObj))
            } else if (actionObj.convertHeat) {
               // ================================================= CONVERT HEAT ==========================================
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
               addStep(newLogItem, 'Paid 8 heat', RESOURCES.HEAT, -8)
               performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            } else if (actionObj.convertGreenery) {
               // =============================================== CONVERT GREENERY ========================================
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })
               addStep(newLogItem, `Paid ${statePlayer.valueGreenery} plants`, RESOURCES.PLANT, -statePlayer.valueGreenery)
               performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.GREENERY, newLogItem })
               // Only herbivores effect possible
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) performEffectForLog(EFFECTS.EFFECT_HERBIVORES, newLogItem, actionObj)
            } else if (actionObj.pass) {
               // ==================================================== PASS ===============================================
               // Set actionUsed = false for all cards played and trRaised (for UNMI only) = false
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_ACTION_USED, payload: { actionUsed: false } })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: false })
               // Set special design and indentured workers effects to false
               if (statePlayer.specialDesignEffect) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
                  updateStatePlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
                  addStep(newLogItem, 'SPECIAL DESIGN effect ended', null, null)
               }
               if (statePlayer.indenturedWorkersEffect) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer, false) })
                  updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer, false) })
                  updateStatePlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
                  addStep(newLogItem, 'INDENTURED WORKERS effect ended', null, null)
               }
               // Update resources
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: statePlayer.production.mln + stateGame.tr })
               addStep(newLogItem, `Received ${statePlayer.production.mln + stateGame.tr} MC in the production phase`, RESOURCES.MLN, statePlayer.production.mln + stateGame.tr)
               if (statePlayer.production.steel) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: statePlayer.production.steel })
                  addStep(newLogItem, `Received ${statePlayer.production.steel} steel in the production phase`, RESOURCES.STEEL, statePlayer.production.steel)
               }
               if (statePlayer.production.titan) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: statePlayer.production.titan })
                  addStep(newLogItem, `Received ${statePlayer.production.titan} titanium in the production phase`, RESOURCES.TITAN, statePlayer.production.titan)
               }
               if (statePlayer.production.plant) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: statePlayer.production.plant })
                  addStep(newLogItem, `Received ${statePlayer.production.plant} plant in the production phase`, RESOURCES.PLANT, statePlayer.production.plant)
               }
               const energy = statePlayer.resources.energy
               if (statePlayer.production.energy - statePlayer.resources.energy) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: statePlayer.production.energy - statePlayer.resources.energy })
               }
               if (statePlayer.production.energy) {
                  addStep(newLogItem, `Received ${statePlayer.production.energy} energy in the production phase`, RESOURCES.ENERGY, statePlayer.production.energy)
               }
               if (statePlayer.production.heat + energy) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: statePlayer.production.heat + energy })
                  addStep(newLogItem, `Received ${statePlayer.production.heat + energy} heat in the production phase`, RESOURCES.HEAT, statePlayer.production.heat + energy)
               }
               // Update cards seen, cards draw and cards inDeck
               updateCardsState_Draft(statePlayer, updateStatePlayer, nextCards)
            } else if (actionObj.finalPlantConversion) {
               // ==================================================== Final Plants Conversion ===============================================
               for (let i = 0; i < actionObj[`coord${TILES.GREENERY}`].length; i += 2) {
                  const x = actionObj[`coord${TILES.GREENERY}`][i]
                  const y = actionObj[`coord${TILES.GREENERY}`][i + 1]
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })
                  addStep(newLogItem, `Paid ${statePlayer.valueGreenery} plants in the final plant conversion phase`, RESOURCES.PLANT, -statePlayer.valueGreenery)
                  performTileActionsForLog(actionObj, newLogItem, x, y)
               }
            }
            // Turn off Special Design effect (if aplicable)
            if (statePlayer.specialDesignEffect && actionObj.immEffect && actionObj.id !== 206) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
               addStep(newLogItem, 'SPECIAL DESIGN effect ended', null, null)
            }
            // Turn off Indentured Workers effect (if aplicable)
            if (statePlayer.indenturedWorkersEffect && actionObj.immEffect && actionObj.id !== 195) {
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer, null, true) })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer, null, true) })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
               addStep(newLogItem, 'INDENTURED WORKERS effect ended', null, null)
            }
            // Call effect of Olympus Conference
            if (actionObj.immEffect && actionObj.id !== 90 && actionObj.id !== 192 && actionObj.id !== 196 && actionObj.id !== 204) {
               // If Olympus Conference effect is played
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
                  // If played card triggers the effect
                  if (getCards(actionObj.id).effectsToCall.includes(EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
                     if (statePlayer.cardsPlayed.find((c) => c.id === 185).units.science === 0) {
                        updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 } })
                        addStep(newLogItem, 'Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1)
                     } else {
                        updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 } })
                        addStep(newLogItem, 'Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1)
                        updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
                        const newCard = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                        addStep(newLogItem, `Drew 1 card (${newCard}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1)
                     }
                  }
               }
               // Call Mars University
               if (actionObj.MUtargetIds) {
                  const id = actionObj.MUtargetIds[actionObj.MUtargetIds.length - 1]
                  replaceCardMU(id, newLogItem)
                  if (actionObj.MUtargetIds.length > 1) {
                     const id = actionObj.MUtargetIds[0]
                     replaceCardMU(id, newLogItem)
                  }
               }
            }
            // Update VP
            updateVP(statePlayer, updateStatePlayer, stateGame, stateBoard)

            // Update state after
            newLogItem.details.stateAfter = { statePlayer: getThinerLogStatePlayer(statePlayer), stateGame: getThinerLogStateGame(stateGame) }
            convertedLogItems.push(newLogItem)
         }
      }
   }

   function replaceCardMU(id, newLogItem) {
      updateStatePlayer({ type: ACTIONS_PLAYER.REMOVE_CARDS_IN_HAND, payload: id })
      addStep(newLogItem, `Discarded 1 card (${getCards(id).name}) from MARS UNIVERSITY effect`, RESOURCES.CARD, -1)
      updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
      const newCard = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
      addStep(newLogItem, `Drew 1 card (${newCard}) from MARS UNIVERSITY effect`, RESOURCES.CARD, 1)
   }

   function funcPerformEffect(effect, newLogItem, actionObj) {
      if (statePlayer.cardsPlayed.some((card) => card.effect === effect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === effect))
         performEffectForLog(effect, newLogItem, actionObj)
   }

   function performTileActionsForLog(actionObj, newLogItem, x, y) {
      for (const key in actionObj) {
         if (key.slice(0, 5) === 'coord') {
            const tile = key.slice(5)

            // Update stateBoard
            let field
            let stateBoardFieldObj
            if (x) {
               field = getField(x, y)
            } else {
               const tileCoordinates = actionObj[`coord${tile}`]
               for (let i = 0; i < tileCoordinates.length - 1; i += 2) {
                  const objX = tileCoordinates[i]
                  const objY = tileCoordinates[i + 1]
                  stateBoardFieldObj = stateBoard.find((f) => f.x === objX && f.y === objY).object
                  if (stateBoardFieldObj) {
                     continue
                  } else {
                     field = getField(objX, objY)
                     break
                  }
               }
            }

            if (stateBoardFieldObj) {
               continue
            } else {
               const logDescription = field.name ? field.name : `THARSIS at coordinates x: ${field.x}, y: ${field.y}`
               updateStateBoard({ type: ACTIONS_BOARD.SET_OBJECT, payload: { x: field.x, y: field.y, name: field.name, obj: tile } })
               addStep(newLogItem, `${tile} tile has been placed on ${logDescription}`, tile, null)
               // Below are only blue cards with any effect, that requires you as imm effect to place a tile
               // We need to save that info (effect is active) into the log
               if (actionObj.id === 20 || actionObj.id === 128 || actionObj.id === 200) {
                  addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
               }
               // Below are only blue cards with any action, that requires you as imm effect to place a tile
               // We need to save that info (action is active) into the log
               if (actionObj.immEffect && (actionObj.id === 123 || actionObj.id === 199)) {
                  addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
               }
               // Field bonus
               let uniqBonuses = [...new Set(field.bonus)]
               if (uniqBonuses.length > 0) {
                  for (let i = 0; i < uniqBonuses.length; i++) {
                     const countBonus = field.bonus.reduce((total, value) => (value === uniqBonuses[i] ? total + 1 : total), 0)
                     switch (uniqBonuses[i]) {
                        case RESOURCES.STEEL:
                           updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: countBonus })
                           addStep(newLogItem, `Received ${countBonus} steel from board`, RESOURCES.STEEL, countBonus)
                           break
                        case RESOURCES.TITAN:
                           updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: countBonus })
                           addStep(newLogItem, `Received ${countBonus} titanium from board`, RESOURCES.TITAN, countBonus)
                           break
                        case RESOURCES.PLANT:
                           updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: countBonus })
                           addStep(newLogItem, countBonus === 1 ? 'Received 1 plant from board' : `Received ${countBonus} plants from board`, RESOURCES.PLANT, countBonus)
                           break
                        case RESOURCES.CARD:
                           updateCardsState_ReceivedCards(countBonus, statePlayer, updateStatePlayer, nextCards)
                           if (countBonus === 1) {
                              const newCard = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                              addStep(newLogItem, `Drew 1 card (${newCard}) from board`, RESOURCES.CARD, 1)
                           } else {
                              const newCard1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
                              const newCard2 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                              addStep(newLogItem, `Drew 2 cards (${newCard1} and ${newCard2}) from board`, RESOURCES.CARD, 2)
                           }
                           break
                        default:
                           break
                     }
                  }
               }
               // Receive mln for ocean bonus
               let bonusMln = 0
               const oceanNeighbors = getNeighbors(field.x, field.y, stateBoard).filter((nb) => nb.object === TILES.OCEAN)
               if (oceanNeighbors.length) {
                  bonusMln = oceanNeighbors.length * 2
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: bonusMln })
                  addStep(newLogItem, `Received ${bonusMln} MC from board from oceans`, RESOURCES.MLN, bonusMln)
               }
               // Receive steel / titan prod if stateGame.phasePlaceTileData is mining rights or mining area
               if (tile === TILES.SPECIAL_MINING_RIGHTS || tile === TILES.SPECIAL_MINING_AREA) {
                  let actionSteel = () => {
                     updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
                     return RESOURCES.STEEL
                  }
                  let actionTitan = () => {
                     updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
                     return RESOURCES.TITAN
                  }
                  if (field.bonus.includes(RESOURCES.STEEL)) {
                     actionSteel()
                     addStep(newLogItem, 'Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
                     tile === TILES.SPECIAL_MINING_RIGHTS ? (stateModal.modalProduction.miningRights = actionSteel) : (stateModal.modalProduction.miningArea = actionSteel)
                  } else if (field.bonus.includes(RESOURCES.TITAN)) {
                     actionTitan()
                     addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
                     tile === TILES.SPECIAL_MINING_RIGHTS ? (stateModal.modalProduction.miningRights = actionTitan) : (stateModal.modalProduction.miningArea = actionTitan)
                  }
               }
               // Receive steel prod if Mining Guild and field has steel/titan bonus
               if ((field.bonus.includes(RESOURCES.STEEL) || field.bonus.includes(RESOURCES.TITAN)) && statePlayer.corporation.name === CORP_NAMES.MINING_GUILD) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
                  addStep(newLogItem, 'Steel production increased by 1 from MINING GUILD effect', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
               }

               break
            }
         }
      }
   }

   function performImmEffectForLog({ actionObj, immEffectName, newLogItem, roboticWorkforce = false, posX, posY }) {
      const actionOrCardId = immEffectName ? immEffectName : actionObj.id
      let value
      let card1
      let card2
      switch (actionOrCardId) {
         // ============================= SP POWER PLANT ============================
         // cards with ONLY this action: Solar Power, Wave Power, Power Plant, Power Supply Consortium,
         // Windmills, Heat Trappers, Energy Tapping
         case IMM_EFFECTS.POWER_PLANT:
         case SP.POWER_PLANT:
         case 113:
         case 139:
         case 141:
         case 160:
         case 168:
         case 178:
         case 201:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 })
            addStep(newLogItem, 'Energy production increased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 1)
            break
         // =================== INCREASE TEMPERATURE BY 2 DEGREES ===================
         case IMM_EFFECTS.TEMPERATURE:
         case SP.ASTEROID:
            value = stateGame.globalParameters.temperature
            if (value < 8) {
               updateStateGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
               updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               addStep(newLogItem, 'Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, null)
               // Bonus heat production
               if (value === -26 || value === -22) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                  addStep(newLogItem, 'Heat production increased by 1 from temperature bonus', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1)
               }
               // Bonus ocean
               if (value === -2) performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            }
            break
         // =============================== PLACE OCEAN TILE ============================
         // cards with ONLY this action: Artificial Lake, Subterranean Reservoir, Ice Cap Melting, Flooding,
         // Permafrost Extraction
         case IMM_EFFECTS.AQUIFER:
         case SP.AQUIFER:
         case 116:
         case 127:
         case 181:
         case 188:
         case 191:
            if (stateGame.globalParameters.oceans < 9) {
               performTileActionsForLog(actionObj, newLogItem, posX, posY)
               // Increase oceans meter
               updateStateGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
               updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               // Add 2 plants if Arctic Algae effect is ON
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE)) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
                  addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
               }
            }
            break
         // ======================= Greenery tiles + oxygen as an action =================
         // PLACE GREENERY TILE, Plantation, Mangrove
         case IMM_EFFECTS.GREENERY:
         case SP.GREENERY:
         case 193:
         case 59:
            performTileActionsForLog(actionObj, newLogItem)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // =========================== Just place tile as an action ======================
         // GREENERY TILE WITHOUT OXYGEN, PLACE CITY TILE, Mining Area, Mining Rights, Ganymede Colony,
         // Industrial Center, Restricted Area
         case IMM_EFFECTS.GREENERY_WO_OX:
         case IMM_EFFECTS.CITY:
         case SP.CITY:
         case 64:
         case 67:
         case 81:
         case 123:
         case 199:
            performTileActionsForLog(actionObj, newLogItem)
            break
         // ================================= INCREASE OXYGEN BY 1% ===========================
         case IMM_EFFECTS.OXYGEN:
            value = stateGame.globalParameters.oxygen
            if (value < 14 && !stateGame.phaseAfterGen14) {
               updateStateGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
               updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               addStep(newLogItem, 'Oxygen raised by 1 percent', LOG_ICONS.OXYGEN, 1)
            }
            // Bonus temperature
            if (value === 7 && stateGame.globalParameters.temperature < 8) {
               performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            }
            break
         // ================================ INCREASE TR BY 1 ===========================
         case IMM_EFFECTS.TR:
            updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            addStep(newLogItem, 'TR raised by 1', RESOURCES.TR, 1)
            break
         // ================================ INCREASE TR BY 2 ===========================
         // cards with only this action: Release Of Inert Gases, Bribed Committee
         case IMM_EFFECTS.TR2:
         case 36:
         case 112:
            updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 2 })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            addStep(newLogItem, 'TR raised by 2', RESOURCES.TR, 2)
            break
         // ========================== Mining Guild immediate effect ====================
         // cards with ONLY this action: Mine, Great Escarpment Consortium
         case CORP_NAMES.MINING_GUILD:
         case 56:
         case 61:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
            addStep(newLogItem, 'Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
            break
         // ============================= CARD IMMEDIATE EFFECTS ========================
         // Asteroid Mining Consortium
         case 2:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            break
         // Deep Well Heating
         case 3:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.POWER_PLANT, newLogItem })
            if (!roboticWorkforce) performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Cloud Seeding
         case 4:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
            addStep(newLogItem, 'MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            break
         // Search For Life, Inventors' Guild, Water Import From Europa, Development Center, Equatorial Magnetizer, Predators, Security Fleet,
         // Regolith Eaters, GHG Producing Bacteria, Ants, Tardigrades, Fish, Small Animals, Birds, Space Mirrors, Physics Complex, IronWorks,
         // Steelworks, Ore Processor, Symbiotic Fungus, Extreme-Cold Fungus, Caretaker Contract, Water Splitting Plant, Aquifer Pumping,
         // Power Infrastructure, Underground Detonations
         case 5:
         case 6:
         case 12:
         case 14:
         case 15:
         case 24:
         case 28:
         case 33:
         case 34:
         case 35:
         case 49:
         case 52:
         case 54:
         case 72:
         case 76:
         case 95:
         case 101:
         case 103:
         case 104:
         case 133:
         case 134:
         case 154:
         case 177:
         case 187:
         case 194:
         case 202:
            addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Capital
         case 8:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
            addStep(newLogItem, 'Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 5 })
            addStep(newLogItem, 'MC production increased by 5', [RESOURCES.PROD_BG, RESOURCES.MLN], 5)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Asteroid
         case 9:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 2 })
            addStep(newLogItem, 'Received 2 titanium', RESOURCES.TITAN, 2)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Comet
         case 10:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Big Asteroid
         case 11:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 4 })
            addStep(newLogItem, 'Received 4 titanium', RESOURCES.TITAN, 4)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Space Elevator
         case 13:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            if (!roboticWorkforce) addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Domed Crater
         case 16:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
            addStep(newLogItem, 'MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3)
            if (!roboticWorkforce) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
               addStep(newLogItem, 'Received 3 plants', RESOURCES.PLANT, 3)
               performTileActionsForLog(actionObj, newLogItem)
            }
            break
         // Noctis City
         case 17:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
            addStep(newLogItem, 'MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Methane From Titan
         case 18:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
            addStep(newLogItem, 'Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            break
         // Imported Hydrogen
         case 19:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD19_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
                  addStep(newLogItem, 'Received 3 plants', RESOURCES.PLANT, 3)
                  break
               case OPTION_ICONS.CARD19_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.MICROBE, amount: 3 } })
                  addStep(newLogItem, `Received 3 microbes to ${getCards(actionObj.targetId).name}`, RESOURCES.MICROBE, 3)
                  break
               case OPTION_ICONS.CARD19_OPTION3:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.ANIMAL, amount: 2 } })
                  addStep(newLogItem, `Received 2 animals to ${getCards(actionObj.targetId).name}`, RESOURCES.ANIMAL, 2)
                  break
               default:
                  break
            }
            break
         // Research Outpost
         case 20:
            performTileActionsForLog(actionObj, newLogItem)
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer) })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer) })
            break
         // Phobos Space Haven
         case 21:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            performTileActionsForLog(actionObj, newLogItem)
            break
         // Black Polar Dust
         case 22:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
            addStep(newLogItem, 'MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
            addStep(newLogItem, 'Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            break
         // Arctic Algae
         case 23:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
            addStep(newLogItem, 'Received 1 plant', RESOURCES.PLANT, 1)
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Space Station, Earth Catapult, Earth Office, Anti-Gravity Technology
         case 25:
         case 70:
         case 105:
         case 150:
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer) })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer) })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Eos Chasma National Park
         case 26:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            if (!roboticWorkforce) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
               addStep(newLogItem, 'Received 3 plants', RESOURCES.PLANT, 3)
               if (actionObj.targetId) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.ANIMAL, amount: 1 } })
                  addStep(newLogItem, `Received 1 animal to ${getCards(actionObj.targetId).name}`, RESOURCES.ANIMAL, 1)
               }
            }
            break
         // Cupola City, Corporate Stronghold
         case 29:
         case 182:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
            addStep(newLogItem, 'MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Lunar Beam
         case 30:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
            addStep(newLogItem, 'MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
            addStep(newLogItem, 'Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
            addStep(newLogItem, 'Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2)
            break
         // Optimal Aerobraking, Rover Construction, Mars University, Media Group, Standard Technology,
         // Olympus Conference
         case 31:
         case 38:
         case 73:
         case 109:
         case 156:
         case 185:
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Underground City
         case 32:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
            addStep(newLogItem, 'Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 })
            addStep(newLogItem, 'Steel production increased by 2', [RESOURCES.PROD_BG, RESOURCES.STEEL], 2)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Nitrogen-Rich Asteroid
         case 37:
            if (
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.PLANT) ? total + 1 : total), 0) +
                  statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.PLANT ? total + 1 : total), 0) <
               3
            ) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            } else {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 4 })
               addStep(newLogItem, 'Plant production increased by 4', [RESOURCES.PROD_BG, RESOURCES.PLANT], 4)
            }
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TR2, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Deimos Down
         case 39:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 4 })
            addStep(newLogItem, 'Received 4 steel', RESOURCES.STEEL, 4)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Asteroid Mining
         case 40:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 2 })
            addStep(newLogItem, 'Titanium production increased by 2', [RESOURCES.PROD_BG, RESOURCES.TITAN], 2)
            break
         // Food Factory
         case 41:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: -1 })
            addStep(newLogItem, 'Plant production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 })
            addStep(newLogItem, 'MC production increased by 4', [RESOURCES.PROD_BG, RESOURCES.MLN], 4)
            break
         // Archaebacteria, Adapted Lichen, Lichen
         case 42:
         case 48:
         case 159:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            break
         // Carbonate Processing
         case 43:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
            addStep(newLogItem, 'Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3)
            break
         // Natural Preserve
         case 44:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Nuclear Power
         case 45:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
            addStep(newLogItem, 'MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
            addStep(newLogItem, 'Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3)
            break
         // Lightning Harvest
         case 46:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.POWER_PLANT, newLogItem })
            break
         // Algae
         case 47:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
            addStep(newLogItem, 'Received 1 plant', RESOURCES.PLANT, 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            break
         // Miranda Resort
         case 51:
            value =
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.EARTH) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 0) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.EARTH ? total + 1 : total), 0)
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
               addStep(newLogItem, `MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value)
            }
            break
         // Lake Marineris, Ice Asteroid
         case 53:
         case 78:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            // if (stateGame.globalParameters.oceans <= 8) {
            //    performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem, posX: actionObj[`coord${TILES.OCEAN}`][2], posY: actionObj[`coord${TILES.OCEAN}`][3] })
            // }
            break
         // Kelp Farming
         case 55:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 })
            addStep(newLogItem, 'Plant production increased by 3', [RESOURCES.PROD_BG, RESOURCES.PLANT], 3)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
            addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
            break
         // Vesta Shipyard
         case 57:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            break
         // Beam From A Thorium Asteroid
         case 58:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
            addStep(newLogItem, 'Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
            addStep(newLogItem, 'Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3)
            break
         // Trees
         case 60:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 })
            addStep(newLogItem, 'Plant production increased by 3', [RESOURCES.PROD_BG, RESOURCES.PLANT], 3)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
            addStep(newLogItem, 'Received 1 plant', RESOURCES.PLANT, 1)
            break
         // Mineral Deposit
         case 62:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 5 })
            addStep(newLogItem, 'Received 5 steel', RESOURCES.STEEL, 5)
            break
         // Mining Expedition
         case 63:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 })
            addStep(newLogItem, 'Received 2 steel', RESOURCES.STEEL, 2)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // Building Industries
         case 65:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 })
            addStep(newLogItem, 'Steel production increased by 2', [RESOURCES.PROD_BG, RESOURCES.STEEL], 2)
            break
         // Sponsors
         case 68:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            break
         // Electro Catapult
         case 69:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            if (!roboticWorkforce) addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Advanced Alloys
         case 71:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_VALUE_STEEL, payload: 1 })
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_VALUE_TITAN, payload: 1 })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Viral Enhancers
         case 74:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
            addStep(newLogItem, 'Received 1 plant from VIRAL ENHANCERS effect', RESOURCES.PLANT, 1)
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Towing A Comet
         case 75:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
            addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // Solar Wind Power
         case 77:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 2 })
            addStep(newLogItem, 'Received 2 titanium', RESOURCES.TITAN, 2)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.POWER_PLANT, newLogItem })
            break
         // Quantum Extractor
         case 79:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 4 })
            addStep(newLogItem, 'Energy production increased by 4', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 4)
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer) })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer) })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Giant Ice Asteroid
         case 80:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Callisto Penal Mines
         case 82:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
            addStep(newLogItem, 'MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3)
            break
         // Giant Space Mirror
         case 83:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
            addStep(newLogItem, 'Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3)
            break
         // Commercial District
         case 85:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 })
            addStep(newLogItem, 'MC production increased by 4', [RESOURCES.PROD_BG, RESOURCES.MLN], 4)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Robotic Workforce
         case 86:
            let res
            switch (actionObj.targetId) {
               case 64: // Mining Area
                  addStep(newLogItem, `Copy of ${getCards(64).name}:`, null, null)
                  res = stateModal.modalProduction.miningArea()
                  res = RESOURCES.STEEL
                     ? addStep(newLogItem, 'Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
                     : addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
                  break
               case 67: // Mining Rights
                  addStep(newLogItem, `Copy of ${getCards(67).name}:`, null, null)
                  res = stateModal.modalProduction.miningRights()
                  res = RESOURCES.STEEL
                     ? addStep(newLogItem, 'Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
                     : addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
                  break
               default:
                  addStep(newLogItem, `Copy of ${actionObj.targetId === CORP_NAMES.MINING_GUILD ? CORP_NAMES.MINING_GUILD : getCards(actionObj.targetId).name}:`, null, null)
                  performImmEffectForLog({ actionObj, immEffectName: actionObj.targetId, newLogItem, roboticWorkforce: true })
                  break
            }
            break
         // Grass
         case 87:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
            addStep(newLogItem, 'Received 3 plants', RESOURCES.PLANT, 3)
            break
         // Heather
         case 88:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
            addStep(newLogItem, 'Received 1 plant', RESOURCES.PLANT, 1)
            break
         // Peroxide Power
         case 89:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
            addStep(newLogItem, 'MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
            addStep(newLogItem, 'Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2)
            break
         // Research
         case 90:
            // Receive 2 cards from Research
            updateCardsState_ReceivedCards(2, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
            card2 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 2 cards (${card1} and ${card2})`, RESOURCES.CARD, 2)
            // If Olympus Conference effect is played
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
               for (let i = 0; i < 2; i++) {
                  if (statePlayer.cardsPlayed.find((c) => c.id === 185).units.science === 0) {
                     updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 } })
                     addStep(newLogItem, 'Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1)
                  } else {
                     updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 } })
                     addStep(newLogItem, 'Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1)
                     updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
                     const newCard = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                     addStep(newLogItem, `Drew 1 card (${newCard}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1)
                  }
               }
            }
            // Call Mars University
            if (actionObj.MUtargetIds) {
               const id = actionObj.MUtargetIds[actionObj.MUtargetIds.length - 1]
               replaceCardMU(id, newLogItem)
               if (actionObj.MUtargetIds.length > 1) {
                  const id = actionObj.MUtargetIds[0]
                  replaceCardMU(id, newLogItem)
               }
            }
            break
         // Gene Repair
         case 91:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            break
         // IO Mining Industries
         case 92:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 2 })
            addStep(newLogItem, 'Titanium production increased by 2', [RESOURCES.PROD_BG, RESOURCES.TITAN], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            break
         // Bushes
         case 93:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
            addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
            break
         // Mass Converter
         case 94:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 6 })
            addStep(newLogItem, 'Energy production increased by 6', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 6)
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer) })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer) })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Greenhouses
         case 96:
            value = stateBoard.reduce(
               (total, field) => (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL ? total + 1 : total),
               0
            )
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value })
               addStep(newLogItem, value === 1 ? 'Received 1 plant' : `Received ${value} plants`, RESOURCES.PLANT, value)
            }
            break
         // Nuclear Zone
         case 97:
            performTileActionsForLog(actionObj, newLogItem)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Tropical Resort
         case 98:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: -2 })
            addStep(newLogItem, 'Heat production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
            addStep(newLogItem, 'MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3)
            break
         // Fueled Generators
         case 100:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
            addStep(newLogItem, 'MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.POWER_PLANT, newLogItem })
            break
         // Power Grid
         case 102:
            value =
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.POWER) ? total + 1 : total), 10) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.POWER ? total + 1 : total), 0)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value })
            addStep(newLogItem, `Energy production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.ENERGY], value)
            break
         // Acquired Company
         case 106:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
            addStep(newLogItem, 'MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3)
            break
         // Media Archives
         case 107:
            value = statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.EVENT) ? total + 1 : total), 0)
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value })
               addStep(newLogItem, `Received ${value} MC`, RESOURCES.MLN, value)
            }
            break
         // Open City
         case 108:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 })
            addStep(newLogItem, 'MC production increased by 4', [RESOURCES.PROD_BG, RESOURCES.MLN], 4)
            if (!roboticWorkforce) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
               performTileActionsForLog(actionObj, newLogItem)
            }
            break
         // Business Network
         case 110:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
            addStep(newLogItem, 'MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1)
            addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Business Contacts
         case 111:
            updateCardsState_BusinessContacts(4, statePlayer, updateStatePlayer, nextCards, actionObj)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
            card2 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 2 cards (${card1} and ${card2})`, RESOURCES.CARD, 2)
            break
         // Artificial Photosynthesis
         case 115:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD115_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
                  addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
                  break
               case OPTION_ICONS.CARD115_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
                  addStep(newLogItem, 'Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2)
                  break
               default:
                  break
            }
            break
         // Geothermal Power, Great Dam, Biomass Combustors
         case 117:
         case 136:
         case 183:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
            addStep(newLogItem, 'Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2)
            break
         // Farming
         case 118:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
            addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
            break
         // Urbanized Area
         case 120:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            break
         // Moss
         case 122:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -1 })
            addStep(newLogItem, 'Paid 1 plant', RESOURCES.PLANT, -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            break
         // Hired Raiders
         case 124:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD124_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 })
                  addStep(newLogItem, 'Received 2 steel', RESOURCES.STEEL, 2)
                  break
               case OPTION_ICONS.CARD124_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
                  addStep(newLogItem, 'Received 3 MC', RESOURCES.MLN, 3)
                  break
               default:
                  break
            }
            break
         // Hackers
         case 125:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            break
         // GHG Factories
         case 126:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 })
            addStep(newLogItem, 'Heat production increased by 4', [RESOURCES.PROD_BG, RESOURCES.HEAT], 4)
            break
         // Ecological Zone
         case 128:
            performTileActionsForLog(actionObj, newLogItem)
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, 'Received 1 animal to ECOLOGICAL ZONE card from its effect', RESOURCES.ANIMAL, 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, 'Received 1 animal to ECOLOGICAL ZONE card from its effect', RESOURCES.ANIMAL, 1)
            break
         // Zeppelins
         case 129:
            value = stateBoard.reduce(
               (total, field) =>
                  (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY'
                     ? total + 1
                     : total,
               0
            )
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
               addStep(newLogItem, `MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value)
            }
            break
         // Worms
         case 130:
            value = Math.floor(statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.MICROBE) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 0) / 2)
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value })
               addStep(newLogItem, `Plant production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.PLANT], value)
            }
            break
         // Decomposers
         case 131:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.MICROBE, amount: 1 } })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Fusion Power
         case 132:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
            addStep(newLogItem, 'Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3)
            break
         // Cartel
         case 137:
            value =
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.EARTH) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 0) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.EARTH ? total + 1 : total), 0)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
            addStep(newLogItem, `MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value)
            break
         // Strip Mine
         case 138:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
            addStep(newLogItem, 'Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 })
            addStep(newLogItem, 'Steel production increased by 2', [RESOURCES.PROD_BG, RESOURCES.STEEL], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            if (!roboticWorkforce) {
               performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
               performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            }
            break
         // Lava Flows
         case 140:
            performTileActionsForLog(actionObj, newLogItem)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
            break
         // Mohole Area
         case 142:
            if (!roboticWorkforce) performTileActionsForLog(actionObj, newLogItem)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 })
            addStep(newLogItem, 'Heat production increased by 4', [RESOURCES.PROD_BG, RESOURCES.HEAT], 4)
            break
         // Large Convoy
         case 143:
            updateCardsState_ReceivedCards(2, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
            card2 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 2 cards (${card1} and ${card2})`, RESOURCES.CARD, 2)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD143_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 5 })
                  addStep(newLogItem, 'Received 5 plants', RESOURCES.PLANT, 5)
                  break
               case OPTION_ICONS.CARD143_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.ANIMAL, amount: 4 } })
                  addStep(newLogItem, `Received 4 animals to ${getCards(actionObj.targetId).name}`, RESOURCES.ANIMAL, 4)
                  break
               default:
                  break
            }
            break
         // Titanium Mine
         case 144:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            break
         // Tectonic Stress Power
         case 145:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
            addStep(newLogItem, 'Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3)
            break
         // Nitrophilic Moss
         case 146:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -2 })
            addStep(newLogItem, 'Paid 2 plants', RESOURCES.PLANT, -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            break
         // Herbivores
         case 147:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 147, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, 'Received 1 animal to HERBIVORES card', RESOURCES.ANIMAL, 1)
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Insects
         case 148:
            value =
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.PLANT) ? total + 1 : total), 0) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.PLANT ? total + 1 : total), 0)
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value })
               addStep(newLogItem, `Plant production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.PLANT], value)
            }
            break
         // CEO's Favorite Project
         case 149:
            if (actionObj.targetId) {
               if (canCardHaveAnimals(actionObj.targetId)) {
                  value = RESOURCES.ANIMAL
               } else if (canCardHaveMicrobes(actionObj.targetId)) {
                  value = RESOURCES.MICROBE
               } else if (canCardHaveScience(actionObj.targetId)) {
                  value = RESOURCES.SCIENCE
               } else {
                  value = RESOURCES.FIGHTER
               }
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: value, amount: 1 } })
               addStep(newLogItem, `Received 1 ${value} to ${getCards(actionObj.targetId).name}`, value, 1)
            }
            break
         // Investment Loan
         case 151:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
            addStep(newLogItem, 'MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 10 })
            addStep(newLogItem, 'Received 10 MC', RESOURCES.MLN, 10)
            break
         // Insulation
         case 152:
            if (actionObj.option[0]) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: -actionObj.option[0] })
               addStep(newLogItem, `Heat production decreased by ${actionObj.option[0]}`, [RESOURCES.PROD_BG, RESOURCES.HEAT], -actionObj.option[0])
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: actionObj.option[0] })
               addStep(newLogItem, `MC production increased by ${actionObj.option[0]}`, [RESOURCES.PROD_BG, RESOURCES.MLN], actionObj.option[0])
            }
            break
         // Adaptation Technology
         case 153:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: 2 })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Designed Microorganisms
         case 155:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            break
         // Nitrite Reducing Bacteria
         case 157:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 157, resource: RESOURCES.MICROBE, amount: 3 } })
            addStep(newLogItem, 'Received 3 microbes to NITRITE REDUCING BACTERIA card', RESOURCES.MICROBE, 3)
            addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Industrial Microbes
         case 158:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.POWER_PLANT, newLogItem })
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
            addStep(newLogItem, 'Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
            break
         // Convoy From Europa
         case 161:
            updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 1 card (${card1})`, RESOURCES.CARD, 1)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            break
         // Imported GHG
         case 162:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
            addStep(newLogItem, 'Heat production increased by 1', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: 3 })
            addStep(newLogItem, 'Received 3 heat', RESOURCES.HEAT, 3)
            break
         // Imported Nitrogen
         case 163:
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TR, newLogItem })
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 4 })
            addStep(newLogItem, 'Received 4 plants', RESOURCES.PLANT, 4)
            if (actionObj.targetId) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.MICROBE, amount: 3 } })
               addStep(newLogItem, `Received 3 microbes to ${getCards(actionObj.targetId).name}`, RESOURCES.MICROBE, 3)
            }
            if (actionObj.targetId2) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId2, resource: RESOURCES.ANIMAL, amount: 2 } })
               addStep(newLogItem, `Received 2 animals to ${getCards(actionObj.targetId2).name}`, RESOURCES.ANIMAL, 2)
            }
            break
         // Micro-Mills
         case 164:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
            addStep(newLogItem, 'Heat production increased by 1', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1)
            break
         // Magnetic Field Generators
         case 165:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -4 })
            addStep(newLogItem, 'Energy production decreased by 4', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -4)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
            addStep(newLogItem, 'Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2)
            if (!roboticWorkforce) {
               updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 3 })
               updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               addStep(newLogItem, 'TR raised by 3', RESOURCES.TR, 3)
            }
            break
         // Shuttles
         case 166:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer) })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer) })
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Import of Advanced GHG
         case 167:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
            addStep(newLogItem, 'Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2)
            break
         // Tundra Farming
         case 169:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
            addStep(newLogItem, 'Received 1 plant', RESOURCES.PLANT, 1)
            break
         // Aerobraked Ammonia Asteroid
         case 170:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
            addStep(newLogItem, 'Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            if (actionObj.targetId) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.MICROBE, amount: 2 } })
               addStep(newLogItem, `Received 2 microbes to ${getCards(actionObj.targetId).name}`, RESOURCES.MICROBE, 2)
            }
            break
         // Magnetic Field Dome
         case 171:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
            addStep(newLogItem, 'Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            if (!roboticWorkforce) performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TR, newLogItem })
            break
         // Pets
         case 172:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 172, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, 'Received 1 animal to PETS card', RESOURCES.ANIMAL, 1)
            addStep(newLogItem, `Effect from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Protected Valley
         case 174:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            if (!roboticWorkforce) {
               performTileActionsForLog(actionObj, newLogItem)
               performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            }
            break
         // Satellites
         case 175:
            value =
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.SPACE) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 0) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.SPACE ? total + 1 : total), 0)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
            addStep(newLogItem, `MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value)
            break
         // Noctis Farming
         case 176:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            if (!roboticWorkforce) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               addStep(newLogItem, 'Received 2 plants', RESOURCES.PLANT, 2)
            }
            break
         // Soil Factory
         case 179:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
            addStep(newLogItem, 'Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1)
            break
         // Fuel Factory
         case 180:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
            addStep(newLogItem, 'Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            break
         // Livestock
         case 184:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: -1 })
            addStep(newLogItem, 'Plant production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
            addStep(newLogItem, 'MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2)
            addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         // Rad-Suits
         case 186:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            break
         // Energy Saving
         case 189:
            value = stateBoard.reduce(
               (total, field) =>
                  (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY'
                     ? total + 1
                     : total,
               0
            )
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value })
               addStep(newLogItem, `Energy production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.ENERGY], value)
            }
            break
         // Local Heat Trapping
         case 190:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -5 })
            addStep(newLogItem, 'Paid 5 heat', RESOURCES.HEAT, -5)
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD190_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 4 })
                  addStep(newLogItem, 'Received 4 plants', RESOURCES.PLANT, 4)
                  break
               case OPTION_ICONS.CARD190_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.ANIMAL, amount: 2 } })
                  addStep(newLogItem, `Received 2 animals to ${getCards(actionObj.targetId).name}`, RESOURCES.ANIMAL, 2)
                  break
               default:
                  break
            }
            break
         // Invention Contest
         case 192:
            // If Olympus Conference effect is played
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
               if (statePlayer.cardsPlayed.find((c) => c.id === 185).units.science === 0) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 } })
                  addStep(newLogItem, 'Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1)
               } else {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 } })
                  addStep(newLogItem, 'Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1)
                  updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
                  card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                  addStep(newLogItem, `Drew 1 card (${card1}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1)
               }
            }
            // Draw one of three cards
            updateCardsState_BusinessContacts(3, statePlayer, updateStatePlayer, nextCards, actionObj)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 1 card (${card1})`, RESOURCES.CARD, 1)
            // Call Mars University
            if (actionObj.MUtargetIds) {
               const id = actionObj.MUtargetIds[actionObj.MUtargetIds.length - 1]
               replaceCardMU(id, newLogItem)
               if (actionObj.MUtargetIds.length > 1) {
                  const id = actionObj.MUtargetIds[0]
                  replaceCardMU(id, newLogItem)
               }
            }
            break
         // Indentured Workers
         case 195:
            updateStatePlayer({ type: ACTIONS_PLAYER.APPLY_INDENTURED_WORKERS_EFFECT })
            addStep(newLogItem, 'INDENTURED WORKERS effect started', null, null)
            break
         // Lagrange Observatory
         case 196:
            // Receive 1 card
            updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 1 card (${card1})`, RESOURCES.CARD, 1)
            // If Olympus Conference effect is played
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
               if (statePlayer.cardsPlayed.find((c) => c.id === 185).units.science === 0) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 } })
                  addStep(newLogItem, 'Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1)
               } else {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 } })
                  addStep(newLogItem, 'Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1)
                  updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
                  card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                  addStep(newLogItem, `Drew 1 card (${card1}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1)
               }
            }
            // Call Mars University
            if (actionObj.MUtargetIds) {
               const id = actionObj.MUtargetIds[actionObj.MUtargetIds.length - 1]
               replaceCardMU(id, newLogItem)
               if (actionObj.MUtargetIds.length > 1) {
                  const id = actionObj.MUtargetIds[0]
                  replaceCardMU(id, newLogItem)
               }
            }
            break
         // Terraforming Ganymede
         case 197:
            value =
               statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.JOVIAN) ? total + 1 : total), 0) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.JOVIAN ? total + 1 : total), 0)
            updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: value })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            addStep(newLogItem, `TR raised by ${value}`, RESOURCES.TR, value)
            break
         // Immigration Shuttles
         case 198:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 5 })
            addStep(newLogItem, 'MC production increased by 5', [RESOURCES.PROD_BG, RESOURCES.MLN], 5)
            break
         // Immigrant City
         case 200:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
            addStep(newLogItem, 'MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2)
            if (!roboticWorkforce) {
               performTileActionsForLog(actionObj, newLogItem)
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               addStep(newLogItem, 'MC production increased by 1 from IMMIGRANT CITY effect', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            }
            break
         // Soletta
         case 203:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 7 })
            addStep(newLogItem, 'Heat production increased by 7', [RESOURCES.PROD_BG, RESOURCES.HEAT], 7)
            break
         // Technology Demonstration
         case 204:
            // Receive 2 card
            updateCardsState_ReceivedCards(2, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
            card2 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 2 cards (${card1} and ${card2})`, RESOURCES.CARD, 2)
            // If Olympus Conference effect is played
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
               if (statePlayer.cardsPlayed.find((c) => c.id === 185).units.science === 0) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 } })
                  addStep(newLogItem, 'Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1)
               } else {
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 } })
                  addStep(newLogItem, 'Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1)
                  updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
                  card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
                  addStep(newLogItem, `Drew 1 card (${card1}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1)
               }
            }
            // Call Mars University
            if (actionObj.MUtargetIds) {
               const id = actionObj.MUtargetIds[actionObj.MUtargetIds.length - 1]
               replaceCardMU(id, newLogItem)
               if (actionObj.MUtargetIds.length > 1) {
                  const id = actionObj.MUtargetIds[0]
                  replaceCardMU(id, newLogItem)
               }
            }
            break
         // Rad-Chem Factory
         case 205:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            if (!roboticWorkforce) performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TR2, newLogItem })
            break
         // Special Design
         case 206:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: 2 })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: true })
            addStep(newLogItem, 'SPECIAL DESIGN effect started', null, null)
            break
         // Medical Lab
         case 207:
            value = Math.floor(
               (statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.BUILDING) ? total + 1 : total), 0) +
                  statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.BUILDING ? total + 1 : total), 0)) /
                  2
            )
            if (value > 0) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
               addStep(newLogItem, `MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value)
            }
            break
         // AI Central
         case 208:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            if (!roboticWorkforce) addStep(newLogItem, `Action from ${getCards(actionObj.id).name} card is now active`, null, null)
            break
         default:
            break
      }
   }

   function performEffectForLog(effect, newLogItem, actionObj) {
      switch (effect) {
         // ======================== CORPORATION EFFECTS ========================
         case EFFECTS.EFFECT_CREDICOR:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 4 })
            addStep(newLogItem, 'Received 4 MC from CREDICOR effect', RESOURCES.MLN, 4)
            break
         case EFFECTS.EFFECT_INTERPLANETARY:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 })
            addStep(newLogItem, 'Received 2 MC from INTERPLANETARY CINEMATICS effect', RESOURCES.MLN, 2)
            break
         case EFFECTS.EFFECT_SATURN_SYSTEMS:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1 from SATURN SYSTEMS effect', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            break
         case EFFECTS.EFFECT_THARSIS_CITY:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
            addStep(newLogItem, 'Received 3 MC from THARSIS REPUBLIC effect', RESOURCES.MLN, 3)
            break
         case EFFECTS.EFFECT_THARSIS_CITY_ONPLANET:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1 from THARSIS REPUBLIC effect', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            break
         // ========================== CARD EFFECTS ==========================
         case EFFECTS.EFFECT_ARCTIC_ALGAE:
            // Arctic Algae effect implemented directly in the immediate effects
            // (for 1 ocean, 2 oceans and artificial lake card)
            break
         case EFFECTS.EFFECT_OPTIMAL_AEROBRAKING:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
            addStep(newLogItem, 'Received 3 MC from OPTIMAL AEROBRAKING effect', RESOURCES.MLN, 3)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: 3 })
            addStep(newLogItem, 'Received 3 heat from OPTIMAL AEROBRAKING effect', RESOURCES.HEAT, 3)
            break
         case EFFECTS.EFFECT_ROVER_CONSTRUCTION:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 })
            addStep(newLogItem, 'Received 2 MC from ROVER CONSTRUCTION effect', RESOURCES.MLN, 2)
            break
         case EFFECTS.EFFECT_MARS_UNIVERSITY:
            // Immediate effect implemented in Game component (useEffect) and immEffects module
            break
         case EFFECTS.EFFECT_VIRAL_ENHANCERS:
            let getPlantEffect = () => {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               addStep(newLogItem, 'Received 1 plant from VIRAL ENHANCERS effect', RESOURCES.PLANT, 1)
            }
            getCards(actionObj.id).tags.forEach((tag) => {
               let options = actionObj.option
               switch (tag) {
                  case TAGS.PLANT:
                  case TAGS.ANIMAL:
                     if (canCardHaveAnimals(actionObj.id)) {
                        if (options[options.length - 1] === OPTION_ICONS.CARD74_OPTION1) {
                           getPlantEffect()
                        } else {
                           updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.id, resource: RESOURCES.ANIMAL, amount: 1 } })
                           addStep(newLogItem, `Received 1 animal to ${getCards(actionObj.id).name}`, RESOURCES.ANIMAL, 1)
                           options = [options[0]]
                        }
                     } else {
                        getPlantEffect()
                     }
                     break
                  case TAGS.MICROBE:
                     if (canCardHaveMicrobes(actionObj.id)) {
                        if (options[options.length - 1] === OPTION_ICONS.CARD74_OPTION1) {
                           getPlantEffect()
                        } else {
                           updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.id, resource: RESOURCES.MICROBE, amount: 1 } })
                           addStep(newLogItem, `Received 1 microbe to ${getCards(actionObj.id).name}`, RESOURCES.MICROBE, 1)
                        }
                     } else {
                        getPlantEffect()
                     }
                     break
                  default:
                     break
               }
            })
            break
         case EFFECTS.EFFECT_MEDIA_GROUP:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
            addStep(newLogItem, 'Received 3 MC from MEDIA GROUP effect', RESOURCES.MLN, 3)
            break
         case EFFECTS.EFFECT_ECOLOGICAL_ZONE:
            getCards(actionObj.id).tags.forEach((tag) => {
               switch (tag) {
                  case TAGS.PLANT:
                  case TAGS.ANIMAL:
                     updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 128, resource: RESOURCES.ANIMAL, amount: 1 } })
                     addStep(newLogItem, 'Received 1 animal to ECOLOGICAL ZONE card from its effect', RESOURCES.ANIMAL, 1)
                     break
                  default:
                     break
               }
            })
            break
         case EFFECTS.EFFECT_DECOMPOSERS:
            getCards(actionObj.id).tags.forEach((tag) => {
               switch (tag) {
                  case TAGS.PLANT:
                  case TAGS.MICROBE:
                  case TAGS.ANIMAL:
                     updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 131, resource: RESOURCES.MICROBE, amount: 1 } })
                     addStep(newLogItem, 'Received 1 microbe to DECOMPOSERS card from its effect', RESOURCES.MICROBE, 1)
                     break
                  default:
                     break
               }
            })
            break
         case EFFECTS.EFFECT_HERBIVORES:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 147, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, 'Received 1 animal to HERBIVORES card from its effect', RESOURCES.ANIMAL, 1)
            break
         case EFFECTS.EFFECT_STANDARD_TECHNOLOGY:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
            addStep(newLogItem, 'Received 3 MC from STANDARD TECHNOLOGY effect', RESOURCES.MLN, 3)
            break
         case EFFECTS.EFFECT_PETS:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 172, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, 'Received 1 animal to PETS card from its effect', RESOURCES.ANIMAL, 1)
            break
         case EFFECTS.EFFECT_OLYMPUS_CONFERENCE:
            // Immediate effect implemented in Game component (useEffect) and immEffects module
            break
         case EFFECTS.EFFECT_IMMIGRANT_CITY:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
            addStep(newLogItem, 'MC production increased by 1 from IMMIGRANT CITY effect', [RESOURCES.PROD_BG, RESOURCES.MLN], 1)
            break
         default:
            break
      }
   }

   function performCardActionForLog(actionObj, newLogItem) {
      let value
      let card1
      let card2
      switch (actionObj.id) {
         // ===================== UNMI CORPORATION =====================
         case CORP_NAMES.UNMI:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            addStep(newLogItem, 'TR raised by 1', RESOURCES.TR, 1)
            break
         // =========================== CARDS ==========================
         // Search For Life
         case 5:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            updateCardsState_CardNotSelected(statePlayer, updateStatePlayer, nextCards)
            if (actionObj.ids) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 5, resource: RESOURCES.SCIENCE, amount: 1 } })
               addStep(newLogItem, 'Received 1 science to SEARCH FOR LIFE card', RESOURCES.SCIENCE, 1)
            }
            break
         // Inventors' Guild and Business Network
         case 6:
         case 110:
            if (actionObj.ids) {
               if (actionObj.paidMln) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
                  addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
               }
               if (actionObj.paidHeat) {
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
                  addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
               }
               updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
               card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
               addStep(newLogItem, `Drew 1 card (${card1})`, RESOURCES.CARD, 1)
            } else {
               updateCardsState_CardNotSelected(statePlayer, updateStatePlayer, nextCards)
            }
            break
         // Martian Rails
         case 7:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 })
            addStep(newLogItem, 'Paid 1 energy', RESOURCES.ENERGY, -1)
            value = stateBoard.filter(
               (field) =>
                  (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY'
            ).length
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value })
            addStep(newLogItem, `Received ${value} MC`, RESOURCES.MLN, value)
            break
         // Water Import From Europa and Aquifer Pumping
         case 12:
         case 187:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidSteel) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -actionObj.paidSteel })
               addStep(newLogItem, `Paid ${actionObj.paidSteel} steel`, RESOURCES.STEEL, -actionObj.paidSteel)
            }
            if (actionObj.paidTitan) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -actionObj.paidTitan })
               addStep(newLogItem, `Paid ${actionObj.paidTitan} titanium`, RESOURCES.TITAN, -actionObj.paidTitan)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.AQUIFER, newLogItem })
            break
         // Space Elevator
         case 13:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -1 })
            addStep(newLogItem, 'Paid 1 steel', RESOURCES.STEEL, -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 5 })
            addStep(newLogItem, 'Received 1 MC', RESOURCES.MLN, 1)
            break
         // Development Center
         case 14:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 })
            addStep(newLogItem, 'Paid 1 energy', RESOURCES.ENERGY, -1)
            updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 1 card (${card1})`, RESOURCES.CARD, 1)
            break
         // Equatorial Magnetizer
         case 15:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
            addStep(newLogItem, 'Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1)
            updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            addStep(newLogItem, 'TR raised by 1', RESOURCES.TR, 1)
            break
         // Predators, Fish, Small Animals, Birds and Livestock
         case 24:
         case 52:
         case 54:
         case 72:
         case 184:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.id, resource: RESOURCES.ANIMAL, amount: 1 } })
            addStep(newLogItem, `Received 1 animal to ${getCards(actionObj.id).name}`, RESOURCES.ANIMAL, 1)
            break
         // Security Fleet
         case 28:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -1 })
            addStep(newLogItem, 'Paid 1 titanium', RESOURCES.TITAN, -1)
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 28, resource: RESOURCES.FIGHTER, amount: 1 } })
            addStep(newLogItem, 'Received 1 fighter to SECURITY FLEET card', RESOURCES.FIGHTER, 1)
            break
         // Regolith Eaters
         case 33:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD33_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 33, resource: RESOURCES.MICROBE, amount: 1 } })
                  addStep(newLogItem, 'Received 1 microbe to REGOLITH EATERS', RESOURCES.MICROBE, 1)
                  break
               case OPTION_ICONS.CARD33_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 33, resource: RESOURCES.MICROBE, amount: -2 } })
                  addStep(newLogItem, 'Removed 2 microbes from REGOLITH EATERS', RESOURCES.MICROBE, -2)
                  performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
                  break
               default:
                  break
            }
            break
         // GHG Producing Bacteria
         case 34:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD34_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 34, resource: RESOURCES.MICROBE, amount: 1 } })
                  addStep(newLogItem, 'Received 1 microbe to GHG PRODUCING BACTERIA', RESOURCES.MICROBE, 1)
                  break
               case OPTION_ICONS.CARD34_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 34, resource: RESOURCES.MICROBE, amount: -2 } })
                  addStep(newLogItem, 'Removed 2 microbes from GHG PRODUCING BACTERIA', RESOURCES.MICROBE, -2)
                  performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TEMPERATURE, newLogItem })
                  break
               default:
                  break
            }
            break
         // Nitrite Reducing Bacteria
         case 157:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD157_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 157, resource: RESOURCES.MICROBE, amount: 1 } })
                  addStep(newLogItem, 'Received 1 microbe to NITRITE REDUCING BACTERIA', RESOURCES.MICROBE, 1)
                  break
               case OPTION_ICONS.CARD157_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 157, resource: RESOURCES.MICROBE, amount: -3 } })
                  addStep(newLogItem, 'Removed 3 microbes from NITRITE REDUCING BACTERIA', RESOURCES.MICROBE, -3)
                  performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.TR, newLogItem })
                  break
               default:
                  break
            }
            break
         // Ants and Tardigrades
         case 35:
         case 49:
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.id, resource: RESOURCES.MICROBE, amount: 1 } })
            addStep(newLogItem, `Received 1 microbe to ${getCards(actionObj.id).name}`, RESOURCES.MICROBE, 1)
            break
         // Electro Catapult
         case 69:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD69_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -1 })
                  addStep(newLogItem, 'Paid 1 steel', RESOURCES.STEEL, -1)
                  break
               case OPTION_ICONS.CARD69_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -1 })
                  addStep(newLogItem, 'Paid 1 plant', RESOURCES.PLANT, -1)
                  break
               default:
                  break
            }
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 7 })
            addStep(newLogItem, 'Received 7 MC', RESOURCES.MLN, 7)
            break
         // Space Mirrors
         case 76:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 })
            addStep(newLogItem, 'Energy production increased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 1)
            break
         // Physics Complex
         case 95:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -6 })
            addStep(newLogItem, 'Paid 6 energy', RESOURCES.ENERGY, -6)
            updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: 95, resource: RESOURCES.SCIENCE, amount: 1 } })
            addStep(newLogItem, 'Received 1 science to PHYSICS COMPLEX card', RESOURCES.SCIENCE, 1)
            break
         // Ironworks
         case 101:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 })
            addStep(newLogItem, 'Paid 4 energy', RESOURCES.ENERGY, -4)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 1 })
            addStep(newLogItem, 'Received 1 steel', RESOURCES.STEEL, 1)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // Steelworks
         case 103:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 })
            addStep(newLogItem, 'Paid 4 energy', RESOURCES.ENERGY, -4)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 })
            addStep(newLogItem, 'Received 2 steel', RESOURCES.STEEL, 2)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // Ore Processor
         case 104:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 })
            addStep(newLogItem, 'Paid 4 energy', RESOURCES.ENERGY, -4)
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 1 })
            addStep(newLogItem, 'Received 1 titanium', RESOURCES.TITAN, 1)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // Industrial Center
         case 123:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
            addStep(newLogItem, 'Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1)
            break
         // Symbiotic Fungus
         case 133:
            if (actionObj.targetId) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.MICROBE, amount: 1 } })
               addStep(newLogItem, `Received 1 microbe to ${getCards(actionObj.targetId).name}`, RESOURCES.MICROBE, 1)
            }
            break
         // Extreme-Cold Fungus
         case 134:
            switch (actionObj.option[0]) {
               case OPTION_ICONS.CARD134_OPTION1:
                  updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
                  addStep(newLogItem, 'Received 1 plant', RESOURCES.PLANT, 1)
                  break
               case OPTION_ICONS.CARD134_OPTION2:
                  updateStatePlayer({ type: ACTIONS_PLAYER.ADD_BIO_RES, payload: { cardId: actionObj.targetId, resource: RESOURCES.MICROBE, amount: 2 } })
                  addStep(newLogItem, `Received 2 microbes to ${getCards(actionObj.targetId).name}`, RESOURCES.MICROBE, 2)
                  break
               default:
                  break
            }
            break
         // Caretaker Contract
         case 154:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
            addStep(newLogItem, 'Paid 8 heat', RESOURCES.HEAT, -8)
            updateStateGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
            updateStatePlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            addStep(newLogItem, 'TR raised by 1', RESOURCES.TR, 1)
            break
         // Water Splitting Plant
         case 177:
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -3 })
            addStep(newLogItem, 'Paid 3 energy', RESOURCES.ENERGY, -3)
            performImmEffectForLog({ actionObj, immEffectName: IMM_EFFECTS.OXYGEN, newLogItem })
            break
         // Power Infrasctructure
         case 194:
            if (actionObj.option[0]) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -actionObj.option[0] })
               addStep(newLogItem, `Paid ${actionObj.option[0]} energy`, RESOURCES.ENERGY, -actionObj.option[0])
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: actionObj.option[0] })
               addStep(newLogItem, `Received ${actionObj.option[0]} MC`, RESOURCES.MLN, actionObj.option[0])
            }
            break
         // Restricted Area
         case 199:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            updateCardsState_ReceivedCards(1, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 1 card (${card1})`, RESOURCES.CARD, 1)
            break
         // Underground Detonations
         case 202:
            if (actionObj.paidMln) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               addStep(newLogItem, `Paid ${actionObj.paidMln} MC`, RESOURCES.MLN, -actionObj.paidMln)
            }
            if (actionObj.paidHeat) {
               updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
               addStep(newLogItem, `Paid ${actionObj.paidHeat} heat`, RESOURCES.HEAT, -actionObj.paidHeat)
            }
            updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
            addStep(newLogItem, 'Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2)
            break
         // AI Central
         case 208:
            updateCardsState_ReceivedCards(2, statePlayer, updateStatePlayer, nextCards)
            card1 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 2].name
            card2 = statePlayer.cardsInHand[statePlayer.cardsInHand.length - 1].name
            addStep(newLogItem, `Drew 2 cards (${card1} and ${card2})`, RESOURCES.CARD, 2)
            break
         default:
            break
      }
   }

   if (logItems.length === logItemIdForReplay && !forfeited) stateModal.endStats = true

   return { convertedLogItems, newStatePlayer: statePlayer, newStateGame: stateGame, newStateBoard: stateBoard, newStateModal: stateModal }
}

function remove_id(object, keyToRemove = '_id') {
   if (object.hasOwnProperty(keyToRemove)) delete object[keyToRemove]
   return object
}

function updateCardsState_BoughtCards(ids, statePlayer, updateStatePlayer) {
   const cards = getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(ids)), statePlayer)
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND, payload: cards })
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_PURCHASED, payload: cards })
}

function updateCardsState_ReceivedCards(count, statePlayer, updateStatePlayer, nextCards) {
   const nextCardsIds = nextCards.slice(0, count)
   const cards = getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(nextCardsIds)), statePlayer)
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND, payload: cards })
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_SEEN, payload: cards })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DRAW, payload: nextCardsIds })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DECK, payload: statePlayer.cardsDeckIds.filter((id) => !nextCardsIds.includes(id)) })
   nextCards.splice(0, count)
}

function updateCardsState_BusinessContacts(count, statePlayer, updateStatePlayer, nextCards, actionObj) {
   const nextCardsIds = nextCards.slice(0, count)
   const cards = getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(nextCardsIds)), statePlayer)
   const cardsSelected = getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(actionObj.ids)), statePlayer)
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND, payload: cardsSelected })
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_SEEN, payload: cards })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DRAW, payload: nextCardsIds })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DECK, payload: statePlayer.cardsDeckIds.filter((id) => !nextCardsIds.includes(id)) })
   nextCards.splice(0, count)
}

function updateCardsState_CardNotSelected(statePlayer, updateStatePlayer, nextCards) {
   const nextCardsIds = nextCards.slice(0, 1)
   const card = getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(nextCardsIds)), statePlayer)
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_SEEN, payload: card })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DRAW, payload: nextCardsIds })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DECK, payload: statePlayer.cardsDeckIds.filter((id) => !nextCardsIds.includes(id)) })
   nextCards.splice(0, 1)
}

function updateCardsState_Draft(statePlayer, updateStatePlayer, nextCards) {
   const nextCardsIds = nextCards.slice(0, 4)
   const cards = getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(nextCardsIds)), statePlayer)
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_SEEN, payload: cards })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DRAW, payload: nextCardsIds })
   updateStatePlayer({ type: ACTIONS_PLAYER.SET_CARDS_DECK, payload: statePlayer.cardsDeckIds.filter((id) => !nextCardsIds.includes(id)) })
   nextCards.splice(0, 4)
}

function updateCardsState_Played(statePlayer, updateStatePlayer, ids) {
   updateStatePlayer({ type: ACTIONS_PLAYER.REMOVE_CARDS_IN_HAND, payload: ids })
   updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_PLAYED, payload: getCardsWithDecreasedCost(getCardsWithTimePlayed(getCards(ids)), statePlayer) })
}

function addStep(logItem, name, iconName, value) {
   logItem.details.steps.push({ singleActionName: name, singleActionIconName: iconName, singleActionValue: value })
}
