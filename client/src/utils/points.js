import { TILES } from "../data/board"
import { CORP_NAMES } from "../data/corpNames"
import { TAGS } from "../data/tags"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { getNeighbors } from "./board"
import { hasTag } from "./cards"

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
function getTotalPointsWithoutVP(stateGame, stateBoard) {
   return getTrPoints(stateGame) + getGreeneryPoints(stateBoard) + getCityPoints(stateBoard)
}

export function getTotalPoints(statePlayer, stateGame, stateBoard) {
   return getTrPoints(stateGame) + getGreeneryPoints(stateBoard) + getCityPoints(stateBoard) + getVictoryPoints(statePlayer)
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