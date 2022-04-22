/* A container of all possible modals */

import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'
import ModalCards from './ModalCards'
import ModalCardViewOnly from './ModalCardViewOnly'
import ModalCardWithAction from './ModalCardWithAction'
import ModalConfirmation from './ModalConfirmation'
import ModalCorp from './ModalCorp'
import ModalCorps from './ModalCorps'
import ModalDraft from './ModalDraft'
import ModalSellCards from './ModalSellCards'
import ModalLog from './ModalLog'
import ModalMenu from './ModalMenu'
import ModalOther from './modalOther/ModalOther'
import ModalRules from './ModalRules'
import ModalSettings from './ModalSettings'
import ModalStandardProjects from './ModalStandardProjects'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
   hidden: {
      opacity: 0,
      transform: 'translate(-50%, -50%) scale(2)',
   },
   visible: {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
   },
}

const Modals = ({ setGameOn }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {modals.sellCards && <ModalSellCards />}
         {modals.cards && <ModalCards />}
         {modals.corp && <ModalCorp />}
         {modals.corps && <ModalCorps />}
         {modals.log && <ModalLog />}
         {modals.other && <ModalOther />}
         {modals.standardProjects && <ModalStandardProjects />}
         <AnimatePresence>
            {modals.draft && (
               <motion.div
                  key="keyModalDraft"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.1, delay: 0.2 }}
                  className={`
               modal-draft center
               ${(modals.cards || stateGame.phaseViewGameState) && 'display-none'}
            `}
               >
                  <ModalDraft />
               </motion.div>
            )}
         </AnimatePresence>
         {modals.cardWithAction && <ModalCardWithAction />}
         {modals.cardViewOnly && <ModalCardViewOnly />}
         {modals.menu && <ModalMenu setGameOn={setGameOn} />}
         {modals.settings && <ModalSettings />}
         {modals.rules && <ModalRules />}
         {modals.confirmation && <ModalConfirmation />}
      </>
   )
}

export default Modals
