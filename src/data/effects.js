import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ACTIONS_GAME } from '../util/actionsGame'

export const EFFECTS_CORP = {
   // Corporation Effects
   CREDICOR_GAIN_4_RES_MLN: 'Gain 4M after playing card with 20+ mln base cost',
   ECOLINE_7_PLANTS_FOR_GREENERY: 'Pay 7 plants, instead of 8, to place 1 greenery',
   HELION_HEAT_INSTEAD_OF_MLN: 'Pay with heat instead of mln',
   INTERPLANETARY_GAIN_2_RES_MLN: 'Gain 2M after playing event card',
   INVENTRIX_PARAMETERS_REQUIREMENTS: 'Treat global parameters requirements as they are -2 or +2',
   SATURN_GAIN_1_PROD_MLN: 'Gain 1 mln production',
}
export const EFFECTS_GAME = {
   GAIN_PROD_HEAT: 'Gain heat production when temperature reaches -24 or -20 degrees',
   GAIN_TEMPERATURE: 'Increase temperature by 2 degrees when oxygen reaches 8%',
   GAIN_OCEAN: 'Place an ocean when temperature reaches 0 degrees',
   RECEIVE_2_MLN: 'Receive 2 mln for every ocean tile, near which your tile has been placed',
}
export const EFFECTS = {}



/* ================================== LIST OF ALL GAME EFFECTS ====================================
This includes:
- receive 2 mln for each ocean, near which a tile has been placed
- heat production bonus when temperature reaches -24 degrees
- heat production bonus when temperature reaches -20 degrees
- temperature bonus when oxygen reaches 8%
- ocean bonus, when temperature reaches 0 degrees
*/
export const performGameEffect = (effect, dispatchPlayer, dispatchGame, dispatchBoard) => {
   switch (effect) {
      case EFFECTS_GAME.GAIN_PROD_HEAT:
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
         break
      case EFFECTS_GAME.GAIN_TEMPERATURE:
         dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
         break
      case EFFECTS_GAME.GAIN_OCEAN:
         break
      case EFFECTS_GAME.RECEIVE_2_MLN:
         break
      default:
         break
   }
}

/* ============================ LIST OF ALL IMMEDIATE CORP EFFECTS ===============================
This includes only few corporations. Changes to the states are made immediately right
after corp is selected. These effects are added to the data -> corporations -> effects only
to show them in the corp effects list. */
export const performImmediateCorpEffect = (corp, dispatchPlayer) => {
   switch (corp.name) {
      case 'Ecoline':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 7 })
         break
      case 'Helion':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: true })
         break
      case 'Inventrix':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_PARAMETERS_REQUIREMENTS, payload: 2 })
         break
      default:
         break
   }
}

// ================================== LIST OF ALL CARD EFFECTS ====================================
// This includes all effects in game EXCEPT immediate effects from corporations
export const performEffect = (effect, dispatchPlayer) => {
   switch (effect) {
      case EFFECTS_CORP.CREDICOR_GAIN_4_RES_MLN:
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 4 })
         break
      case EFFECTS_CORP.INTERPLANETARY_GAIN_2_RES_MLN:
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 })
         break
      default:
         break
   }
}
