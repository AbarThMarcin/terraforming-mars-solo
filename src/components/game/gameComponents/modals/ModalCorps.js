/* Used at the very beginning of the game to show two corps */

import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, CorpsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/dispatchGame'
import { ACTIONS_PLAYER } from '../../../../util/dispatchPlayer'
import Corp from '../Corp'

const ModalCorps = () => {
   const corps = useContext(CorpsContext)
   const { dispatchGame } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [selectedCorp, setSelectedCorp] = useState(initSelectedCorp())

   function initSelectedCorp() {
      if (Object.keys(statePlayer.corporation).length === 0) {
         return 0
      } else {
         if (statePlayer.corporation.name === corps[0].name) {
            return 0
         } else {
            return 1
         }
      }
   }

   const handleCorpsClick = () => {
      // Assign choosen corporation to statePlayer.corporation
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_CORPORATION, payload: corps[selectedCorp] })
      // Set tags
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_TAGS, payload: corps[selectedCorp].tags })
      // Set actions
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_ACTIONS, payload: corps[selectedCorp].actions })
      // Set effects
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_EFFECTS, payload: corps[selectedCorp].effects })
      callImmediateEffect(corps[selectedCorp])
      // Turn off corporation phase and turn on draft phase
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
      setModals({ ...modals, corps: false, draft: true })
   }

   /* ============================ LIST OF ALL IMMEDIATE CORP EFFECTS ===============================
   This includes only few corporations. Changes to the states are made immediately right
   after corp is selected. These effects are added to the data -> corporations -> effects only
   to show them in the corp effects list. Changing name of the constants won't affect performing
   the effect here.
   */
   function callImmediateEffect(corp) {
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

   return (
      <>
         <div className="full-size modal-corps">
            <Corp
               corp={corps[0]}
               selectedCorp={selectedCorp}
               setSelectedCorp={setSelectedCorp}
               id={0}
            />
            <Corp
               corp={corps[1]}
               selectedCorp={selectedCorp}
               setSelectedCorp={setSelectedCorp}
               id={1}
            />
         </div>
         <button className="modal-corps-btn pointer" onClick={handleCorpsClick}>
            NEXT
         </button>
      </>
   )
}

export default ModalCorps
