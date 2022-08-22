import { useReducer, createContext, useState, useEffect, useMemo } from 'react'
import '../../css/app.css'
import { ACTIONS_PLAYER } from '../../stateActions/actionsPlayer'
import { ACTIONS_GAME, reducerGame } from '../../stateActions/actionsGame'
import { reducerPlayer } from '../../stateActions/actionsPlayer'
import { reducerBoard } from '../../stateActions/actionsBoard'
import {
   funcPerformSubActions,
   getCards,
   getNewCardsDrawIds,
   modifiedCards,
   range,
   sorted,
   updateVP,
   withTimeAdded,
} from '../../utils/misc'
import {
   funcRequirementsMet,
   funcActionRequirementsMet,
   funcOptionRequirementsMet,
} from '../../data/requirements/requirements'
import { funcGetImmEffects } from '../../data/immEffects/immEffects'
import { funcGetCardActions } from '../../data/cardActions/cardActions'
import { funcGetOptionsActions } from '../../data/selectOneOptions'
import { motion, AnimatePresence } from 'framer-motion'
import { RESOURCES } from '../../data/resources'
import { ANIMATIONS } from '../../data/animations'
import { TAGS } from '../../data/tags'
import PanelCorp from './gameComponents/panelCorp/PanelCorp'
import PanelStateGame from './gameComponents/PanelStateGame'
import BtnStandardProjects from './gameComponents/buttons/BtnStandardProjects'
import PassContainer from './gameComponents/passContainer/PassContainer'
import Board from './gameComponents/board/Board'
import Modals from './gameComponents/modals/Modals'
import { useNavigate } from 'react-router-dom'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { INIT_BOARD } from '../../initStates/initBoard'
import { CORPORATIONS } from '../../data/corporations'
import { CARDS } from '../../data/cards'
import { updateGameData } from '../../api/apiActiveGame'
import { EFFECTS } from '../../data/effects/effectIcons'
import { funcGetEffect } from '../../data/effects/effects'
import { useContext } from 'react'
import { SettingsContext, SoundContext } from '../../App'

export const UserContext = createContext()
export const StatePlayerContext = createContext()
export const StateGameContext = createContext()
export const ModalsContext = createContext()
export const StateBoardContext = createContext()
export const CorpsContext = createContext()
export const CardsContext = createContext()

function Game({
   id,
   initStatePlayer,
   initStateGame,
   initStateModals,
   initStateBoard,
   initCorpsIds,
   initCardsIds,
   initLogItems,
   user,
   setUser,
   type,
}) {
   const navigate = useNavigate()
   const { settings } = useContext(SettingsContext)
   const [statePlayer, dispatchPlayer] = useReducer(
      reducerPlayer,
      initStatePlayer || INIT_STATE_PLAYER
   )
   const [stateGame, dispatchGame] = useReducer(reducerGame, initStateGame || INIT_STATE_GAME)
   const [modals, setModals] = useState(initStateModals || INIT_MODALS)
   const [stateBoard, dispatchBoard] = useReducer(reducerBoard, initStateBoard || INIT_BOARD)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   const corps = useMemo(() => getInitCorps(), [initCorpsIds])
   const [cardsDeckIds, setCardsDeckIds] = useState(getInitCardsDeckIds())
   const [cardsDrawIds, setCardsDrawIds] = useState(initCardsIds)
   const [logItems, setLogItems] = useState(initLogItems)
   const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(getAnimationSpeed(settings.speedId))
   const [totalVP, setTotalVP] = useState(14)
   const [updateTrigger, setTrigger] = useState(false)
   const [saveToServerTrigger, setSaveToServerTrigger] = useState(false)
   const [logData, setLogData] = useState(null)
   const [logIcon, setLogIcon] = useState(null)
   const { music, sound } = useContext(SoundContext)

   useEffect(() => {
      // If game started by placing 'quick-match' or 'ranked-match' in the url manually
      // (not by pressing buttons in main menu)
      if (corps.length === 0) navigate('/')
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      // Turn off Special Design effect (if aplicable)
      if (statePlayer.specialDesignEffect && modals.modalCard.id !== 206) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
      }
      // Call effect of Olympus Conference, THEN Mars University
      if (modals.cardPlayed) {
         if (
            modals.modalCard.id !== 90 &&
            modals.modalCard.id !== 192 &&
            modals.modalCard.id !== 196 &&
            modals.modalCard.id !== 204
         ) {
            callScienceEffects()
         }
      }
      // Sort Cards In Hand and Cards Played
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: sorted(statePlayer.cardsInHand, settings.sortId[0], requirementsMet),
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
         payload: sorted(statePlayer.cardsPlayed, settings.sortId[1], requirementsMet),
      })
      // Turn off Indentured Workers effect (if aplicable)
      if (statePlayer.indenturedWorkersEffect && modals.modalCard.id !== 195) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: sorted(
               modifiedCards(statePlayer.cardsInHand, statePlayer, false, false),
               settings.sortId[0],
               requirementsMet
            ),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: sorted(
               modifiedCards(statePlayer.cardsPlayed, statePlayer, false, false),
               settings.sortId[1],
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

      // Update VP
      updateVP(statePlayer, dispatchPlayer, stateGame, stateBoard, setTotalVP)

      // Update Game on server
      setSaveToServerTrigger((prev) => !prev)

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [updateTrigger])

   // Update Game Data on server
   useEffect(() => {
      if (user && !modals.corps && !modals.endStats) {
         const updatedData = {
            statePlayer,
            stateGame,
            stateModals: modals,
            stateBoard,
            corps: initCorpsIds,
            logItems,
         }
         updateGameData(user.token, updatedData, type)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [saveToServerTrigger])

   // Update Animation Speed when settings are changed
   useEffect(() => {
      setANIMATION_SPEED(getAnimationSpeed(settings.speedId))
   }, [settings.speedId])

   function getInitCardsDeckIds() {
      const allIds = range(1, 208)
      if (!initCardsIds) return allIds
      if (initStatePlayer.cardsSeen.length === 0) {
         return allIds.filter((id) => !initCardsIds.includes(id))
      } else {
         return allIds.filter(
            (id) => !initStatePlayer.cardsSeen.map((card) => card.id).includes(id)
         )
      }
   }

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
      if (
         statePlayer.cardsPlayed.some(
            (card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE
         ) &&
         modals.modalCard.effectsToCall.includes(EFFECTS.EFFECT_OLYMPUS_CONFERENCE)
      ) {
         if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science === 0) {
            effects = [
               {
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () =>
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 },
                     }),
               },
            ]
         } else {
            newCardsDrawIds = await getNewCardsDrawIds(
               1,
               cardsDeckIds,
               setCardsDeckIds,
               setCardsDrawIds,
               type,
               id,
               user?.token
            )
            effects = [
               {
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () =>
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 },
                     }),
               },
            ]
            cardsInHand = [
               ...cardsInHand,
               ...modifiedCards(withTimeAdded(getCards(CARDS, newCardsDrawIds)), statePlayer),
            ]
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
                     payload: [...statePlayer.cardsSeen, ...getCards(CARDS, newCardsDrawIds)],
                  })
               },
            })
         }
      }
      // Call Mars University
      if (
         statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY) &&
         modals.modalCard.effectsToCall.includes(EFFECTS.EFFECT_MARS_UNIVERSITY)
      ) {
         if (cardsInHand.filter((card) => card.id !== modals.modalCard.id).length > 0)
            modals.modalCard.tags.forEach((tag) => {
               if (tag === TAGS.SCIENCE)
                  effects.push({
                     name: ANIMATIONS.USER_INTERACTION,
                     type: null,
                     value: null,
                     func: () => {
                        dispatchGame({
                           type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY,
                           payload: true,
                        })
                        setModals((prev) => ({ ...prev, marsUniversity: true }))
                     },
                  })
            })
      }
      performSubActions(effects, null, null, true)
   }

   function getAnimationSpeed(id) {
      switch (id) {
         case 1:
            return 2300
         case 2:
            return 1500
         case 3:
            return 1000
         case 4:
            return 600
         default:
            return
      }
   }

   function getImmEffects(typeOrCardId) {
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
         cardsDeckIds,
         setCardsDeckIds,
         setCardsDrawIds,
         type,
         id,
         user?.token,
         getImmEffects,
         sound
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
         getEffect,
         getImmEffects,
         toBuyResources,
         cardsDeckIds,
         setCardsDeckIds,
         setCardsDrawIds,
         type,
         id,
         user?.token,
         sound
      )
   }
   function getEffect(effect) {
      return funcGetEffect(effect, statePlayer, dispatchPlayer, dispatchGame, modals, setModals)
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
   function performSubActions(subActions, logNewData, logNewIcon, noTrigger) {
      return funcPerformSubActions(
         subActions,
         ANIMATION_SPEED,
         setModals,
         dispatchGame,
         setTrigger,
         logNewData,
         logNewIcon,
         setLogData,
         setLogIcon,
         sound,
         noTrigger
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
      modals.menu
         ? setModals((prev) => ({ ...prev, menu: false, settings: false, rules: false }))
         : setModals((prev) => ({ ...prev, menu: true }))
      music.volume(settings.musicVolume)
      Object.keys(sound).forEach((key) => sound[key].volume(settings.gameVolume))
   }

   return (
      <div className="game">
         <UserContext.Provider value={{ user, setUser, type, id }}>
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
                     setSaveToServerTrigger,
                  }}
               >
                  <StateBoardContext.Provider value={{ stateBoard, dispatchBoard }}>
                     <CorpsContext.Provider value={corps}>
                        <CardsContext.Provider
                           value={{ cardsDrawIds, setCardsDrawIds, cardsDeckIds, setCardsDeckIds }}
                        >
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
                                       <PassContainer totalVP={totalVP} />
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
                                    className="board center"
                                 >
                                    <Board />
                                 </motion.div>
                              </AnimatePresence>

                              {/* Corporation Panel */}
                              <AnimatePresence>
                                 {modals.panelCorp &&
                                    !stateGame.phaseCorporation &&
                                    !modals.endStats && (
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
                              <Modals logItems={logItems} />

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
         </UserContext.Provider>
      </div>
   )
}

export default Game
