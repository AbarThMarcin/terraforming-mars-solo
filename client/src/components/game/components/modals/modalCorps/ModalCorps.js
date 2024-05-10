/* Used at the very beginning of the game to show two corps */
import { useContext } from 'react'
import { CorpsContext, ActionsContext, StateGameContext } from '../../../../game'
import Corp from '../../corp/Corp'
import BtnAction from '../../buttons/BtnAction'
import { motion, AnimatePresence } from 'framer-motion'
import { useActionDraft } from '../../../../../hooks/useActionDraft'

const ModalCorps = () => {
   const { corps } = useContext(CorpsContext)
   const { stateGame } = useContext(StateGameContext)
   const { actions } = useContext(ActionsContext)

   const btnActionNextPosition = {
      bottom: '-23%',
      left: '50%',
      transform: 'translateX(-50%)',
   }

   const { handleClickNext } = useActionDraft()

   return (
      <AnimatePresence>
         {stateGame.phaseCorporation && (
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
                  {corps.length > 0 && (
                     <>
                        <Corp corp={corps[0]} />
                        <Corp corp={corps[1]} />
                        <BtnAction text="NEXT" onYesFunc={handleClickNext} disabled={actions.corpId === null} position={btnActionNextPosition} allowDespiteReplay={true} />
                     </>
                  )}
               </motion.div>
            </>
         )}
      </AnimatePresence>
   )
}

export default ModalCorps
