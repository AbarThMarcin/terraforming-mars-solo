import { LOG_TYPES } from "../data/log/log"
import { getCards } from "./cards"
import { getCorporationById } from "./corporation"

export const getStatePlayerWithAllData = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      ...newStatePlayer,
      corporation: getCorporationById(newStatePlayer.corporation),
      cardsInHand: getCards(newStatePlayer.cardsInHand),
      cardsPlayed: getCards(newStatePlayer.cardsPlayed),
      cardsSeen: getCards(newStatePlayer.cardsSeen),
      cardsPurchased: getCards(newStatePlayer.cardsPurchased),
   }

   return newStatePlayer
}

export const getEndedGameCardsWithAllData = (cards) => {
   let newCards = JSON.parse(JSON.stringify(cards))
   newCards = {
      ...newCards,
      played: getCards(newCards.played.map((c) => c.id)),
      seen: getCards(newCards.seen.map((c) => c.id)),
      purchased: getCards(newCards.purchased.map((c) => c.id)),
   }

   return newCards
}

export const getThinerStatePlayer = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      ...newStatePlayer,
      corporation: newStatePlayer.corporation ? newStatePlayer.corporation.id : null,
      cardsInHand: newStatePlayer.cardsInHand.map((c) => getThinerCard(c)),
      cardsPlayed: newStatePlayer.cardsPlayed.map((c) => getThinerCard(c)),
      cardsSeen: newStatePlayer.cardsSeen.map((c) => getThinerCard(c)),
      cardsPurchased: newStatePlayer.cardsPurchased.map((c) => getThinerCard(c)),
   }

   return newStatePlayer
}

export const getThinerLogStatePlayer = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      production: newStatePlayer.production,
      resources: newStatePlayer.resources,
      corporation: newStatePlayer.corporation ? { name: newStatePlayer.corporation.name, effects: newStatePlayer.corporation.effects } : null,
      cardsPlayed: newStatePlayer.cardsPlayed.map((c) => {
         return { id: c.id, name: c.name, vp: c.vp, iconNames: { action: c.iconNames.action }, effect: c.effect, units: c.units }
      }),
      cardsInHand: newStatePlayer.cardsInHand.map((c) => {
         return { id: c.id, name: c.name }
      }),
      totalPoints: newStatePlayer.totalPoints,
   }

   return newStatePlayer
}

export const getThinerLogStateGame = (stateGame) => {
   let newStateGame = JSON.parse(JSON.stringify(stateGame))
   newStateGame = {
      tr: newStateGame.tr,
      globalParameters: newStateGame.globalParameters,
   }

   return newStateGame
}

export const getThinerEndedGameCards = (statePlayer) => {
   let copyStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   const newCards = {
      played: copyStatePlayer.cardsPlayed.map((c) => getThinerCard(c)),
      seen: copyStatePlayer.cardsSeen.map((c) => getThinerCard(c)),
      purchased: copyStatePlayer.cardsPurchased.map((c) => getThinerCard(c)),
      inDeck: copyStatePlayer.cardsDeckIds,
   }

   return newCards
}

function getThinerCard(c) {
   return { id: c.id, currentCost: c.currentCost, vp: c.vp, units: c.units, actionUsed: c.actionUsed, timeAdded: c.timeAdded, timePlayed: c.timePlayed }
}

export const getLogConvertedForDB = (logItems) => {
   // return logItems

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

export const getLogConvertedForGame = (logItems, initStateBoard) => {
   let newLogItems = []
   let newStateBoard = JSON.parse(JSON.stringify(initStateBoard))

   logItems.forEach((logItem) => {
      switch (logItem.type) {
         case LOG_TYPES.GENERATION:
            break
         case LOG_TYPES.DRAFT:
            break
         case LOG_TYPES.FORCED_ACTION:
            break
         case LOG_TYPES.IMMEDIATE_EFFECT:
            break
         case LOG_TYPES.CARD_ACTION:
            break
         case LOG_TYPES.CONVERT_PLANTS:
            break
         case LOG_TYPES.CONVERT_HEAT:
            break
         case LOG_TYPES.SP_ACTION:
            break
         case LOG_TYPES.PASS:
            break
         case LOG_TYPES.FINAL_CONVERT_PLANTS:
            break
         default:
            break
      }
   })

   return newLogItems
}