import { CONFIRMATION_TEXT } from './app'

export const SP = {
   // Standard Projects
   SELL_PATENT: 'SELL PATENT',
   POWER_PLANT: 'POWER PLANT',
   ASTEROID: 'ASTEROID',
   AQUIFER: 'AQUIFER',
   GREENERY: 'GREENERY',
   CITY: 'CITY',
   // Convert plants action
   CONVERT_PLANTS: 'CONVERT PLANTS',
   // Bonus action (the same as aquifer but without Standard Technology card effect)
   AQUIFER_NO_SP: 'AQUIFER FROM OTHER SOURCE THAN SP',
}

export const getInitSPCosts = (stateGame) => {
   return [
      stateGame.SPCosts.sellPatent,
      stateGame.SPCosts.powerPlant.current,
      stateGame.SPCosts.asteroid,
      stateGame.SPCosts.aquifer,
      stateGame.SPCosts.greenery,
      stateGame.SPCosts.city,
   ]
}

export const getNameOfSP = (id) => {
   switch (id) {
      case 0:
         return SP.SELL_PATENT
      case 1:
         return SP.POWER_PLANT
      case 2:
         return SP.ASTEROID
      case 3:
         return SP.AQUIFER
      case 4:
         return SP.GREENERY
      case 5:
         return SP.CITY
      default:
         return
   }
}

export const getConfirmationTextOfSP = (id) => {
   switch (id) {
      case 1:
         return CONFIRMATION_TEXT.SP_POWERPLANT
      case 2:
         return CONFIRMATION_TEXT.SP_ASTEROID
      case 3:
         return CONFIRMATION_TEXT.SP_AQUIFER
      case 4:
         return CONFIRMATION_TEXT.SP_GREENERY
      case 5:
         return CONFIRMATION_TEXT.SP_CITY
      default:
         return
   }
}
