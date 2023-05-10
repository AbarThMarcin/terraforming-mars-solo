import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext, UserContext, StateBoardContext } from '../../../game'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { getNewCardsDrawIds, modifiedCards } from '../../../../utils/misc'
import { getCorpLogoMini } from '../../../../data/corporations'
import { LOG_TYPES, funcCreateLogItem, funcCreateLogItemGeneration, funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter } from '../../../../data/log/log'
import { IMM_EFFECTS } from '../../../../data/immEffects/immEffects'
import { EFFECTS } from '../../../../data/effects/effectIcons'
import AnimProdRes from '../animations/AnimProdRes'
import passContBg from '../../../../assets/images/other/passContBg.svg'
import { motion, AnimatePresence } from 'framer-motion'
import { startAnimation } from '../../../../data/animations'
import TotalVP from './TotalVP'
import { SettingsContext, SoundContext } from '../../../../App'
import { RESOURCES, getResIcon } from '../../../../data/resources'

const PassContainer = ({ totalVP }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, setLogItems, ANIMATION_SPEED, setSaveToServerTrigger, setItemsExpanded } =
      useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { settings } = useContext(SettingsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const logo = getCorpLogoMini(statePlayer.corporation.name)

   const newStatePlayer = () => {
      return {
         ...statePlayer,
         resources: {
            mln: statePlayer.production.mln + statePlayer.resources.mln + stateGame.tr,
            steel: statePlayer.production.steel + statePlayer.resources.steel,
            titan: statePlayer.production.titan + statePlayer.resources.titan,
            plant: statePlayer.production.plant + statePlayer.resources.plant,
            energy: statePlayer.production.energy,
            heat: statePlayer.production.heat + statePlayer.resources.heat + statePlayer.resources.energy,
         },
      }
   }

   const onYesFunc = async () => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, stateBoard, { type: LOG_TYPES.PASS }, null, setItemsExpanded)
      // Close confirmation window
      setModals((prev) => ({ ...prev, confirmation: false }))
      // Set actionUsed = false for all cards played and trRaised (for UNMI only) = false
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_ACTION_USED, payload: { actionUsed: false } })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: false })
      // Set special design and indentured workers effects to false
      if (statePlayer.specialDesignEffect) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
         funcSetLogItemsSingleActions('SPECIAL DESIGN effect ended', null, null, setLogItems)
      }
      if (statePlayer.indenturedWorkersEffect) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: modifiedCards(statePlayer.cardsInHand, statePlayer, false),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: modifiedCards(statePlayer.cardsPlayed, statePlayer, false),
         })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
         funcSetLogItemsSingleActions('INDENTURED WORKERS effect ended', null, null, setLogItems)
      }
      // Phase Pass None - do NOT display Panel State Game AND Panel Corp
      let delay = 0
      startAnimation(setModals)
      setModals((prev) => ({
         ...prev,
         panelCorp: false,
         panelStateGame: false,
      }))
      // Show Panel Corp
      delay += ANIMATION_SPEED / 1.5
      setTimeout(() => {
         setModals((prev) => ({
            ...prev,
            panelCorp: true,
            panelStateGame: false,
         }))
      }, delay)
      // Move production amounts to resources (+ TR to mln resource AND energy res to heat res)
      setTimeout(() => {
         sound.prodBetweenGens.play()
      }, delay + ANIMATION_SPEED / 3)
      delay += (ANIMATION_SPEED / 1.5) * (5 / 4)
      let newPlants = statePlayer.resources.plant
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_MLN,
            payload: statePlayer.production.mln + stateGame.tr,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
            payload: statePlayer.production.steel,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
            payload: statePlayer.production.titan,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_PLANT,
            payload: statePlayer.production.plant,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
            payload: statePlayer.production.heat + statePlayer.resources.energy,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_ENERGY,
            payload: statePlayer.production.energy - statePlayer.resources.energy,
         })
         funcSetLogItemsSingleActions(
            `Received ${statePlayer.production.mln + stateGame.tr} MC in the production phase`,
            getResIcon(RESOURCES.MLN),
            statePlayer.production.mln + stateGame.tr,
            setLogItems
         )
         if (statePlayer.production.steel)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.steel} steel in the production phase`,
               getResIcon(RESOURCES.STEEL),
               statePlayer.production.steel,
               setLogItems
            )
         if (statePlayer.production.titan)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.titan} titan in the production phase`,
               getResIcon(RESOURCES.TITAN),
               statePlayer.production.titan,
               setLogItems
            )
         if (statePlayer.production.plant)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.plant} plant in the production phase`,
               getResIcon(RESOURCES.PLANT),
               statePlayer.production.plant,
               setLogItems
            )
         if (statePlayer.production.heat + statePlayer.resources.energy)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.heat + statePlayer.resources.energy} heat in the production phase`,
               getResIcon(RESOURCES.HEAT),
               statePlayer.production.heat + statePlayer.resources.energy,
               setLogItems
            )
         if (statePlayer.production.energy - statePlayer.resources.energy)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.energy - statePlayer.resources.energy} energy in the production phase`,
               getResIcon(RESOURCES.ENERGY),
               statePlayer.production.energy - statePlayer.resources.energy,
               setLogItems
            )
      }, delay)
      // Hide Panel Corp
      delay += (ANIMATION_SPEED / 1.5) * (4 / 5)
      setTimeout(() => {
         setModals((prev) => ({ ...prev, panelCorp: false }))
      }, delay)

      if (stateGame.generation < 14) {
         // Show Panel State Game
         delay += (ANIMATION_SPEED / 1.5) * (4 / 5)
         setTimeout(() => {
            setModals((prev) => ({ ...prev, panelStateGame: true }))
         }, delay)
         // Move to next generation
         setTimeout(() => {
            sound.prodBetweenGens.play()
         }, delay + ANIMATION_SPEED / 3)
         delay += (ANIMATION_SPEED / 1.5) * (5 / 4)
         setTimeout(() => {
            dispatchGame({ type: ACTIONS_GAME.INCREMENT_GEN })
         }, delay)
         // Hide Panel State Game
         delay += (ANIMATION_SPEED / 1.5) * (4 / 5)
         setTimeout(() => {
            setModals((prev) => ({
               ...prev,
               panelCorp: false,
               panelStateGame: false,
            }))
         }, delay)
      }
      if (stateGame.generation < 14) {
         // Show Panel Corp
         delay += ANIMATION_SPEED / 1.5
         setTimeout(() => {
            setModals((prev) => ({ ...prev, panelCorp: true }))
         }, delay)
         // Show Panel State Game
         setTimeout(() => {
            setModals((prev) => ({ ...prev, panelStateGame: true }))
         }, delay)
      }
      funcUpdateLastLogItemAfter(setLogItems, newStatePlayer(), stateGame, stateBoard)
      // setLogItems((logItems) => [
      //    ...logItems.slice(0, -1),
      //    {
      //       type: logItems[logItems.length - 1].type,
      //       data: logItems[logItems.length - 1].data,
      //       details: {
      //          ...logItems[logItems.length - 1].details,
      //          stateAfter: {
      //             statePlayer: newStatePlayer(),
      //             stateGame,
      //             stateBoard,
      //          },
      //       },
      //    },
      // ])

      // Go to next generation or end the game (with greeneries or without them)
      delay += ANIMATION_SPEED / 1.5
      setTimeout(() => {
         // If passed in last generation
         if (stateGame.generation === 14) {
            newPlants += statePlayer.production.plant
            if (newPlants >= statePlayer.valueGreenery) {
               // Show Panel Corp
               setModals((prev) => ({ ...prev, panelCorp: true }))
               setTimeout(() => {
                  // Turn Phase After Gen 14 on
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_AFTER_GEN14, payload: true })
                  // Decrease plants
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_PLANT,
                     payload: -statePlayer.valueGreenery,
                  })
                  // Proper action
                  let actions = getImmEffects(IMM_EFFECTS.GREENERY_WO_OX)
                  // Potential Herbivores
                  if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
                  performSubActions(actions, null, null)
               }, ANIMATION_SPEED / 1.5 / 2)
            } else {
               setModals((prev) => ({ ...prev, endStats: true }))
               // Update Server Data
               setSaveToServerTrigger((prev) => !prev)
            }
         } else {
            getCardsAndShowDraft()
         }
      }, delay)

      async function getCardsAndShowDraft() {
         // Get new 4 random cards
         await getNewCardsDrawIds(4, statePlayer, dispatchPlayer, type, id, user?.token)
         // Show draft
         setModals((prev) => ({ ...prev, animation: false, draft: true }))
         dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
         // Update log (new generation)
         funcCreateLogItemGeneration(setLogItems, stateGame, setItemsExpanded)
      }
   }

   const handleClickPassBtn = () => {
      sound.btnGeneralClick.play()
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: "Do you want to pass?\nIf you do so, you won't be able to play until the next generation.",
            onYes: onYesFunc,
            onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
         },
         confirmation: true,
      }))
   }

   return (
      <>
         {/* Animation */}
         {modals.animation && (
            <>
               {modals.animationData.productionIn.type !== null && <AnimProdRes type="prod-in" />}
               {modals.animationData.productionOut.type !== null && <AnimProdRes type="prod-out" />}
               {modals.animationData.resourcesIn.type !== null && <AnimProdRes type="res-in" />}
               {modals.animationData.resourcesOut.type !== null && <AnimProdRes type="res-out" />}
            </>
         )}
         {/* Button */}
         <AnimatePresence>
            {!stateGame.phaseDraft && !stateGame.phasePlaceTile && !stateGame.phaseViewGameState && !stateGame.phaseCorporation && !modals.animation && (
               <motion.div
                  key="keyBtnPass"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="btn-pass pointer"
                  onClick={handleClickPassBtn}
               >
                  <span>PASS</span>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Background */}
         <img className="full-size" src={passContBg} alt="pass_container_background" />
         {/* Corp Name */}
         <div className="corp-name">{statePlayer.corporation.name}</div>
         {/* Corp Logo */}
         <div className="logo">
            <img src={logo} alt={`logo_${statePlayer.corporation.name}`} />
         </div>
         {/* You text */}
         <div className="you-text">YOU</div>
         {/* TR */}
         <div className="tr">{stateGame.tr}</div>
         {/* TOTAL POINTS */}
         {settings.showTotVP && <TotalVP totalVP={totalVP} />}
      </>
   )
}

export default PassContainer
