import { ACTION_ICONS } from '../data/cardActions'

export const INIT_STATE_PLAYER = {
   // Choosen Corporation Details
   corporation: {},
   // Current Productions Levels
   production: {
      mln: 0,
      steel: 0,
      titan: 0,
      plant: 0,
      energy: 0,
      heat: 0,
   },
   // Current Amounts of Resources
   resources: {
      mln: 0,
      steel: 0,
      titan: 0,
      plant: 0,
      energy: 0,
      heat: 0,
   },
   // Cards in Hand
   cardsInHand: [],
   // Cards Played
   cardsPlayed: [
      {
         id: 12,
         name: "Water Import From Europa",
         description: "Water Import From Europa",
         originalCost: 3,
         currentCost: 3,
         requirements: [],
         vp: 0,
         tags: ['jovian', 'space'],
         effect: null,
         effectsToCall: [],
         units: {
            microbe: 0,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: 'vp1per1jovian',
            action: ACTION_ICONS.ACTION_WATERIMPORT,
         },
         actionUsed: false,
      },
      {
         id: 187,
         name: "Aquifer Pumping",
         description: "Aquifer Pumping",
         originalCost: 5,
         currentCost: 5,
         requirements: [],
         vp: 0,
         tags: ['building'],
         effect: null,
         effectsToCall: [],
         units: {
            microbe: 0,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: null,
            action: ACTION_ICONS.ACTION_AQUIFERPUMPING,
         },
         actionUsed: false,
      },
      {
         id: 5,
         name: "ghtdfh",
         description: "tghfhtf",
         originalCost: 3,
         currentCost: 3,
         requirements: [],
         vp: 0,
         tags: ['jovian', 'space'],
         effect: null,
         effectsToCall: [],
         units: {
            microbe: 0,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: 'vp1per1jovian',
            action: ACTION_ICONS.ACTION_SEARCHFORLIFE,
         },
         actionUsed: false,
      }
   ],
   // Steel / Titan / Greenery value
   valueSteel: 2,
   valueTitan: 3,
   valueGreenery: 8,
   // For helion only: Can pay with heat?
   canPayWithHeat: false,
   // Change global parameters requirements to -2 / +2
   globParamReqModifier: 0,
}
