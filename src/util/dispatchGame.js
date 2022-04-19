export const ACTIONS_GAME = {
   // Generation
   INCREMENT_GEN: 'Move to next generation',
   // Draft phase
   SET_DRAFT_PHASE: 'Set draft phase',
   // Corporation phase
   SET_CORPORATION_PHASE: 'Set corporation phase',
   // Global Parameters
   INCREMENT_TEMPERATURE: 'Increase temperature by 2 degrees',
   INCREMENT_OXYGEN: 'Increase oxygen by 1 percent',
   INCREMENT_OCEANS: 'Increase number of oceans by 1',
   // Change TR
   CHANGE_TR: 'Change TR',
}

export const reducerGame = (state, action) => {
   switch (action.type) {
      /* NEXT GENERATION */
      case ACTIONS_GAME.INCREMENT_GEN:
         return {
            ...state,
            generation: state.generation + 1,
         }
      /* SET CORPORATION PHASE */
      case ACTIONS_GAME.SET_CORPORATION_PHASE:
         return {
            ...state,
            corporationPhase: action.payload,
         }
      /* SET DRAFT PHASE */
      case ACTIONS_GAME.SET_DRAFT_PHASE:
         return {
            ...state,
            draftPhase: action.payload,
         }
      /* INCREASE GLOBAL PARAMETERS */
      case ACTIONS_GAME.INCREMENT_TEMPERATURE:
         return {
            ...state,
            globalParameters: {
               ...state.globalParameters,
               temperature: state.globalParameters.temperature + 2,
            },
         }
      case ACTIONS_GAME.INCREMENT_OXYGEN:
         return {
            ...state,
            globalParameters: {
               ...state.globalParameters,
               oxygen: state.globalParameters.oxygen + 1,
            },
         }
      case ACTIONS_GAME.INCREMENT_OCEANS:
         return {
            ...state,
            globalParameters: {
               ...state.globalParameters,
               oceans: state.globalParameters.oceans + 1,
            },
         }
      /* CHANGE TR */
      case ACTIONS_GAME.CHANGE_TR:
         return {
            ...state,
            tr: state.tr + action.payload,
         }
      default:
         return state
   }
}
