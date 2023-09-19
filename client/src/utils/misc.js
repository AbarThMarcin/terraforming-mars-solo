import { getConsecutiveCardsIds } from '../api/matchWithId'
import { getRandIntNumbers } from '../api/other'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { TILES } from '../data/board'
import { CARDS } from '../data/cards'
import { CORP_NAMES } from '../data/corpNames'
import { CORPORATIONS } from '../data/corporations'
import { EFFECTS } from '../data/effects/effectIcons'
import { TAGS } from '../data/tags'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'

// Shuffles array
export const shuffle = (array) => {
   let currentIndex = array.length,
      randomIndex
   while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
   }
   return array
}

// The base is 2 rows and 5 columns in one view
export const getPosition = (length, id) => {
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

// Checks if a card has given tag
export const hasTag = (card, type) => {
   if (!card) return false
   return card.tags.includes(type)
}

// Returns initial board with randomly positioned two cities with two greeneries
export const addNeutralTiles = ([...initBoard]) => {
   if (initBoard.length === 0) return initBoard

   let citiesLeft = 2 // Neutral cities amount per board

   while (citiesLeft > 0) {
      let cityId = randomInteger(0, initBoard.length - 1)
      let neighbors = getNeighbors(initBoard[cityId].x, initBoard[cityId].y, initBoard)
      if (
         !initBoard[cityId].oceanOnly &&
         !initBoard[cityId].object &&
         initBoard[cityId].name !== 'NOCTIS CITY' &&
         initBoard[cityId].name !== 'PHOBOS SPACE HAVEN' &&
         initBoard[cityId].name !== 'GANYMEDE COLONY' &&
         !hasNeutralCityOrGreenery(neighbors)
      ) {
         initBoard[cityId].object = TILES.CITY_NEUTRAL
         let greeneriesLeft = 1 // Greeneries amount per city
         while (greeneriesLeft > 0) {
            let greeneryId = randomInteger(0, neighbors.length - 1)
            if (!neighbors[greeneryId].oceanOnly && !neighbors[greeneryId].object && neighbors[greeneryId].name !== 'NOCTIS CITY') {
               initBoard.forEach((field) => {
                  if (field.x === neighbors[greeneryId].x && field.y === neighbors[greeneryId].y) field.object = TILES.GREENERY_NEUTRAL
               })
               greeneriesLeft--
            }
         }
         citiesLeft--
      }
   }

   return initBoard
}

function randomInteger(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getNeighbors(x, y, board) {
   let neighbors = []
   let neighbor

   // Top left neighbor
   neighbor = board.find((field) => field.x === x - 1 && field.y === y - 1)
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Top Right neighbor
   neighbor = board.find((field) => field.x === x - 1 && field.y === y + 1)
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Right neighbor
   neighbor = board.find((field) => field.x === x && field.y === y + 2)
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Bottom right neighbor
   neighbor = board.find((field) => field.x === x + 1 && field.y === y + 1)
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Bottom left neighbor
   neighbor = board.find((field) => field.x === x + 1 && field.y === y - 1)
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Left neighbor
   neighbor = board.find((field) => field.x === x && field.y === y - 2)
   if (neighbor !== undefined) neighbors.push(neighbor)

   return neighbors
}

function hasNeutralCityOrGreenery(neighbors) {
   return neighbors.some((neighbor) => {
      return neighbor.object === TILES.CITY_NEUTRAL || neighbor.object === TILES.GREENERY_NEUTRAL
   })
}

export function getAllResources(card, statePlayer) {
   let resources = statePlayer.resources.mln
   if (hasTag(card, TAGS.BUILDING)) resources += statePlayer.resources.steel * statePlayer.valueSteel
   if (hasTag(card, TAGS.SPACE)) resources += statePlayer.resources.titan * statePlayer.valueTitan
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}
export function getAllResourcesForSP(statePlayer) {
   let resources = statePlayer.resources.mln
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}

export function funcPerformSubActions(subActions, ANIMATION_SPEED, setModals, dispatchGame, setTrigger, sound, noTrigger = false) {
   subActions = subActions.filter((subAction) => subAction.name !== undefined)

   let iLast = subActions.length - 1
   for (let i = 0; i <= subActions.length - 1; i++) {
      if (subActions[i].name === ANIMATIONS.USER_INTERACTION) {
         iLast = i
         break
      }
   }
   if (iLast === -1) {
      endAnimation(setModals)
      if (!noTrigger) setTrigger((prevValue) => !prevValue)
   }

   let longAnimCount = 0
   let shortAnimCount = 0
   // Loop through all subactions
   for (let i = 0; i <= iLast; i++) {
      // ============= Start animation and perform subactions
      if (subActions[i].name !== ANIMATIONS.USER_INTERACTION) {
         // Subaction with normal animation
         setTimeout(() => {
            endAnimation(setModals)
            startAnimation(setModals)
            setAnimation(subActions[i].name, subActions[i].type, subActions[i].value, setModals, sound)
         }, longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2))
         setTimeout(
            () => subActions[i].func(),
            subActions[i].name !== ANIMATIONS.SHORT_ANIMATION
               ? (longAnimCount + 1) * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
               : longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
         )
      } else {
         // Subaction with user interaction
         setTimeout(() => subActions[i].func(), longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2))
      }
      // ============= End animation and remove performed actions from stateGame.actionsLeft
      if (i === iLast) {
         setTimeout(
            () => {
               endAnimation(setModals)
               dispatchGame({
                  type: ACTIONS_GAME.SET_ACTIONSLEFT,
                  payload: subActions.slice(iLast + 1),
               })
               if (subActions[i].name !== ANIMATIONS.USER_INTERACTION) {
                  if (!noTrigger) setTrigger((prevValue) => !prevValue)
               }
            },
            subActions[i].name !== ANIMATIONS.USER_INTERACTION
               ? subActions[i].name !== ANIMATIONS.SHORT_ANIMATION
                  ? (longAnimCount + 1) * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
                  : longAnimCount * ANIMATION_SPEED + (shortAnimCount + 1) * (ANIMATION_SPEED / 2)
               : longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
         )
      }
      // ============= Increment animation speed counter
      if (subActions[i].name !== ANIMATIONS.SHORT_ANIMATION) {
         longAnimCount++
      } else if (subActions[i].name === ANIMATIONS.SHORT_ANIMATION) {
         shortAnimCount++
      }
   }
}

// A function that decreases cost of the card based on current decreasing cost effects
export function modifiedCards(cards, statePlayer, justPlayedEffect, isIndenturedWorkersEffectOn) {
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

export function updateVP(statePlayer, dispatchPlayer, stateGame, stateBoard) {
   // Cards VP update
   let cardsVP = 0
   statePlayer.cardsPlayed.forEach((card) => {
      cardsVP += updateVpForCardId(card, statePlayer, dispatchPlayer, stateBoard)
   })
   // Total VP update
   const totalPoints = getTotalPointsWithoutVP(stateGame, stateBoard) + cardsVP
   dispatchPlayer({ type: ACTIONS_PLAYER.UPDATE_TOTALPOINTS, payload: totalPoints })
}

function updateVpForCardId(card, statePlayer, dispatchPlayer, stateBoard) {
   let newVp = card.vp
   switch (card.id) {
      case 5:
         card.units.science > 0 ? (newVp = 3) : (newVp = 0)
         break
      case 8:
         let capitalCity = stateBoard.find((field) => field.object === TILES.SPECIAL_CITY_CAPITAL)
         let oceans = getNeighbors(capitalCity.x, capitalCity.y, stateBoard).filter((nbField) => nbField.object === TILES.OCEAN)
         newVp = oceans.length
         break
      case 12:
         newVp = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.JOVIAN)).length
         if (statePlayer.corporation.name === CORP_NAMES.SATURN_SYSTEMS) newVp++
         break
      case 24:
         newVp = card.units.animal
         break
      case 28:
         newVp = card.units.fighter
         break
      case 35:
         newVp = Math.floor(card.units.microbe / 2)
         break
      case 49:
         newVp = Math.floor(card.units.microbe / 4)
         break
      case 52:
         newVp = card.units.animal
         break
      case 54:
         newVp = Math.floor(card.units.animal / 2)
         break
      case 72:
         newVp = card.units.animal
         break
      case 81:
         newVp = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.JOVIAN)).length
         if (statePlayer.corporation.name === CORP_NAMES.SATURN_SYSTEMS) newVp++
         break
      case 85:
         let commercialDistrict = stateBoard.find((field) => field.object === TILES.SPECIAL_COMMERCIAL_DISTRICT)
         let cities = getNeighbors(commercialDistrict.x, commercialDistrict.y, stateBoard).filter(
            (nbField) => nbField.object === TILES.CITY || nbField.object === TILES.CITY_NEUTRAL || nbField.object === TILES.SPECIAL_CITY_CAPITAL
         )
         newVp = cities.length
         break
      case 92:
         newVp = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.JOVIAN)).length
         if (statePlayer.corporation.name === CORP_NAMES.SATURN_SYSTEMS) newVp++
         break
      case 95:
         newVp = card.units.science * 2
         break
      case 128:
         newVp = Math.floor(card.units.animal / 2)
         break
      case 131:
         newVp = Math.floor(card.units.microbe / 3)
         break
      case 147:
         newVp = Math.floor(card.units.animal / 2)
         break
      case 172:
         newVp = Math.floor(card.units.animal / 2)
         break
      case 184:
         newVp = card.units.animal
         break
      case 198:
         let allCities = stateBoard.filter((field) => field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL)
         newVp = Math.floor(allCities.length / 3)
         break
      default:
         break
   }
   dispatchPlayer({ type: ACTIONS_PLAYER.UPDATE_VP, payload: { cardId: card.id, vp: newVp } })
   return newVp
}

export function getTotalPoints(statePlayer, stateGame, stateBoard) {
   return getTrPoints(stateGame) + getGreeneryPoints(stateBoard) + getCityPoints(stateBoard) + getVictoryPoints(statePlayer)
}
export function getTotalPointsWithoutVP(stateGame, stateBoard) {
   return getTrPoints(stateGame) + getGreeneryPoints(stateBoard) + getCityPoints(stateBoard)
}

export function getTrPoints(stateGame) {
   return stateGame.tr
}
export function getGreeneryPoints(stateBoard) {
   let board = JSON.parse(JSON.stringify(stateBoard))
   return board.filter((field) => field.object === TILES.GREENERY).length
}
export function getCityPoints(stateBoard) {
   let points = 0
   let board = JSON.parse(JSON.stringify(stateBoard))
   let cities = board.filter(
      (field) => (field.object === TILES.CITY || field.object === TILES.SPECIAL_CITY_CAPITAL) && field.name !== 'PHOBOS SPACE HAVEN' && field.name !== 'GANYMEDE COLONY'
   )
   cities.forEach((city) => {
      let x = city.x
      let y = city.y
      let greeneries = getNeighbors(x, y, board).filter((field) => field.object === TILES.GREENERY || field.object === TILES.GREENERY_NEUTRAL)
      points += greeneries.length
   })
   return points
}
export function getVictoryPoints(statePlayer) {
   const cards = statePlayer.cardsPlayed.filter((card) => card.vp !== 0)
   const count = cards.length > 0 ? cards.reduce((total, card) => total + card.vp, 0) : 0

   return count
}

export function scale(number, inMin, inMax, outMin, outMax) {
   return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
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

export function getActionCost(cardIdOrUnmi) {
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

export const sorted = (cards, id, requirementsMet) => {
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

export const withTimeAdded = (cards) => {
   return cards.map((card, idx) => ({ ...card, timeAdded: Date.now() + idx }))
}

export const withTimePlayed = (cards) => {
   return cards.map((card, idx) => ({ ...card, timePlayed: Date.now() + idx }))
}

export const getCards = (cards) => {
   if (!cards) return []
   let initCards = []
   cards.forEach((card) => {
      if (typeof card === 'number') {
         initCards.push(CARDS[card - 1])
      } else {
         initCards.push({
            ...CARDS[card.id - 1],
            currentCost: card.currentCost,
            vp: card.vp,
            units: card.units,
            actionUsed: card.actionUsed,
            timeAdded: card.timeAdded,
            timePlayed: card.timePlayed,
         })
      }
   })
   return initCards
}

export const getStatePlayerWithAllData = (statePlayer) => {
   let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
   newStatePlayer = {
      ...newStatePlayer,
      corporation: getCorporation(newStatePlayer.corporation),
      cardsInHand: getCards(newStatePlayer.cardsInHand),
      cardsPlayed: getCards(newStatePlayer.cardsPlayed),
      cardsSeen: getCards(newStatePlayer.cardsSeen),
      cardsPurchased: getCards(newStatePlayer.cardsPurchased),
   }

   return newStatePlayer
}

export const getLogItemsWithAllData = (logItems) => {
   let newLogItems = JSON.parse(JSON.stringify(logItems))
   // newLogItems = newLogItems.map((newLogItem) => {
   //    return {
   //       ...newLogItem,
   //       details: {
   //          ...newLogItem.details,
   //          stateBefore: ,
   //          stateAfter: ,
   //       },
   //    }
   // })

   return newLogItems
}

export const getEndedGameCardsWithAllData = (cards) => {
   let newCards = JSON.parse(JSON.stringify(cards))
   newCards = {
      ...newCards,
      played: getCards(newCards.cardsPlayed),
      seen: getCards(newCards.cardsSeen),
      purchased: getCards(newCards.cardsPurchased),
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

export const getCorporation = (id) => {
   if (!id) return null
   return CORPORATIONS.find((corporation) => corporation.id === id)
}

export const getThinerCard = (c) => {
   return { id: c.id, currentCost: c.currentCost, vp: c.vp, units: c.units, actionUsed: c.actionUsed, timeAdded: c.timeAdded, timePlayed: c.timePlayed }
}

export const range = (start, end) => {
   return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx)
}

export const getNewCardsDrawIds = async (count, statePlayer, dispatchPlayer, type, id, token, additionalDeckIds) => {
   let cardsDeckIds
   let newCardsDrawIds
   let newCardsDeckIds
   if (type === 'QUICK MATCH (ID)') {
      cardsDeckIds = additionalDeckIds ? statePlayer.cardsDeckIds.filter((id) => !additionalDeckIds.includes(id)) : statePlayer.cardsDeckIds
      const drawCardsIds = await getConsecutiveCardsIds(token, id, 208 - cardsDeckIds.length, count)
      newCardsDrawIds = drawCardsIds
      newCardsDeckIds = cardsDeckIds.filter((cardId) => !drawCardsIds.includes(cardId))
   } else {
      cardsDeckIds = additionalDeckIds ? statePlayer.cardsDeckIds.filter((id) => !additionalDeckIds.includes(id)) : statePlayer.cardsDeckIds
      const drawIndexes = await getRandIntNumbers(count, 0, cardsDeckIds.length - 1)
      newCardsDrawIds = cardsDeckIds.filter((_, idx) => drawIndexes.includes(idx))
      newCardsDeckIds = cardsDeckIds.filter((_, idx) => !drawIndexes.includes(idx))
   }

   dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_DRAW, payload: newCardsDrawIds })
   dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_DECK, payload: newCardsDeckIds })
   return newCardsDrawIds
}
