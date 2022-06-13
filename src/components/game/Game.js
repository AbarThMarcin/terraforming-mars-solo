import { useReducer, createContext, useState, useEffect } from 'react'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { ACTIONS_PLAYER } from '../../util/actionsPlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { reducerGame } from '../../util/actionsGame'
import { reducerPlayer } from '../../util/actionsPlayer'
import { reducerBoard } from '../../util/actionsBoard'
import { funcPerformSubActions, modifiedCards, sorted, updateVP } from '../../util/misc'
import { funcGetImmEffects } from '../../data/immEffects/immEffects'
import { funcGetEffect } from '../../data/effects'
import { shuffledCorps, shuffledCards, randomBoard } from '../../App'
import {
   funcRequirementsMet,
   funcActionRequirementsMet,
   funcOptionRequirementsMet,
} from '../../data/requirements'
import { funcGetCardActions } from '../../data/cardActions'
import { funcGetOptionsActions } from '../../data/selectOneOptions'
import PanelCorp from './gameComponents/panelCorp/PanelCorp'
import PanelStateGame from './gameComponents/PanelStateGame'
import BtnStandardProjects from './gameComponents/buttons/BtnStandardProjects'
import PassContainer from './gameComponents/PassContainer'
import Board from './gameComponents/board/Board'
import Modals from './gameComponents/modals/Modals'
import { LOG_TYPES } from '../../data/log'
import { motion, AnimatePresence } from 'framer-motion'
import '../../css/app.css'

export const StatePlayerContext = createContext()
export const StateGameContext = createContext()
export const ModalsContext = createContext()
export const StateBoardContext = createContext()
export const CorpsContext = createContext()
export const CardsContext = createContext()

function Game({ setGameOn }) {
   const [statePlayer, dispatchPlayer] = useReducer(reducerPlayer, INIT_STATE_PLAYER)
   const [stateGame, dispatchGame] = useReducer(reducerGame, INIT_STATE_GAME)
   const [modals, setModals] = useState(INIT_MODALS)
   const [stateBoard, dispatchBoard] = useReducer(reducerBoard, randomBoard)
   const corps = shuffledCorps
   const [cards, setCards] = useState(shuffledCards)
   const [logItems, setLogItems] = useState([
      { type: LOG_TYPES.LOG, data: null },
      { type: LOG_TYPES.GENERATION, data: { text: '1' } },
   ])
   const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(1500)
   const [sortId, setSortId] = useState(['4a', '4a'])
   const [updateVpTrigger, setUpdateVpTrigger] = useState(false)
   const [logData, setLogData] = useState(null)
   const [logIcon, setLogIcon] = useState(null)

   useEffect(() => {
      // Update VP of all cards
      updateVP(statePlayer, dispatchPlayer, stateBoard)
      // Turn off Special Design effect (if aplicable)
      if (statePlayer.specialDesignEffect && modals.modalCard.id !== 206) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
      }
      // Sort Cards In Hand and Cards Played
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: sorted(statePlayer.cardsInHand, sortId[0], requirementsMet),
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
         payload: sorted(statePlayer.cardsPlayed, sortId[1], requirementsMet),
      })
      // Turn off Indentured Workers effect (if aplicable)
      if (statePlayer.indenturedWorkersEffect && modals.modalCard.id !== 195) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: sorted(
               modifiedCards(statePlayer.cardsInHand, statePlayer, null, false),
               sortId[0],
               requirementsMet
            ),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: sorted(
               modifiedCards(statePlayer.cardsPlayed, statePlayer, null, false),
               sortId[1],
               requirementsMet
            ),
         })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
      }
      // Update Log
      if (logData)
         setLogItems((logItems) => [
            ...logItems,
            { type: logData.type, data: { text: logData.text, icon: logIcon } },
         ])
   }, [updateVpTrigger])

   function setAnimationSpeed(id) {
      switch (id) {
         case 1:
            setANIMATION_SPEED(2300)
            break
         case 2:
            setANIMATION_SPEED(1500)
            break
         case 3:
            setANIMATION_SPEED(1000)
            break
         case 4:
            setANIMATION_SPEED(600)
            break
         default:
            break
      }
   }

   function getImmEffects(typeOrCardId) {
      return funcGetImmEffects(
         typeOrCardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         getImmEffects,
         stateBoard,
         dispatchBoard,
         modals,
         setModals,
         cards,
         setCards,
         requirementsMet
      )
   }
   function getCardActions(cardId, toBuyResources) {
      return funcGetCardActions(
         cardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         performSubActions,
         stateBoard,
         dispatchBoard,
         modals,
         setModals,
         cards,
         setCards,
         getEffect,
         getImmEffects,
         toBuyResources
      )
   }
   function getEffect(effect) {
      return funcGetEffect(
         effect,
         statePlayer,
         dispatchPlayer,
         dispatchGame,
         modals,
         setModals,
         cards,
         setCards
      )
   }
   function getOptionsActions(option, energyAmount, heatAmount) {
      return funcGetOptionsActions(
         option,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         getImmEffects,
         modals,
         setModals,
         energyAmount,
         heatAmount
      )
   }
   function performSubActions(subActions, logNewData, logNewIcon) {
      return funcPerformSubActions(
         subActions,
         ANIMATION_SPEED,
         setModals,
         dispatchGame,
         setUpdateVpTrigger,
         logNewData,
         logNewIcon,
         setLogData,
         setLogIcon
      )
   }
   function requirementsMet(card) {
      return funcRequirementsMet(card, statePlayer, stateGame, stateBoard, modals, getImmEffects)
   }
   function actionRequirementsMet(card) {
      return funcActionRequirementsMet(card, statePlayer, stateGame, modals, stateBoard)
   }
   function optionRequirementsMet(card) {
      return funcOptionRequirementsMet(card, statePlayer)
   }

   const handleClickMenuIcon = () => {
      modals.menu
         ? setModals({ ...modals, menu: false, settings: false, rules: false })
         : setModals({ ...modals, menu: true })
   }

   return (
      <div className="game">
         <StatePlayerContext.Provider value={{ statePlayer, dispatchPlayer }}>
            <StateGameContext.Provider
               value={{
                  stateGame,
                  dispatchGame,
                  logItems,
                  setLogItems,
                  getImmEffects,
                  getCardActions,
                  getEffect,
                  getOptionsActions,
                  performSubActions,
                  requirementsMet,
                  actionRequirementsMet,
                  optionRequirementsMet,
                  ANIMATION_SPEED,
                  setANIMATION_SPEED,
                  sortId,
                  setSortId,
               }}
            >
               <StateBoardContext.Provider value={{ stateBoard, dispatchBoard }}>
                  <CorpsContext.Provider value={corps}>
                     <CardsContext.Provider value={{ cards, setCards }}>
                        <ModalsContext.Provider value={{ modals, setModals }}>
                           {/* Standard Projects Button */}
                           <AnimatePresence>
                              {!stateGame.phaseCorporation &&
                                 !stateGame.phaseDraft &&
                                 !stateGame.phaseViewGameState &&
                                 !stateGame.phaseAfterGen14 &&
                                 !modals.endStats && (
                                    <motion.div
                                       key="keyBtnStandardProjects"
                                       initial={{ opacity: 0 }}
                                       animate={{ opacity: 1 }}
                                       exit={{ opacity: 0 }}
                                       transition={{ duration: 0.5 }}
                                       className="btn-standard-projects-container"
                                    >
                                       <BtnStandardProjects />
                                    </motion.div>
                                 )}
                           </AnimatePresence>

                           {/* Viewing State Game Header */}
                           {stateGame.phaseViewGameState && (
                              <div className="view-game-state-header">VIEWING GAME STATE</div>
                           )}

                           {/* You can convert plants to greeneries Header */}
                           {stateGame.phaseAfterGen14 && !modals.endStats && (
                              <div className="view-game-state-header">
                                 YOU CAN CONVERT PLANTS TO GREENERIES
                              </div>
                           )}

                           {/* Panel State Game */}
                           <AnimatePresence>
                              {modals.panelStateGame &&
                                 !stateGame.phaseCorporation &&
                                 !stateGame.phaseAfterGen14 &&
                                 !modals.endStats && (
                                    <motion.div
                                       key="keyPanelStateGame"
                                       initial={{ opacity: 0 }}
                                       animate={{ opacity: 1 }}
                                       exit={{ opacity: 0 }}
                                       transition={{ duration: 0.5 }}
                                       className="panel-state-game"
                                    >
                                       <PanelStateGame />
                                    </motion.div>
                                 )}
                           </AnimatePresence>

                           {/* Pass Container */}
                           <AnimatePresence>
                              {!stateGame.phaseCorporation && !modals.endStats && (
                                 <motion.div
                                    key="keyPassContainer"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="pass-container"
                                 >
                                    <PassContainer />
                                 </motion.div>
                              )}
                           </AnimatePresence>

                           {/* Board */}
                           <AnimatePresence>
                              <motion.div
                                    key="keyBoard"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className='board center'
                                 >
                                    <Board />
                                 </motion.div>
                           </AnimatePresence>

                           {/* Corporation Panel */}
                           <AnimatePresence>
                              {modals.panelCorp && !stateGame.phaseCorporation && !modals.endStats && (
                                 <motion.div
                                    key="keyPanelCorp"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="panel-corp"
                                 >
                                    <PanelCorp />
                                 </motion.div>
                              )}
                           </AnimatePresence>

                           {/* Modals */}
                           <Modals
                              setGameOn={setGameOn}
                              setAnimationSpeed={setAnimationSpeed}
                              logItems={logItems}
                           />

                           {/* Menu Button */}
                           <AnimatePresence>
                              {!modals.endStats && (
                                 <motion.div
                                    key="keyBtnMenu"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="btn-menu pointer"
                                    onClick={handleClickMenuIcon}
                                 >
                                    <div className="btn-menu-line btn-menu-line1"></div>
                                    <div className="btn-menu-line btn-menu-line2"></div>
                                    <div className="btn-menu-line btn-menu-line3"></div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </ModalsContext.Provider>
                     </CardsContext.Provider>
                  </CorpsContext.Provider>
               </StateBoardContext.Provider>
            </StateGameContext.Provider>
         </StatePlayerContext.Provider>
      </div>
   )
}

export default Game
