/* Used at the very beginning of the game to show two corps */
import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, CorpsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../initStates/actionsGame'
import { ACTIONS_PLAYER } from '../../../../initStates/actionsPlayer'
import Corp from '../Corp'
import { performImmediateCorpEffect } from '../../../../data/effects'
import BtnAction from '../buttons/BtnAction'
import { motion, AnimatePresence } from 'framer-motion'

const ModalCorps = () => {
   const corps = useContext(CorpsContext)
   const { dispatchGame } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [selectedCorp, setSelectedCorp] = useState(initSelectedCorp())

   const btnActionNextPosition = {
      bottom: '-23%',
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
      <AnimatePresence>
         {modals.corps && (
            <>
               
               <motion.div
                  key="keyModalCorpsBox"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="modal-corps center"
               >
                  <div className="select-corporation-header">SELECT CORPORATION</div>
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
                  <BtnAction
                     text="NEXT"
                     onYesFunc={handleClickNext}
                     position={btnActionNextPosition}
                  />
               </motion.div>
            </>
         )}
      </AnimatePresence>
   )
}

export default ModalCorps
