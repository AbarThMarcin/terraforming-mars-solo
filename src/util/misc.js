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
      let neighbors = getNeighbors(cityId, initBoard)
      if (
         !initBoard[cityId].oceanOnly &&
         !initBoard[cityId].object &&
         initBoard[cityId].name !== 'NOCTIC CITY' &&
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
                     field.object = 'greenery'
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

function getNeighbors(id, board) {
   let neighbors = []
   let x = board[id].x
   let y = board[id].y
   let neighbor

   // Top left neighbor
   neighbor = board.find((field) => {
      return field.x === x - 1 && field.y === y - 1
   })
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Top Right neighbor
   neighbor = board.find((field) => {
      return field.x === x - 1 && field.y === y + 1
   })
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Right neighbor
   neighbor = board.find((field) => {
      return field.x === x && field.y === y + 2
   })
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Bottom right neighbor
   neighbor = board.find((field) => {
      return field.x === x + 1 && field.y === y + 1
   })
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Bottom left neighbor
   neighbor = board.find((field) => {
      return field.x === x + 1 && field.y === y - 1
   })
   if (neighbor !== undefined) neighbors.push(neighbor)
   // Left neighbor
   neighbor = board.find((field) => {
      return field.x === x && field.y === y - 2
   })
   if (neighbor !== undefined) neighbors.push(neighbor)

   return neighbors
}

function hasNeutralCityOrGreenery(neighbors) {
   return neighbors.some((neighbor) => {
      return neighbor.object === 'city-neutral' || neighbor.object === 'greenery'
   })
}
