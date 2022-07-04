import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../initStates/actionsPlayer'
import { ACTIONS_GAME } from '../../../../initStates/actionsGame'
import { modifiedCards } from '../../../../util/misc'
import { getCorpLogoMini } from '../../../../data/corporations'
import { LOG_TYPES } from '../../../../data/log'
import { IMM_EFFECTS } from '../../../../data/immEffects/immEffects'
import { EFFECTS } from '../../../../data/effects'
import AnimProdRes from '../animations/AnimProdRes'
import passContBg from '../../../../assets/images/other/passContBg.svg'
import { motion, AnimatePresence } from 'framer-motion'
import { startAnimation } from '../../../../data/animations'
import TotalVP from './TotalVP'

const PassContainer = ({ showTotVP, totalVP }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const {
      stateGame,
      dispatchGame,
      getImmEffects,
      getEffect,
      performSubActions,
      setLogItems,
      ANIMATION_SPEED,
   } = useContext(StateGameContext)
   const logo = getCorpLogoMini(statePlayer.corporation.name)

   const onYesFunc = () => {
      // Update log (pass)
      setLogItems((currentLogItems) => [
         ...currentLogItems,
         { type: LOG_TYPES.PASS },
         { type: LOG_TYPES.GENERATION, data: { text: `${stateGame.generation + 1}` } },
      ])
      // Close confirmation window
      setModals({ ...modals, confirmation: false })
      // Set actionUsed = false for all cards played and trRaised (for UNMI only) = false
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_ACTION_USED, payload: { actionUsed: false } })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: false })
      // Set special design and indentured workers effects to false
      if (statePlayer.specialDesignEffect) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
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
      }

      // Phase Pass None - do NOT display Panel State Game AND Panel Corp
      let delay = 0
      startAnimation(setModals)
      setModals((prevModals) => ({
         ...prevModals,
         panelCorp: false,
         panelStateGame: false,
      }))
      // Show Panel Corp
      delay += ANIMATION_SPEED / 1.5
      setTimeout(() => {
         setModals((prevModals) => ({
            ...prevModals,
            panelCorp: true,
            panelStateGame: false,
         }))
      }, delay)
      // Move production amounts to resources (+ TR to mln resource AND energy res to heat res)
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
      }, delay)
      // Hide Panel Corp
      delay += (ANIMATION_SPEED / 1.5) * (4 / 5)
      setTimeout(() => {
         setModals((prevModals) => ({ ...prevModals, panelCorp: false }))
      }, delay)

      if (stateGame.generation < 14) {
         // Show Panel State Game
         delay += (ANIMATION_SPEED / 1.5) * (4 / 5)
         setTimeout(() => {
            setModals((prevModals) => ({ ...prevModals, panelStateGame: true }))
         }, delay)
         // Move to next generation
         delay += (ANIMATION_SPEED / 1.5) * (5 / 4)
         setTimeout(() => {
            dispatchGame({ type: ACTIONS_GAME.INCREMENT_GEN })
         }, delay)
         // Hide Panel State Game
         delay += (ANIMATION_SPEED / 1.5) * (4 / 5)
         setTimeout(() => {
            setModals((prevModals) => ({
               ...prevModals,
               panelCorp: false,
               panelStateGame: false,
            }))
         }, delay)
      }
      if (stateGame.generation < 14) {
         // Show Panel Corp
         delay += ANIMATION_SPEED / 1.5
         setTimeout(() => {
            setModals((prevModals) => ({ ...prevModals, panelCorp: true }))
         }, delay)
         // Show Panel State Game
         setTimeout(() => {
            setModals((prevModals) => ({ ...prevModals, panelStateGame: true }))
         }, delay)
      }
      // Go to next generation or end the game (with greeneries or without them)
      delay += ANIMATION_SPEED / 1.5
      setTimeout(() => {
         // If passed in last generation
         if (stateGame.generation === 14) {
            newPlants += statePlayer.production.plant
            if (newPlants >= statePlayer.valueGreenery) {
               // Show Panel Corp
               setModals((prevModals) => ({ ...prevModals, panelCorp: true }))
               setTimeout(() => {
                  // Turn Phase After Gen 14 on
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_AFTER_GEN14, payload: true })
                  // Decrease plants
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_PLANT,
                     payload: -statePlayer.valueGreenery,
                  })
                  // Proper action + potential Herbivores
                  let actions = getImmEffects(IMM_EFFECTS.GREENERY)
                  if (
                     statePlayer.cardsPlayed.some(
                        (card) => card.effect === EFFECTS.EFFECT_HERBIVORES
                     )
                  )
                     actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
                  performSubActions(actions, null, null)
               }, ANIMATION_SPEED / 1.5 / 2)
            } else {
               setModals((prevModals) => ({ ...prevModals, endStats: true }))
            }
         } else {
            setModals((prevModals) => ({ ...prevModals, animation: false, draft: true }))
            dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
         }
      }, delay)
   }

   const handleClickPassBtn = () => {
      setModals({
         ...modals,
         modalConf: {
            text: "Do you want to pass?\nIf you do so, you won't be able to play until the next generation.",
            onYes: onYesFunc,
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
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
            {!stateGame.phaseDraft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState &&
               !stateGame.phaseCorporation &&
               !modals.animation && (
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
         {showTotVP && <TotalVP totalVP={totalVP} />}
      </>
   )
}

export default PassContainer
