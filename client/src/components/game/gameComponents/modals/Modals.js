/* A container of all possible modals */
import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import ModalCards from './ModalCards'
import ModalCardViewOnly from './ModalCardViewOnly'
import ModalCardWithAction from './ModalCardWithAction'
import ModalConfirmation from './ModalConfirmation'
import ModalCorps from './ModalCorps'
import ModalDraft from './ModalDraft'
import ModalSellCards from './ModalSellCards'
import ModalLog from './modalLog/ModalLog'
import ModalMenu from './ModalMenu'
import ModalOther from './modalOther/ModalOther'
import ModalRules from './ModalRules'
import ModalSettings from './ModalSettings'
import ModalStandardProjects from './ModalStandardProjects'
import ModalResource from './modalResources/ModalResource'
import ModalSelectOne from './ModalSelectOptions'
import ModalSelectCard from './ModalSelectCard'
import ModalProduction from './modalProduction/ModalProduction'
import ModalMarsUniversity from './ModalMarsUniversity'
import ModalBusinessContacts from './ModalBusinessContacts'
import { motion, AnimatePresence } from 'framer-motion'
import Corp from '../Corp'
import ModalEndStats from './ModalEndStats'

const Modals = ({ setGameOn, setAnimationSpeed, showTotVP, setShowTotVP, logItems }) => {
   const { stateGame, dispatchGame } = useContext(StateGameContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <>
         {/* Modal Sell Cards */}
         <AnimatePresence>
            {modals.sellCards && (
               <motion.div
                  key="keyModalSellCards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalSellCards />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Mars University */}
         <AnimatePresence>
            {modals.marsUniversity && (
               <motion.div
                  key="keyModalMarsUniversity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalMarsUniversity />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Business Contacts */}
         <AnimatePresence>
            {modals.businessContacts && (
               <motion.div
                  key="keyModalBusinessContacts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalBusinessContacts />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Corps */}
         <AnimatePresence>
            {modals.corps && (
               <motion.div
                  key="keyModalCorps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="modal-background"
               >
                  <ModalCorps />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Standard Projects */}
         <AnimatePresence>
            {modals.standardProjects && (
               <motion.div
                  key="keyModalCorps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || modals.sellCards) && 'display-none'
                  }`}
                  onClick={() => setModals({ ...modals, standardProjects: false })}
               >
                  <ModalStandardProjects />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Draft */}
         <AnimatePresence>
            {modals.draft && (
               <motion.div
                  key="keyModalDraft"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalDraft />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Resource */}
         <AnimatePresence>
            {modals.resource && (
               <motion.div
                  key="keyModalResource"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalResource />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Production */}
         <AnimatePresence>
            {modals.production && (
               <motion.div
                  key="keyModalProduction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalProduction />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Select One */}
         <AnimatePresence>
            {modals.selectOne && (
               <motion.div
                  key="keyModalSelectOne"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalSelectOne />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Select Card */}
         <AnimatePresence>
            {modals.selectCard && (
               <motion.div
                  key="keyModalSelectCard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
                  }`}
               >
                  <ModalSelectCard />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Button View Game State */}
         <AnimatePresence>
            {(stateGame.phaseDraft ||
               modals.sellCards ||
               stateGame.phaseAddRemoveRes ||
               modals.selectCard ||
               modals.marsUniversity ||
               modals.businessContacts) && (
               <motion.div
                  key="keyBtnViewGameState"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="btn-view-game-state pointer"
                  onClick={() => {
                     if (stateGame.phaseViewGameState) {
                        dispatchGame({
                           type: ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE,
                           payload: false,
                        })
                     } else {
                        dispatchGame({
                           type: ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE,
                           payload: true,
                        })
                     }
                  }}
               >
                  {stateGame.phaseViewGameState ? 'RETURN' : 'VIEW GAME STATE'}
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Log */}
         <AnimatePresence>
            {modals.log && (
               <motion.div
                  key="keyModalLog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="full-size"
                  onClick={() => setModals({ ...modals, log: false })}
               >
                  <ModalLog logItems={logItems} />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Cards */}
         <AnimatePresence>
            {modals.cards && (
               <motion.div
                  key="keyModalCards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${
                     (modals.cardWithAction || modals.cardViewOnly) && 'display-none'
                  }`}
                  onClick={() => setModals({ ...modals, cards: false })}
               >
                  <ModalCards />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Other */}
         <AnimatePresence>
            {modals.other && (
               <motion.div
                  key="keyModalOther"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${modals.confirmation && 'display-none'}`}
                  onClick={() => setModals({ ...modals, other: false })}
               >
                  <ModalOther />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Corp */}
         <AnimatePresence>
            {modals.corp && (
               <motion.div
                  key="keyModalCorp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="modal-background"
                  onClick={() => setModals({ ...modals, corp: false })}
               >
                  <div className="modal-corp-container center">
                     <Corp corp={statePlayer.corporation} />
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Card With Action */}
         <AnimatePresence>
            {modals.cardWithAction && (
               <motion.div
                  key="keyModalCardWithAction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.001 }}
                  className={`modal-background ${modals.confirmation && 'display-none'}`}
                  onClick={() => setModals({ ...modals, cardWithAction: false })}
               >
                  <ModalCardWithAction />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Card View Only */}
         <AnimatePresence>
            {modals.cardViewOnly && (
               <motion.div
                  key="keyModalCardViewOnly"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.001 }}
                  className={`modal-background ${modals.confirmation && 'display-none'}`}
                  onClick={() => setModals({ ...modals, cardViewOnly: false })}
               >
                  <ModalCardViewOnly />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Animation */}
         {modals.animation && <div className="full-size"></div>}

         {/* Modal Menu */}
         {modals.menu && <ModalMenu setGameOn={setGameOn} />}

         {/* Modal Settings */}
         {modals.settings && (
            <ModalSettings
               setAnimationSpeed={setAnimationSpeed}
               showTotVP={showTotVP}
               setShowTotVP={setShowTotVP}
            />
         )}

         {/* Modal Rules */}
         {modals.rules && <ModalRules />}

         {/* Modal End Stats */}
         <AnimatePresence>
            {modals.endStats && (
               <motion.div
                  key="keyModalEndStats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`modal-background ${modals.confirmation && 'display-none'}`}
               >
                  <ModalEndStats setGameOn={setGameOn} />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Confirmation */}
         <AnimatePresence>
            {modals.confirmation && (
               <motion.div
                  key="keyModalConfirmation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.03 }}
                  className="modal-background"
               >
                  <ModalConfirmation />
               </motion.div>
            )}
         </AnimatePresence>
      </>
   )
}

export default Modals
