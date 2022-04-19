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

export const hasTag = (card, type) => {
   return card.tags.includes(type)
}