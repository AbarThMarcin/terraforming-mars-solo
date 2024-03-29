export const ACTIONS_GAME = {
   // Set whole state
   SET_STATE: 'Set state',
   // Generation
   INCREMENT_GEN: 'Move to next generation',
   // Phases
   SET_PHASE_CORPORATION: 'Set corporation phase',
   SET_PHASE_DRAFT: 'Set draft phase',
   SET_PHASE_VIEWGAMESTATE: 'Set view game state phase',
   SET_PHASE_PLACETILE: 'Set phase where user places a tile on board',
   SET_PHASE_PLACETILEDATA: 'Set tile name to be put when place tile phase is on',
   SET_PHASE_ADDREMOVERES: 'Set phase where user selects a card, a resource will be added / removed',
   SET_PHASE_AFTER_GEN14: 'Potential greeneries phase after passing in Gen 14',
   SET_REPLAY_ACTION_ID: 'Action Id in the replay mode',
   // Global Parameters
   INCREMENT_TEMPERATURE: 'Increase temperature by 2 degrees',
   INCREMENT_OXYGEN: 'Increase oxygen by 1 percent',
   INCREMENT_OCEANS: 'Increase number of oceans by 1',
   // Change TR
   CHANGE_TR: 'Change TR',
   // Set Actions Left
   SET_ACTIONSLEFT: 'Set actions left',
   // Set cost of SP power plant
   SET_POWERPLANT_COST: 'Decrease cost of power plant', // For Thorgate
}

export const reducerGame = (state, action) => {
   switch (action.type) {
      // SET STATE
      case ACTIONS_GAME.SET_STATE:
         return action.payload
      // NEXT GENERATION
      case ACTIONS_GAME.INCREMENT_GEN:
         return {
            ...state,
            generation: state.generation + 1,
         }
      // SET PHASES
      case ACTIONS_GAME.SET_PHASE_CORPORATION:
         return {
            ...state,
            phaseCorporation: action.payload,
         }
      case ACTIONS_GAME.SET_PHASE_DRAFT:
         return {
            ...state,
            phaseDraft: action.payload,
         }
      case ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE:
         return {
            ...state,
            phaseViewGameState: action.payload,
         }
      case ACTIONS_GAME.SET_PHASE_PLACETILE:
         return {
            ...state,
            phasePlaceTile: action.payload,
         }
      case ACTIONS_GAME.SET_PHASE_PLACETILEDATA:
         return {
            ...state,
            phasePlaceTileData: action.payload,
         }
      case ACTIONS_GAME.SET_PHASE_ADDREMOVERES:
         return {
            ...state,
            phaseAddRemoveRes: action.payload,
         }
      case ACTIONS_GAME.SET_PHASE_AFTER_GEN14:
         return {
            ...state,
            phaseAfterGen14: action.payload,
         }
      case ACTIONS_GAME.SET_REPLAY_ACTION_ID:
         return {
            ...state,
            replayActionId: action.payload,
         }
      // INCREASE GLOBAL PARAMETERS
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
      // CHANGE TR
      case ACTIONS_GAME.CHANGE_TR:
         return {
            ...state,
            tr: state.tr + action.payload,
         }
      // SET ACTIONS LEFT
      case ACTIONS_GAME.SET_ACTIONSLEFT:
         return {
            ...state,
            actionsLeft: action.payload,
         }
      // SET POWER PLANT CURRENT COST
      case ACTIONS_GAME.SET_POWERPLANT_COST:
         return {
            ...state,
            SPCosts: {
               ...state.SPCosts,
               powerPlant: {
                  ...state.SPCosts.powerPlant,
                  current: action.payload,
               },
            },
         }
      default:
         return state
   }
}
