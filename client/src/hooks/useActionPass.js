import { useContext } from "react"
import { ModalsContext, StateGameContext, StatePlayerContext, UserContext } from "../components/game"
import { SoundContext } from "../App"
import { LOG_ICONS, LOG_TYPES, funcCreateLogItem, funcCreateLogItemGeneration, funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter, funcUpdateLogItemAction } from "../data/log"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { getCardsWithDecreasedCost, getNewCardsDrawIds } from "../utils/cards"
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from "../data/animations"
import { RESOURCES } from "../data/resources"
import { IMM_EFFECTS } from "../data/immEffects/immEffects"
import { EFFECTS } from "../data/effects/effectIcons"
import { ACTIONS_GAME } from "../stateActions/actionsGame"

export const useActionPass = () => {
   const { setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, setLogItems, ANIMATION_SPEED, setSaveToServerTrigger, setItemsExpanded, dataForReplay } =
      useContext(StateGameContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const newStatePlayer = getNewStatePlayer()

   function getNewStatePlayer() {
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
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.PASS }, setItemsExpanded)
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, 'pass')
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
            payload: getCardsWithDecreasedCost(statePlayer.cardsInHand, statePlayer, false),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer, false),
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
            RESOURCES.MLN,
            statePlayer.production.mln + stateGame.tr,
            setLogItems
         )
         if (statePlayer.production.steel)
            funcSetLogItemsSingleActions(`Received ${statePlayer.production.steel} steel in the production phase`, RESOURCES.STEEL, statePlayer.production.steel, setLogItems)
         if (statePlayer.production.titan)
            funcSetLogItemsSingleActions(`Received ${statePlayer.production.titan} titanium in the production phase`, RESOURCES.TITAN, statePlayer.production.titan, setLogItems)
         if (statePlayer.production.plant)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.plant} plant${statePlayer.production.plant > 1 ? 's' : ''} in the production phase`,
               RESOURCES.PLANT,
               statePlayer.production.plant,
               setLogItems
            )
         if (statePlayer.production.heat + statePlayer.resources.energy)
            funcSetLogItemsSingleActions(
               `Received ${statePlayer.production.heat + statePlayer.resources.energy} heat in the production phase`,
               RESOURCES.HEAT,
               statePlayer.production.heat + statePlayer.resources.energy,
               setLogItems
            )
         if (statePlayer.production.energy)
            funcSetLogItemsSingleActions(`Received ${statePlayer.production.energy} energy in the production phase`, RESOURCES.ENERGY, statePlayer.production.energy, setLogItems)
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
      funcUpdateLastLogItemAfter(setLogItems, newStatePlayer, stateGame)

      // Go to next generation or end the game (with greeneries or without them)
      delay += ANIMATION_SPEED / 1.5
      setTimeout(() => {
         // If passed in last generation
         if (stateGame.generation === 14) {
            newPlants += statePlayer.production.plant
            if (newPlants >= statePlayer.valueGreenery) {
               // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
               funcCreateLogItem(setLogItems, newStatePlayer, stateGame, { type: LOG_TYPES.FINAL_CONVERT_PLANTS, titleIcon: LOG_ICONS.CONVERT_PLANTS }, setItemsExpanded)
               funcUpdateLogItemAction(setLogItems, 'finalPlantConversion')
               // Show Panel Corp
               setModals((prev) => ({ ...prev, panelCorp: true }))
               setTimeout(() => {
                  // Turn Phase After Gen 14 on
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_AFTER_GEN14, payload: true })
                  // Decrease plants
                  startAnimation(setModals)
                  setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.PLANT, statePlayer.valueGreenery, setModals, sound)
                  setTimeout(() => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })
                     funcSetLogItemsSingleActions(
                        `Paid ${statePlayer.valueGreenery} plants in the final plant conversion phase`,
                        RESOURCES.PLANT,
                        -statePlayer.valueGreenery,
                        setLogItems
                     )
                     endAnimation(setModals)
                  }, ANIMATION_SPEED)
                  // Proper action
                  let actions = getImmEffects(IMM_EFFECTS.GREENERY_WO_OX)
                  // Potential Herbivores
                  if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
                  setTimeout(() => {
                     performSubActions(actions)
                  }, ANIMATION_SPEED)
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
         await getNewCardsDrawIds(4, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
         // Show draft
         setModals((prev) => ({ ...prev, animation: false }))
         dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
         // Update log (new generation)
         funcCreateLogItemGeneration(setLogItems, stateGame, setItemsExpanded)
      }
   }

   return { onYesFunc }
}
