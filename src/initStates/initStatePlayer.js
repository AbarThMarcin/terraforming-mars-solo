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
   cardsPlayed: [],
   // Steel / Titan / Greenery value
   valueSteel: 2,
   valueTitan: 3,
   valueGreenery: 8,
   // For helion only: Can pay with heat?
   canPayWithHeat: false,
   // Change global parameters requirements to -2 / +2
   globParamReqModifier: 0,
}
