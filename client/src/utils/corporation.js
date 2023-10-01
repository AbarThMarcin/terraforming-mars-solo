import { CORP_NAMES } from "../data/corpNames"
import { CORPORATIONS } from "../data/corporations"

export const getCorporationById = (id) => {
   if (!id) return null
   return CORPORATIONS.find((corporation) => corporation.id === id)
}

export const getCorporationByName = (name) => {
   if (!name) return null
   return CORPORATIONS.find((corporation) => corporation.name === name)
}

export const getCorpShortName = (name) => {
   switch (name) {
      case CORP_NAMES.INTERPLANETARY:
         return 'INTERPLANETARY CINEM.'
      case 'ADAPTATION TECHNOLOGY':
         return 'ADAPTATION TECH.'
      case 'ANTI-GRAVITY TECHNOLOGY':
         return 'ANTI-GRAV. TECH.'
      case 'OPTIMAL AEROBRAKING':
         return 'OPTIMAL AEROBR.'
      default:
         return name
   }
}