import { TILES } from "../data/board"
import { INIT_BOARD } from "../initStates/initBoard"
import { randomInteger } from "./number"

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

// Returns initial board with randomly positioned two cities with two greeneries
export const getBoardWithNeutralTiles = ([...initBoard]) => {
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

export const getField = (x, y, name = "") => {
   let field
   if (name === 'PHOBOS SPACE HAVEN' || name === 'GANYMEDE COLONY') {
      field = INIT_BOARD.find(f => f.x === x && f.y === y && f.name === name)
   } else {
      field = INIT_BOARD.find(f => f.x === x && f.y === y && f.name !== "PHOBOS SPACE HAVEN" && f.name !== 'GANYMEDE COLONY')
   }
   return field
}