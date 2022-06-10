/* Used at the very beginning of the game to show two corps */
import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, CorpsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import Corp from '../Corp'
import { performImmediateCorpEffect } from '../../../../data/effects'
import BtnAction from '../buttons/BtnAction'

const ModalCorps = () => {
   const corps = useContext(CorpsContext)
   const { dispatchGame } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [selectedCorp, setSelectedCorp] = useState(initSelectedCorp())

   const btnActionNextPosition = {
      bottom: '2%',
      left: '50%',
      transform: 'translateX(-50%)',
   }

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

   const handleClickNext = () => {
      // Assign choosen corporation to statePlayer.corporation
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_CORPORATION, payload: corps[selectedCorp] })
      // Perform immediate effects
      performImmediateCorpEffect(corps[selectedCorp], dispatchPlayer, dispatchGame)
      // Turn off corporation phase and turn on draft phase
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
      setModals({ ...modals, corps: false, draft: true })
   }

   return (
      <>
         <div className="modal-corps center">
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
         <BtnAction
            text="NEXT"
            onYesFunc={handleClickNext}
            position={btnActionNextPosition}
         />
      </>
   )
}

export default ModalCorps
