export const INIT_STATE_GAME = {
   // Current Generation
   generation: 1,
   // Game phases
   phaseCorporation: true,
   phaseDraft: false,
   phaseViewGameState: false,
   phasePlaceTile: false,
   phasePlaceTileData: null,
   phaseAddRemoveRes: false,
   phaseSelectOne: false,
   // Current Global Parameters
   globalParameters: {
      temperature: -2,
      oxygen: 7,
      oceans: 0,
   },
   // TR
   tr: 14,
   // Standard Projects costs
   SPCosts: {
      sellPatent: 0,
      powerPlant: {
         original: 11,
         current: 11,
      },
      asteroid: 14,
      aquifer: 18,
      greenery: 23,
      city: 25,
   },
   // Actions left
   actionsLeft: [],
}
