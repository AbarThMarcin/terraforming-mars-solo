/* A container of all possible modals */
import { useContext, useState } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../game'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import ModalCards from './modalCards/ModalCards'
import ModalCardViewOnly from './modalCard/ModalCardViewOnly'
import ModalCardWithAction from './modalCard/ModalCardWithAction'
import ModalCorps from './modalCorps/ModalCorps'
import ModalDraft from './ModalDraft'
import ModalSellCards from './ModalSellCards'
import ModalLog from './modalLog'
import ModalOther from './modalOther'
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
import { SoundContext } from '../../../../App'

const Modals = ({ logItems, expanded, setExpanded, itemsExpanded, setItemsExpanded }) => {
   const { stateGame, dispatchGame } = useContext(StateGameContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const [showEndStats, setShowEndStats] = useState(true)

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
            {stateGame.phaseCorporation && (
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
            {stateGame.phaseDraft && (
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
                     sound.btnGeneralClick.play()
                     dispatchGame({ type: ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE, payload: !stateGame.phaseViewGameState })
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

         {/* Modal End Stats */}
         {modals.endStats && showEndStats && (
            <AnimatePresence>
               <motion.div
                  key="keyModalEndStats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`modal-background ${modals.confirmation && 'display-none'}`}
               >
                  <ModalEndStats />
               </motion.div>
            </AnimatePresence>
         )}
         {modals.endStats && (
            <AnimatePresence>
               <motion.div
                  key="keyBtnShowPlanet"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="btn-show-planet pointer"
                  onClick={() => setShowEndStats((prev) => !prev)}
               >
                  {showEndStats ? 'SHOW BOARD' : 'SHOW END STATS'}
               </motion.div>
            </AnimatePresence>
         )}

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
      </>
   )
}

export default Modals
