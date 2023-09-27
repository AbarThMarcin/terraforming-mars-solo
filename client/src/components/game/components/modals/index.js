/* A container of all possible modals */
import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../game'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import ModalCards from './modalCards/ModalCards'
import ModalCardViewOnly from './modalCard/ModalCardViewOnly'
import ModalCardWithAction from './modalCard/ModalCardWithAction'
import ModalConfirmation from './modalConfirmation/ModalConfirmation'
import ModalCorps from './modalCorps/ModalCorps'
import ModalDraft from './ModalDraft'
import ModalSellCards from './ModalSellCards'
import ModalLog from './modalLog'
import ModalMenu from './modalMenu/ModalMenu'
import ModalOther from './modalOther'
import ModalRules from './modalRules/ModalRules'
import ModalSettings from './modalSettings/ModalSettings'
import ModalStandardProjects from './modalStandardProjects/ModalStandardProjects'
import ModalResource from './modalResources'
import ModalSelectOne from './ModalSelectOptions'
import ModalSelectCard from './modalSelectCard/ModalSelectCard'
import ModalProduction from './modalProduction'
import ModalMarsUniversity from './ModalMarsUniversity'
import ModalBusinessContacts from './ModalBusinessContacts'
import { motion, AnimatePresence } from 'framer-motion'
import Corp from '../corp/Corp'
import ModalEndStats from './modalEndStats/ModalEndStats'

const Modals = ({ logItems, expanded, setExpanded, itemsExpanded, setItemsExpanded }) => {
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
               >
                  <ModalBusinessContacts />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Corps */}
         <AnimatePresence>
            {modals.corps && (
               <motion.div key="keyModalCorps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="modal-background">
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
                  className={`modal-background ${(modals.confirmation || modals.sellCards) && 'display-none'}`}
                  onClick={() => setModals((prev) => ({ ...prev, standardProjects: false }))}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
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
                  className={`modal-background ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}`}
               >
                  <ModalSelectCard />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Button View Game State */}
         <AnimatePresence>
            {(stateGame.phaseDraft || modals.sellCards || stateGame.phaseAddRemoveRes || modals.selectCard || modals.marsUniversity || modals.businessContacts) && (
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

         {/* Modal Cards */}
         <AnimatePresence>
            {modals.cards && (
               <motion.div
                  key="keyModalCards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`modal-background ${(modals.cardWithAction || modals.cardViewOnly) && 'display-none'}`}
                  onClick={() => setModals((prev) => ({ ...prev, cards: false }))}
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
                  onClick={() => setModals((prev) => ({ ...prev, other: false }))}
               >
                  <ModalOther />
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
                  onClick={() => setModals((prev) => ({ ...prev, cardWithAction: false }))}
               >
                  <ModalCardWithAction />
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
                  onClick={() => setModals((prev) => ({ ...prev, log: false }))}
               >
                  <ModalLog logItems={logItems} expanded={expanded} setExpanded={setExpanded} itemsExpanded={itemsExpanded} setItemsExpanded={setItemsExpanded} />
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
                  onClick={() => setModals((prev) => ({ ...prev, cardViewOnly: false }))}
               >
                  <ModalCardViewOnly />
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
                  onClick={() => setModals((prev) => ({ ...prev, corp: false }))}
               >
                  <div className="modal-corp-container center">
                     <Corp corp={statePlayer.corporation} />
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Animation */}
         {modals.animation && <div className="full-size"></div>}

         {/* Modal Menu */}
         {modals.menu && <ModalMenu />}

         {/* Modal Settings */}
         {modals.settings && <ModalSettings />}

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
                  <ModalEndStats />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal Confirmation */}
         <AnimatePresence>
            {modals.confirmation && (
               <motion.div key="keyModalConfirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.03 }} className="modal-background">
                  <ModalConfirmation />
               </motion.div>
            )}
         </AnimatePresence>
      </>
   )
}

export default Modals
