import { getConsecutiveCardsIds } from '../api/matchWithId'
import { getRandIntNumbers } from '../api/other'
import { MATCH_TYPES } from '../data/app'
import { CARDS } from '../data/cards'
import { CORP_NAMES } from '../data/corpNames'
import { EFFECTS } from '../data/effects/effectIcons'
import { TAGS } from '../data/tags'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'

// Checks if a card has given tag
export const hasTag = (card, type) => {
   if (!card) return false
   return card.tags.includes(type)
}

// The base is 2 rows and 5 columns in one view
export const getPositionInModalCards = (length, id) => {
   let top
   let left
   let page = Math.floor(id / 10) + 1

   // Calculate top
   if (length % 10 >= 1 && length % 10 <= 5 && length - (id + 1) <= 4 && id % 10 >= 0 && id % 10 <= 4) {
      top = '50%'
   } else {
      if (id % 10 >= 0 && id % 10 <= 4) {
         top = '29%'
      } else {
         top = '71%'
      }
   }

   // Calculate left
   if (length % 10 >= 1 && length % 10 <= 4 && length - (id + 1) <= 3 && id % 10 >= 0 && id % 10 <= 3) {
      switch (length % 10) {
         case 4:
            left = `${50 - 100 / 6 - 100 / 12 + (id % 5) * (100 / 6) + (page - 1) * 100}%`
            break
         case 3:
            left = `${100 / 3 + (id % 5) * (100 / 6) + (page - 1) * 100}%`
            break
         case 2:
            left = `${50 - 100 / 12 + (id % 5) * (100 / 6) + (page - 1) * 100}%`
            break
         case 1:
            left = `${50 + (page - 1) * 100}%`
            break
         default:
            break
      }
   } else {
      left = `${100 / 6 + (id % 5) * (100 / 6) + (page - 1) * 100}%`
   }

   return { top: `${top}`, left: `${left}` }
}

// A function that decreases cost of the card based on current decreasing cost effects
export function getCardsWithDecreasedCost(cards, statePlayer, justPlayedEffect, isIndenturedWorkersEffectOn) {
   let currentEffects = [...statePlayer.corporation.effects]
   if (justPlayedEffect) currentEffects = [...currentEffects, justPlayedEffect]
   statePlayer.cardsPlayed.forEach((card) => {
      if (card.effect !== null) currentEffects.push(card.effect)
   })
   let newCards = cards.map((card) => {
      let costLess = 0
      // All cards cost deduction
      if (currentEffects.includes(EFFECTS.EFFECT_RESEARCH_OUTPOST)) costLess += 1
      if (currentEffects.includes(EFFECTS.EFFECT_EARTH_CATAPULT)) costLess += 2
      if (currentEffects.includes(EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY)) costLess += 2
      if (isIndenturedWorkersEffectOn === undefined) {
         if (statePlayer.indenturedWorkersEffect) costLess += 8
      }
      // Earth cards cost deduction
      if (card.tags.includes(TAGS.EARTH)) {
         if (currentEffects.includes(EFFECTS.EFFECT_EARTH_OFFICE)) costLess += 3
         if (currentEffects.includes(EFFECTS.EFFECT_TERACTOR)) costLess += 3
      }
      // Power cards cost deduction
      if (card.tags.includes(TAGS.POWER)) {
         if (currentEffects.includes(EFFECTS.EFFECT_THORGATE)) costLess += 3
      }
      // Space cards cost deduction
      if (card.tags.includes(TAGS.SPACE)) {
         if (currentEffects.includes(EFFECTS.EFFECT_SPACE_STATION)) costLess += 2
         if (currentEffects.includes(EFFECTS.EFFECT_SHUTTLES)) costLess += 2
         if (currentEffects.includes(EFFECTS.EFFECT_MASS_CONVERTER)) costLess += 2
         if (currentEffects.includes(EFFECTS.EFFECT_QUANTUM_EXTRACTOR)) costLess += 2
      }
      return { ...card, currentCost: Math.max(card.originalCost - costLess, 0) }
   })
   return newCards
}

export function getCardsWithPossibleMicrobes(statePlayer) {
   return statePlayer.cardsPlayed.filter((card) => card.id === 33 || card.id === 34 || card.id === 35 || card.id === 49 || card.id === 131 || card.id === 157)
}

export function getCardsWithPossibleAnimals(statePlayer) {
   return statePlayer.cardsPlayed.filter(
      (card) => card.id === 24 || card.id === 52 || card.id === 54 || card.id === 72 || card.id === 128 || card.id === 147 || card.id === 172 || card.id === 184
   )
}

export function getCardsWithPossibleScience(statePlayer) {
   return statePlayer.cardsPlayed.filter((card) => card.id === 5 || card.id === 95 || card.id === 185)
}

export function getCardsWithPossibleFighters(statePlayer) {
   return statePlayer.cardsPlayed.filter((card) => card.id === 28)
}

export function canCardHaveMicrobes(cardId) {
   return cardId === 33 || cardId === 34 || cardId === 35 || cardId === 49 || cardId === 131 || cardId === 157
}

export function canCardHaveAnimals(cardId) {
   return cardId === 24 || cardId === 52 || cardId === 54 || cardId === 72 || cardId === 128 || cardId === 147 || cardId === 172 || cardId === 184
}

export function canCardHaveScience(cardId) {
   return cardId === 5 || cardId === 95 || cardId === 185
}

export function canCardHaveFighters(cardId) {
   return cardId === 28
}

export function getActionIdsWithCost() {
   return [CORP_NAMES.UNMI, 5, 12, 76, 123, 187, 199, 202]
}

export function getCardActionCost(cardIdOrUnmi) {
   let cost = 0
   switch (cardIdOrUnmi) {
      // UNMI
      case CORP_NAMES.UNMI:
         cost = 3
         break
      // Search For Life
      case 5:
         cost = 1
         break
      // Water Import From Europa
      case 12:
         cost = 12
         break
      // Space Mirrors and Industrial Center
      case 76:
      case 123:
         cost = 7
         break
      // Aquifer Pumping
      case 187:
         cost = 8
         break
      // Restricted Area
      case 199:
         cost = 2
         break
      // Underground Detonations
      case 202:
         cost = 10
         break
      default:
         break
   }
   return cost
}

export const getCardType = (card) => {
   return hasTag(card, TAGS.EVENT)
      ? 'red'
      : card.effect !== null || card.iconNames.action !== null || card.id === 173 // Protected Habitats
      ? 'blue'
      : 'green'
}

export const getCardsSorted = (cards, id, requirementsMet) => {
   if (cards.length > 1) {
      let sortOrder
      switch (id) {
         case '1a':
            cards.sort((a, b) => (a.currentCost <= b.currentCost ? 1 : -1))
            return cards
         case '1b':
            cards.sort((a, b) => (a.currentCost >= b.currentCost ? 1 : -1))
            return cards
         case '2a':
            sortOrder = ['green', 'blue', 'red']
            cards.sort((a, b) => sortOrder.indexOf(getCardType(a)) - sortOrder.indexOf(getCardType(b)))
            return cards
         case '2b':
            sortOrder = ['red', 'blue', 'green']
            cards.sort((a, b) => sortOrder.indexOf(getCardType(a)) - sortOrder.indexOf(getCardType(b)))
            return cards
         case '3a':
            sortOrder = [TAGS.BUILDING, TAGS.SPACE, TAGS.POWER, TAGS.SCIENCE, TAGS.JOVIAN, TAGS.EARTH, TAGS.PLANT, TAGS.MICROBE, TAGS.ANIMAL, TAGS.CITY, TAGS.EVENT]
            cards.sort((a, b) => {
               let tagsA = ''
               let tagsB = ''
               let foundTag = ''
               for (let i = 0; i < sortOrder.length; i++) {
                  // eslint-disable-next-line
                  foundTag = a.tags.find((tag) => tag === sortOrder[i])
                  if (foundTag) tagsA += foundTag
               }
               for (let i = 0; i < sortOrder.length; i++) {
                  // eslint-disable-next-line
                  foundTag = b.tags.find((tag) => tag === sortOrder[i])
                  if (foundTag) tagsB += foundTag
               }
               return tagsA >= tagsB ? 1 : -1
            })
            return cards
         case '3b':
            sortOrder = [TAGS.BUILDING, TAGS.SPACE, TAGS.POWER, TAGS.SCIENCE, TAGS.JOVIAN, TAGS.EARTH, TAGS.PLANT, TAGS.MICROBE, TAGS.ANIMAL, TAGS.CITY, TAGS.EVENT]
            cards.sort((a, b) => {
               let tagsA = ''
               let tagsB = ''
               let foundTag = ''
               for (let i = 0; i < sortOrder.length; i++) {
                  foundTag = a.tags.find((tag) => tag === sortOrder[i])
                  if (foundTag) tagsA += foundTag
               }
               for (let i = 0; i < sortOrder.length; i++) {
                  foundTag = b.tags.find((tag) => tag === sortOrder[i])
                  if (foundTag) tagsB += foundTag
               }
               return tagsA <= tagsB ? 1 : -1
            })
            return cards
         case '4a':
            cards.sort((a, b) => (a.timeAdded >= b.timeAdded ? 1 : -1))
            return cards
         case '4b':
            cards.sort((a, b) => (a.timeAdded <= b.timeAdded ? 1 : -1))
            return cards
         case '4a-played':
            cards.sort((a, b) => (a.timePlayed >= b.timePlayed ? 1 : -1))
            return cards
         case '4b-played':
            cards.sort((a, b) => (a.timePlayed <= b.timePlayed ? 1 : -1))
            return cards
         case '5a':
            cards.sort((a, b) => {
               let availabilityA = requirementsMet(a) ? 'available' : 'not-available'
               let availabilityB = requirementsMet(b) ? 'available' : 'not-available'
               return availabilityA <= availabilityB ? 1 : -1
            })
            return cards
         case '5b':
            cards.sort((a, b) => {
               let availabilityA = requirementsMet(a) ? 'available' : 'not-available'
               let availabilityB = requirementsMet(b) ? 'available' : 'not-available'
               return availabilityA >= availabilityB ? 1 : -1
            })
            return cards
         default:
            return cards
      }
   } else {
      return cards
   }
}

export const getCardsWithTimeAdded = (cards) => {
   if (Array.isArray(cards)) {
      return cards.map((card, idx) => ({ ...card, timeAdded: Date.now() + idx }))
   } else {
      return [{ ...cards, timeAdded: Date.now() + 0 }]
   }
}

export const getCardsWithTimePlayed = (cards) => {
   if (Array.isArray(cards)) {
      return cards.map((card, idx) => ({ ...card, timePlayed: Date.now() + idx }))
   } else {
      return [{ ...cards, timePlayed: Date.now() + 0 }]
   }
}

export const getCards = (cardsIds) => {
   if (!cardsIds) return null
   if (Array.isArray(cardsIds)) {
      return cardsIds.map(id => CARDS[id - 1])
   } else {
      return CARDS[cardsIds - 1]
   }
}

export const getNewCardsDrawIds = async (count, statePlayer, dispatchPlayer, type, id, token, dataForReplay, additionalDeckIds) => {
   let cardsDeckIds
   let newCardsDrawIds
   let newCardsDeckIds
   cardsDeckIds = additionalDeckIds ? statePlayer.cardsDeckIds.filter((id) => !additionalDeckIds.includes(id)) : statePlayer.cardsDeckIds
   if (type === MATCH_TYPES.QUICK_MATCH_ID) {
      const drawCardsIds = await getConsecutiveCardsIds(token, id, 208 - cardsDeckIds.length, count)
      newCardsDrawIds = drawCardsIds
      newCardsDeckIds = cardsDeckIds.filter((cardId) => !drawCardsIds.includes(cardId))
   } else if (type === MATCH_TYPES.REPLAY) {
      const cardsInOrderIds = [...dataForReplay.cards.seen.map(c => c.id), ...dataForReplay.cards.inDeck]
      const drawCardsIds = cardsInOrderIds.slice(208 - cardsDeckIds.length, 208 - cardsDeckIds.length + count)
      newCardsDrawIds = drawCardsIds
      newCardsDeckIds = cardsDeckIds.filter((cardId) => !drawCardsIds.includes(cardId))
   } else {
      const drawIndexes = await getRandIntNumbers(count, 0, cardsDeckIds.length - 1)
      newCardsDrawIds = cardsDeckIds.filter((_, idx) => drawIndexes.includes(idx))
      newCardsDeckIds = cardsDeckIds.filter((_, idx) => !drawIndexes.includes(idx))
   }

   dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_DRAW, payload: newCardsDrawIds })
   dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_DECK, payload: newCardsDeckIds })
   return newCardsDrawIds
}
