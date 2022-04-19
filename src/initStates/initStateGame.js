export const INIT_STATE_GAME = {
   // Current Generation
   generation: 1,
   // Is corporation phase on?
   corporationPhase: true,
   // Is draft phase on?
   draftPhase: false,
   // Current Global Parameters
   globalParameters: {
      temperature: -30,
      oxygen: 0,
      oceans: 0,
   },
   // TR
   tr: 14,
   // Standard Projects costs
   standardProjectsCosts: {
      sellPatent: 0,
      powerPlant: 11,
      asteroid: 14,
      aquifer: 18,
      greenery: 23,
      city: 25,
   }
}
