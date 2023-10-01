export function pad(num, size) {
   num = num.toString()
   while (num.length < size) num = '0' + num
   return num
}

export function randomInteger(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min
}

export function scale(number, inMin, inMax, outMin, outMax) {
   return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}