import { ACTION_ICONS } from '../data/cardActions'
import { EFFECTS } from '../data/effects'
import { VP_ICONS } from '../data/vp'

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
         id: 133,
         name: 'Symbiotic Fungus',
         description: 'Symbiotic Fungus',
         originalCost: 4,
         currentCost: 4,
         requirements: [],
         vp: 0,
         tags: ['microbe'],
         effect: null,
         effectsToCall: [],
         units: {
            microbe: 1,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: VP_ICONS.VP2,
            action: ACTION_ICONS.ADD1MICROBEOTHER,
         },
         actionUsed: false,
      },
      {
         id: 134,
         name: 'Extreme-Cold Fungus',
         description: 'Extreme-Cold Fungus',
         originalCost: 13,
         currentCost: 13,
         requirements: [],
         vp: 0,
         tags: ['microbe'],
         effect: null,
         effectsToCall: [],
         units: {
            microbe: 1,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: null,
            action: ACTION_ICONS.ADD2MICROBES,
         },
         actionUsed: false,
      },
      {
         id: 157,
         name: 'Colonizer Training Camp2',
         description: 'Preparing for settlement of the moons of Jupiter.',
         originalCost: 8,
         currentCost: 8,
         requirements: [],
         vp: 0,
         tags: [],
         effect: EFFECTS.EFFECT_HERBIVORES,
         effectsToCall: [],
         units: {
            microbe: 0,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: null,
            action: ACTION_ICONS.ADD1ANIMAL,
         },
         actionUsed: false,
      },
      {
         id: 131,
         name: 'Pets',
         description: '',
         originalCost: 10,
         currentCost: 10,
         requirements: [],
         vp: 0,
         tags: [],
         effect: EFFECTS.EFFECT_PETS,
         effectsToCall: [],
         units: {
            microbe: 0,
            animal: 0,
            science: 0,
            fighter: 0,
         },
         iconNames: {
            vp: VP_ICONS.VP1PER2ANIMALS,
            action: null,
         },
         actionUsed: null,
      },
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
