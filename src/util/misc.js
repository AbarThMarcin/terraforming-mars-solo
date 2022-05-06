import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { TILES } from '../data/board'
import { EFFECTS } from '../data/effects'
import { TAGS } from '../data/tags'
import { ACTIONS_GAME } from './actionsGame'
import { ACTIONS_PLAYER } from './actionsPlayer'

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
   if (
      length % 10 >= 1 &&
      length % 10 <= 5 &&
      length - (id + 1) <= 4 &&
      id % 10 >= 0 &&
      id % 10 <= 4
   ) {
      top = '50%'
   } else {
      if (id % 10 >= 0 && id % 10 <= 4) {
         top = '28%'
      } else {
         top = '72%'
      }
   }

   // Calculate left
   if (
      length % 10 >= 1 &&
      length % 10 <= 4 &&
      length - (id + 1) <= 3 &&
      id % 10 >= 0 &&
      id % 10 <= 3
   ) {
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
   return card.tags.includes(type)
}

// returns initial board with randomly positioned two cities with two greeneries
export const getBoardWithNeutral = ([...initBoard]) => {
   let citiesLeft = 2 // Neutral cities amount per board

   while (citiesLeft > 0) {
      let cityId = randomInteger(0, initBoard.length - 1)
      let neighbors = getNeighbors(initBoard[cityId].x, initBoard[cityId].y, initBoard)
      if (
         !initBoard[cityId].oceanOnly &&
         !initBoard[cityId].object &&
         initBoard[cityId].name !== 'NOCTIC CITY' &&
         initBoard[cityId].name !== 'PHOBOS SPACE HAVEN' &&
         initBoard[cityId].name !== 'GANYMEDE COLONY' &&
         !hasNeutralCityOrGreenery(neighbors)
      ) {
         initBoard[cityId].object = 'city-neutral'
         let greeneriesLeft = 1 // Greeneries amount per city
         while (greeneriesLeft > 0) {
            let greeneryId = randomInteger(0, neighbors.length - 1)
            if (
               !neighbors[greeneryId].oceanOnly &&
               !neighbors[greeneryId].object &&
               neighbors[greeneryId].name !== 'NOCTIC CITY'
            ) {
               initBoard.forEach((field) => {
                  if (field.x === neighbors[greeneryId].x && field.y === neighbors[greeneryId].y)
                     field.object = 'greenery-neutral'
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

export function funcPerformSubActions(
   subActions,
   ANIMATION_SPEED,
   setModals,
   dispatchGame,
   setUpdateVpTrigger
) {
   let iLast = subActions.length - 1
   for (let i = 0; i <= subActions.length - 1; i++) {
      if (subActions[i].name === ANIMATIONS.USER_INTERACTION) {
         iLast = i
         break
      }
   }
   if (iLast === -1) {
      endAnimation(setModals)
      setUpdateVpTrigger((prevValue) => !prevValue)
   }
   // Loop through all subactions
   for (let i = 0; i <= iLast; i++) {
      if (subActions[i].name !== ANIMATIONS.USER_INTERACTION) {
         // Execute Animation
         setTimeout(() => {
            startAnimation(setModals)
            setAnimation(subActions[i].name, subActions[i].type, subActions[i].value, setModals)
         }, i * ANIMATION_SPEED)
         // Execute action
         setTimeout(() => subActions[i].func(), (i + 1) * ANIMATION_SPEED)
      } else {
         // Execute action
         setTimeout(() => subActions[i].func(), i * ANIMATION_SPEED)
      }
      if (i === iLast) {
         // End animation and remove performed actions from stateGame.actionsLeft
         setTimeout(
            () => {
               endAnimation(setModals)
               dispatchGame({
                  type: ACTIONS_GAME.SET_ACTIONSLEFT,
                  payload: subActions.slice(iLast + 1),
               })
               if (subActions[i].name !== ANIMATIONS.USER_INTERACTION)
                  setUpdateVpTrigger((prevValue) => !prevValue)
            },
            subActions[i].name !== ANIMATIONS.USER_INTERACTION
               ? (i + 1) * ANIMATION_SPEED
               : i * ANIMATION_SPEED
         )
      }
   }
}

export function getAllResources(card, statePlayer) {
   let resources = statePlayer.resources.mln
   if (hasTag(card, TAGS.BUILDING))
      resources += statePlayer.resources.steel * statePlayer.valueSteel
   if (hasTag(card, TAGS.SPACE)) resources += statePlayer.resources.titan * statePlayer.valueTitan
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}

// A function that decreases cost of the card based on current decreasing cost effects
export function modifiedCards(cards, statePlayer) {
   let currentEffects = [...statePlayer.corporation.effects]
   statePlayer.cardsPlayed.forEach((card) => {
      if (card.effect !== null) currentEffects.push(card.effect)
   })
   return cards.map((card) => {
      let costLess = 0
      if (card.tags.includes(TAGS.EARTH)) {
         if (currentEffects.includes(EFFECTS.EFFECT_EARTH_OFFICE)) costLess += 3
         if (currentEffects.includes(EFFECTS.EFFECT_TERACTOR)) costLess += 3
      }
      if (card.tags.includes(TAGS.POWER)) {
         if (currentEffects.includes(EFFECTS.EFFECT_THORGATE)) costLess += 3
      }
      if (card.tags.includes(TAGS.SPACE)) {
         if (currentEffects.includes(EFFECTS.EFFECT_SPACE_STATION)) costLess += 2
         if (currentEffects.includes(EFFECTS.EFFECT_SHUTTLES)) costLess += 2
         if (currentEffects.includes(EFFECTS.EFFECT_MASS_CONVERTER)) costLess += 2
         if (currentEffects.includes(EFFECTS.EFFECT_QUANTUM_EXTRACTOR)) costLess += 2
      }
      if (currentEffects.includes(EFFECTS.EFFECT_RESEARCH_OUTPOST)) costLess += 1
      if (currentEffects.includes(EFFECTS.EFFECT_EARTH_CATAPULT)) costLess += 2
      if (currentEffects.includes(EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY)) costLess += 2
      return { ...card, currentCost: card.currentCost - costLess }
   })
}

export function updateVP(statePlayer, dispatchPlayer, stateBoard) {
   statePlayer.cardsPlayed.forEach((card) =>
      updateVpForCardId(card, statePlayer, dispatchPlayer, stateBoard)
   )
}

function updateVpForCardId(card, statePlayer, dispatchPlayer, stateBoard) {
   let newVp = card.vp
   switch (card.id) {
      case 5:
         card.units.microbe > 0 ? (newVp = 3) : (newVp = 0)
         break
      case 8:
         let capitalCity = stateBoard.find((field) => field.object === TILES.SPECIAL_CITY_CAPITAL)
         let oceans = getNeighbors(capitalCity.x, capitalCity.y, stateBoard).filter(
            (nbField) => nbField.object === TILES.OCEAN
         )
         newVp = oceans.length
         break
      case 12:
         newVp = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.JOVIAN)).length
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
         break
      case 85:
         let commercialDistrict = stateBoard.find(
            (field) => field.object === TILES.SPECIAL_COMMERCIAL_DISTRICT
         )
         let cities = getNeighbors(commercialDistrict.x, commercialDistrict.y, stateBoard).filter(
            (nbField) =>
               nbField.object === TILES.CITY ||
               nbField.object === TILES.CITY_NEUTRAL ||
               nbField.object === TILES.SPECIAL_CITY_CAPITAL ||
               nbField.object === TILES.SPECIAL_CITY_NOCTIS
         )
         newVp = cities.length
         break
      case 92:
         newVp = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.JOVIAN)).length
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
         let allCities = stateBoard.filter(
            (field) =>
               field.object === TILES.CITY ||
               field.object === TILES.CITY_NEUTRAL ||
               field.object === TILES.SPECIAL_CITY_CAPITAL ||
               field.object === TILES.SPECIAL_CITY_NOCTIS ||
               field.object === TILES.SPECIAL_CITY_GANYMEDE ||
               field.object === TILES.SPECIAL_CITY_PHOBOS
         )
         newVp = Math.floor(allCities.length / 3)
         break
      default:
         break
   }
   dispatchPlayer({ type: ACTIONS_PLAYER.UPDATE_VP, payload: { cardId: card.id, vp: newVp } })
}

export function scale(number, inMin, inMax, outMin, outMax) {
   return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
