export const INIT_STATE_PLAYER = {
   // Choosen Corporation Details
   corporation: null,
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
   // Cards ids left in deck and cards ids of latest draw
   cardsDeckIds: [],
   cardsDrawIds: [],
   // Cards in Hand
   cardsInHand: [],
   // Cards Played
   cardsPlayed: [],
   // For Statistics
   cardsSeen: [],
   cardsPurchased: [],
   // Steel / Titan / Greenery value
   valueSteel: 2,
   valueTitan: 3,
   valueGreenery: 8,
   // For helion only: Can pay with heat?
   canPayWithHeat: false,
   // Change global parameters requirements to -2 / +2
   globParamReqModifier: 0,
   specialDesignEffect: false,
   // Indentured Workers
   indenturedWorkersEffect: false,
   // Total Points
   totalPoints: 14,
}
