import { LOG_TYPES } from '../data/log'
import { INIT_STATE_GAME_LOG } from '../initStates/initStateGame'
import { INIT_STATE_PLAYER } from '../initStates/initStatePlayer'
import { ACTIONS_BOARD, reducerBoard } from '../stateActions/actionsBoard'
import { ACTIONS_GAME, reducerGame } from '../stateActions/actionsGame'
import { ACTIONS_PLAYER, reducerPlayer } from '../stateActions/actionsPlayer'
import { getCards } from './cards'
import { getCorporationById } from './corporation'

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
      cardsInHand: getCards(newStatePlayer.cardsInHand.map((c) => c.id)),
      cardsPlayed: getCards(newStatePlayer.cardsPlayed.map((c) => c.id)),
      cardsSeen: getCards(newStatePlayer.cardsSeen.map((c) => c.id)),
      cardsPurchased: getCards(newStatePlayer.cardsPurchased.map((c) => c.id)),
   }

   return newStatePlayer
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
   const word = actionString.slice(0, actionString.indexOf('['))
   actionObj[word] = true
   actionString = actionString.slice(word.length)

   // Parse the rest of the string
   while (actionString.length > 0) {
      const match = actionString.match(/([a-zA-Z]+):\s*([^;\]]+)(;|\])?/)
      if (match) {
         const [, key, value, delimiter] = match
         if (key === 'ids') {
            if (!actionObj[key]) actionObj[key] = []
            actionObj[key].push(value.split(',').map((id) => parseInt(id.trim())))
         } else {
            if (!isNaN(value)) {
               actionObj[key] = parseInt(value)
            } else {
               actionObj[key] = value
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
export const getLogConvertedForGame = (logItems, initStateBoard, cardsInOrder) => {
   // Result, after modification
   let newLogItems = []

   // Current player & game states parameters
   let generation = 0

   // statePlayer: {
   //   production: newStatePlayer.production,
   //   resources: newStatePlayer.resources,
   //   corporation: newStatePlayer.corporation ? newStatePlayer.corporation.id : null,
   //   cardsPlayed: newStatePlayer.cardsPlayed.map((c) => ({ id: c.id, vp: c.vp, units: c.units })),
   //   cardsInHand: newStatePlayer.cardsInHand.map((c) => c.id),
   //   totalPoints: newStatePlayer.totalPoints,
   // }
   let statePlayer = getThinerLogStatePlayer(INIT_STATE_PLAYER)

   // stateGame: {
   //   tr: newStateGame.tr,
   //   globalParameters: newStateGame.globalParameters,
   // }
   let stateGame = JSON.parse(JSON.stringify(INIT_STATE_GAME_LOG))

   // All data for board object
   let stateBoard = JSON.parse(JSON.stringify(initStateBoard))

   // Just ids
   let nextCards = JSON.parse(JSON.stringify(cardsInOrder))

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

   logItems.forEach((logItem) => {
      const newLogItem = JSON.parse(JSON.stringify(logItem))

      if (logItem.type === LOG_TYPES.GENERATION) {
         // If logItem is a generation, return the same object
         generation++
         newLogItems.push(newLogItem)
      } else {
         const actionObj = parseActionStringToObject(logItem.action)
         if (actionObj.draft) {
            // If gen 1, set corporation and add corp resources and production to statePlayer
            if (generation === 1) updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_CORPORATION_LOG, payload: actionObj.corpId })
            // Add stateBefore
            newLogItem.details = { stateBefore: { statePlayer, stateGame } }
            // If bought 1+ cards, update cardsInHand and resources. Also slice nextCards cardsDeckIds,
            // regardless of number of cards bought; 10 if gen 1, 4 if gen > 1
            if (actionObj.ids) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND, payload: actionObj.ids })
               if (actionObj.paidMln) updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actionObj.paidMln })
               if (actionObj.paidHeat) updateStatePlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actionObj.paidHeat })
            }
            if (generation === 1) {
               nextCards.splice(0, 10)
            } else {
               nextCards.splice(0, 4)
            }
            // Add stateAfter
            newLogItem.details.stateAfter = { statePlayer, stateGame }
            newLogItems.push(newLogItem)










            
            // GDZIES WCZESNIEJ DODAC TWORZENIE I DODANIE OBIEKTU STEPS













         } else {
            newLogItem.details = { stateBefore: { statePlayer, stateGame } }
            if (actionObj.forcedInventrix) {
               updateStatePlayer({ type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND, payload: nextCards.slice(0, 3) })
               nextCards.splice(0, 3)
            } else if (actionObj.forcedTharsis) {
               // Updates
            } else if (actionObj.spSellPatent) {
               // Updates
            } else if (actionObj.immEffect) {
               // Updates
            } else if (actionObj.cardAction) {
               // Updates
            } else if (actionObj.sp) {
               // Updates
            } else if (actionObj.convertHeat) {
               // Updates
            } else if (actionObj.convertGreenery) {
               // Updates
            } else if (actionObj.pass) {
               // Updates
            }

            newLogItem.details.stateAfter = { statePlayer, stateGame }
            newLogItems.push(newLogItem)
         }
      }
   })

   return newLogItems
}
