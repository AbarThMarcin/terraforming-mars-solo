/* Used at the very beginning of the game to show two corps */

import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, CorpsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import Corp from '../Corp'
import { performImmediateCorpEffect } from '../../../../data/effects'

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
      // Set effects and do immediate effects
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_EFFECTS, payload: corps[selectedCorp].effects })
      performImmediateCorpEffect(corps[selectedCorp], dispatchPlayer)
      // Turn off corporation phase and turn on draft phase
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
      setModals({ ...modals, corps: false, draft: true })
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
