import { useReducer, createContext, useState, useEffect, useMemo } from 'react'
import { ACTIONS_PLAYER } from '../../stateActions/actionsPlayer'
import { reducerGame } from '../../stateActions/actionsGame'
import { reducerPlayer } from '../../stateActions/actionsPlayer'
import { reducerBoard } from '../../stateActions/actionsBoard'
import { funcPerformSubActions, turnReplayActionOff } from '../../utils/misc'
import { getLogConvertedForDB, getThinerStatePlayerForActive } from '../../utils/dataConversion'
import { getCards, getNewCardsDrawIds, getCardsSorted, getCardsWithTimeAdded } from '../../utils/cards'
import { updateVP } from '../../utils/points'
import { getCardsWithDecreasedCost } from '../../utils/cards'
import { funcRequirementsMet, funcActionRequirementsMet, funcOptionRequirementsMet } from '../../data/requirements/requirements'
import { funcGetImmEffects } from '../../data/immEffects/immEffects'
import { funcGetCardActions } from '../../data/cardActions/cardActions'
import { funcGetOptionsActions } from '../../data/selectOneOptions'
import { motion, AnimatePresence } from 'framer-motion'
import { RESOURCES } from '../../data/resources'
import { ANIMATIONS, startAnimation } from '../../data/animations'
import { TAGS } from '../../data/tags'
import PanelCorp from './components/panelCorp'
import PanelStateGame from './components/panelStateGame/PanelStateGame'
import BtnStandardProjects from './components/buttons/BtnStandardProjects'
import PassContainer from './components/passContainer'
import Board from './components/board'
import Modals from './components/modals'
import { useNavigate } from 'react-router-dom'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { INIT_BOARD } from '../../initStates/initBoard'
import { CORPORATIONS } from '../../data/corporations'
import { updateGameData } from '../../api/activeGame'
import { EFFECTS } from '../../data/effects/effectIcons'
import { funcGetEffect } from '../../data/effects/effects'
import { useContext } from 'react'
import { SettingsContext, SoundContext } from '../../App'
import { funcUpdateLastLogItemAfter, funcSetLogItemsSingleActions, LOG_TYPES } from '../../data/log'
import Timer from './components/Timer'
import ReplayLogList from './components/replayLogList/ReplayLogList'
import ModalMenu from './components/modals/modalMenu/ModalMenu'
import ModalSettings from './components/modals/modalSettings/ModalSettings'
import ModalRules from './components/modals/modalRules/ModalRules'
import ModalConfirmation from './components/modals/modalConfirmation/ModalConfirmation'
import { INIT_LOG_ITEMS } from '../../initStates/initLogItems'
import { MATCH_TYPES } from '../../data/app'
import { INIT_ACTIONS } from '../../initStates/initActions'
import { SPEED } from '../../data/app'

export const UserContext = createContext()
export const StatePlayerContext = createContext()
export const StateGameContext = createContext()
export const ModalsContext = createContext()
export const StateBoardContext = createContext()
export const CorpsContext = createContext()
export const ActionsContext = createContext()

function Game({ id, initStatePlayer, initStateGame, initStateModals, initStateBoard, initCorpsIds, initLogItems, initDurationSeconds, type, user, setUser, dataForReplay }) {
   const navigate = useNavigate()
   const { settings } = useContext(SettingsContext)
   const [statePlayer, dispatchPlayer] = useReducer(reducerPlayer, initStatePlayer || INIT_STATE_PLAYER)
   const [stateGame, dispatchGame] = useReducer(reducerGame, initStateGame || INIT_STATE_GAME)
   const [modals, setModals] = useState(initStateModals || INIT_MODALS)
   const [stateBoard, dispatchBoard] = useReducer(reducerBoard, initStateBoard || INIT_BOARD)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   const corps = useMemo(() => getInitCorps(), [initCorpsIds])
   const [logItems, setLogItems] = useState(initLogItems || INIT_LOG_ITEMS)
   const [durationSeconds, setDurationSeconds] = useState(initDurationSeconds)
   const [expanded, setExpanded] = useState(null)
   const [itemsExpanded, setItemsExpanded] = useState([null])
   const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(getAnimationSpeed(settings.speedId))
   const [updateTrigger, setTrigger] = useState(false)
   const [saveToServerTrigger, setSaveToServerTrigger] = useState(false)
   const { music, sound } = useContext(SoundContext)
   const [syncError, setSyncError] = useState('')
   const [currentLogItem, setCurrentLogItem] = useState(1)
   const [actions, setActions] = useState(INIT_ACTIONS)

   useEffect(() => {
      // If game started by placing 'match' or 'match' in the url manually, go to main menu
      if (corps.length === 0) navigate('/')
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      // Reset actions object
      setActions(INIT_ACTIONS)
      // Turn off Special Design effect (if aplicable)
      if (statePlayer.specialDesignEffect && modals.modalCard.id !== 206) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
         funcSetLogItemsSingleActions('SPECIAL DESIGN effect ended', null, null, setLogItems)
      }
      // Call effect of Olympus Conference, THEN Mars University
      if (modals.cardPlayed) {
         if (modals.modalCard.id !== 90 && modals.modalCard.id !== 192 && modals.modalCard.id !== 196 && modals.modalCard.id !== 204) {
            callScienceEffects()
         }
      }
      // Go to next move in replay mode when science effects are not called
      let scienceEffectsCalled =
         (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE) &&
            modals.modalCard?.effectsToCall.includes(EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) ||
         (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY) &&
            modals.modalCard?.effectsToCall.includes(EFFECTS.EFFECT_MARS_UNIVERSITY) &&
            statePlayer.cardsInHand.filter((card) => card.id !== modals.modalCard?.id).length > 0)
      if (!scienceEffectsCalled) {
         turnReplayActionOff(stateGame, dispatchGame, dataForReplay, setCurrentLogItem)
      }
      // Sort Cards In Hand and Cards Played
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: getCardsSorted(statePlayer.cardsInHand, settings.sortId[0], requirementsMet),
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
         payload: getCardsSorted(statePlayer.cardsPlayed, settings.sortId[1], requirementsMet),
      })
      // Turn off Indentured Workers effect (if aplicable)
      if (statePlayer.indenturedWorkersEffect && modals.modalCard.id !== 195) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: getCardsSorted(getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer, false, false), settings.sortId[0], requirementsMet),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: getCardsSorted(getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer, false, false), settings.sortId[1], requirementsMet),
         })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
         funcSetLogItemsSingleActions('INDENTURED WORKERS effect ended', null, null, setLogItems)
      }

      // Update Log with state of the game AFTER played action
      if (logItems[logItems.length - 1].type !== LOG_TYPES.GENERATION) funcUpdateLastLogItemAfter(setLogItems, statePlayer, stateGame)

      // Update VP
      updateVP(statePlayer, dispatchPlayer, stateGame, stateBoard)

      // Update Game on server
      setSaveToServerTrigger((prev) => !prev)

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [updateTrigger])

   // Update Game Data on server
   useEffect(() => {
      if (user && !stateGame.phaseCorporation && !modals.endStats && type !== MATCH_TYPES.REPLAY) {
         const updatedData = {
            statePlayer: getThinerStatePlayerForActive(statePlayer),
            stateGame,
            stateModals: modals,
            stateBoard,
            logItems: getLogConvertedForDB(logItems),
            durationSeconds,
         }
         updateGameData(user.token, updatedData, type).then((res) => {
            if (res.message === 'success') {
               setSyncError('')
            } else {
               setSyncError('THERE ARE SOME ISSUES WITH UPDATING GAME ON SERVER')
            }
         })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [saveToServerTrigger])

   // Update Animation Speed when settings are changed
   useEffect(() => {
      setANIMATION_SPEED(getAnimationSpeed(settings.speedId))
   }, [settings.speedId])

   function getInitCorps() {
      if (!initCorpsIds) return []
      return [CORPORATIONS[initCorpsIds[0] - 1], CORPORATIONS[initCorpsIds[1] - 1]]
   }

   async function callScienceEffects() {
      if (!modals.modalCard) return
      let effects = []
      let cardsInHand = statePlayer.cardsInHand
      let newCardsDrawIds
      // Call Olympus Conference effect
      let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
      if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE) && modals.modalCard.effectsToCall.includes(EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
         if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science === 0) {
            effects = [
               {
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 },
                     })
                     funcSetLogItemsSingleActions('Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1, setLogItems)
                     newStatePlayer = {
                        ...newStatePlayer,
                        cardsPlayed: newStatePlayer.cardsPlayed.map((card) => {
                           if (card.id === 185) {
                              return { ...card, units: { microbe: 0, animal: 0, science: card.units.science + 1, fighter: 0 } }
                           } else {
                              return card
                           }
                        }),
                     }
                     funcUpdateLastLogItemAfter(setLogItems, newStatePlayer, stateGame)
                  },
               },
            ]
         } else {
            startAnimation(setModals)
            newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
            effects = [
               {
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 },
                     })
                     funcSetLogItemsSingleActions('Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1, setLogItems)
                     newStatePlayer = {
                        ...newStatePlayer,
                        cardsPlayed: newStatePlayer.cardsPlayed.map((card) => {
                           if (card.id === 185) {
                              return { ...card, units: { microbe: 0, animal: 0, science: card.units.science - 1, fighter: 0 } }
                           } else {
                              return card
                           }
                        }),
                     }
                     funcUpdateLastLogItemAfter(setLogItems, newStatePlayer, stateGame)
                  },
               },
            ]
            cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
            effects.push({
               name: ANIMATIONS.CARD_IN,
               type: RESOURCES.CARD,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                     payload: cardsInHand,
                  })
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                     payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)],
                  })
                  funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1, setLogItems)
                  newStatePlayer = {
                     ...newStatePlayer,
                     cardsInHand: cardsInHand,
                  }
                  funcUpdateLastLogItemAfter(setLogItems, newStatePlayer, stateGame)
               },
            })
         }
      }

      // Call Mars University
      if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY) && modals.modalCard.effectsToCall.includes(EFFECTS.EFFECT_MARS_UNIVERSITY)) {
         if (cardsInHand.filter((card) => card.id !== modals.modalCard.id).length > 0) {
            modals.modalCard.tags.forEach((tag) => {
               if (tag === TAGS.SCIENCE)
                  effects.push({
                     name: ANIMATIONS.USER_INTERACTION,
                     type: null,
                     value: null,
                     func: () => setModals((prev) => ({ ...prev, modalCards: cardsInHand, marsUniversity: true })),
                  })
            })
         }
      }
      if (effects.length > 0) performSubActions(effects, true)
   }

   function getAnimationSpeed(id) {
      switch (id) {
         case 1:
            return SPEED.SLOW
         case 2:
            return SPEED.NORMAL
         case 3:
            return SPEED.FAST
         case 4:
            return SPEED.VERY_FAST
         default:
            return
      }
   }

   function getImmEffects(typeOrCardId, initDrawCardsIds) {
      return funcGetImmEffects(
         typeOrCardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         stateBoard,
         dispatchBoard,
         modals,
         setModals,
         type,
         id,
         user?.token,
         getImmEffects,
         sound,
         initDrawCardsIds,
         setLogItems,
         dataForReplay
      )
   }
   function getCardActions(cardId, toBuyResources) {
      return funcGetCardActions(
         cardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         stateBoard,
         setModals,
         getImmEffects,
         toBuyResources,
         type,
         id,
         user?.token,
         sound,
         setLogItems,
         dataForReplay
      )
   }
   function getEffect(effect) {
      return funcGetEffect(effect, statePlayer, dispatchPlayer, dispatchGame, modals, setModals, setLogItems)
   }
   function getOptionsActions(option, energyAmount, heatAmount) {
      return funcGetOptionsActions(option, statePlayer, dispatchPlayer, dispatchGame, getImmEffects, modals, setModals, energyAmount, heatAmount, setLogItems)
   }
   function performSubActions(subActions, noTrigger, handleClickField) {
      return funcPerformSubActions(
         subActions,
         ANIMATION_SPEED,
         setModals,
         stateGame,
         stateBoard,
         dispatchGame,
         setTrigger,
         sound,
         noTrigger,
         dataForReplay,
         currentLogItem,
         setCurrentLogItem,
         type,
         handleClickField
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
      sound.btnGeneralClick.play()
      modals.menu ? setModals((prev) => ({ ...prev, menu: false, settings: false, rules: false })) : setModals((prev) => ({ ...prev, menu: true }))
      music.volume(settings.musicVolume)
      Object.keys(sound).forEach((key) => sound[key].volume(settings.gameVolume))
   }

   return (
      <div className="game">
         <ActionsContext.Provider value={{ actions, setActions }}>
            <UserContext.Provider value={{ user, setUser, type, id }}>
               <StatePlayerContext.Provider value={{ statePlayer, dispatchPlayer }}>
                  <StateGameContext.Provider
                     value={{
                        stateGame,
                        dispatchGame,
                        logItems,
                        setLogItems,
                        setItemsExpanded,
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
                        setSaveToServerTrigger,
                        setSyncError,
                        durationSeconds,
                        dataForReplay,
                        currentLogItem,
                        setCurrentLogItem,
                     }}
                  >
                     <StateBoardContext.Provider value={{ stateBoard, dispatchBoard }}>
                        <CorpsContext.Provider value={{ corps, initCorpsIds }}>
                           <ModalsContext.Provider value={{ modals, setModals }}>
                              {/* Standard Projects Button */}
                              <AnimatePresence>
                                 {!stateGame.phaseCorporation && !stateGame.phaseDraft && !stateGame.phaseViewGameState && !stateGame.phaseAfterGen14 && !modals.endStats && (
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

                              {/* Standard Projects Button */}
                              {stateGame.phasePlaceTile && <div className="game-message">PLACE {stateGame.phasePlaceTileData}</div>}

                              {/* Viewing State Game Header */}
                              {stateGame.phaseViewGameState && <div className="view-game-state-header">VIEWING GAME STATE</div>}

                              {/* You can convert plants to greeneries Header */}
                              {stateGame.phaseAfterGen14 && !modals.endStats && <div className="view-game-state-header">YOU CAN CONVERT PLANTS TO GREENERIES</div>}

                              {/* Panel State Game */}
                              <AnimatePresence>
                                 {modals.panelStateGame && !stateGame.phaseCorporation && !stateGame.phaseAfterGen14 && !modals.endStats && (
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
                                 <motion.div key="keyBoard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="board center">
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

                              {/* Match Type & Timer*/}
                              <div className="match-type">
                                 {type} {!dataForReplay && <Timer durationSeconds={durationSeconds} setDurationSeconds={setDurationSeconds} setSyncError={setSyncError} />}
                              </div>

                              {/* Modals */}
                              <Modals logItems={logItems} expanded={expanded} setExpanded={setExpanded} itemsExpanded={itemsExpanded} setItemsExpanded={setItemsExpanded} />

                              {/* Replay - log items list */}
                              {dataForReplay && <ReplayLogList />}

                              {/* Menu Button */}
                              <AnimatePresence>
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
                              </AnimatePresence>

                              {/* Modal Menu */}
                              {modals.menu && <ModalMenu />}

                              {/* Modal Settings */}
                              {modals.settings && <ModalSettings />}

                              {/* Modal Rules */}
                              {modals.rules && <ModalRules />}
                              {syncError && <div className="syncError">{syncError}</div>}

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
                           </ModalsContext.Provider>
                        </CorpsContext.Provider>
                     </StateBoardContext.Provider>
                  </StateGameContext.Provider>
               </StatePlayerContext.Provider>
            </UserContext.Provider>
         </ActionsContext.Provider>
      </div>
   )
}

export default Game
