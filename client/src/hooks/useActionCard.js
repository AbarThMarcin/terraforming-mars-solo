import { useContext } from 'react'
import { SoundContext } from '../App'
import { ActionsContext, ModalsContext, StateGameContext, StatePlayerContext, UserContext } from '../components/game'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { EFFECTS } from '../data/effects/effectIcons'
import { LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { RESOURCES } from '../data/resources'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { getCardsWithTimePlayed, getNewCardsDrawIds, hasTag } from '../utils/cards'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { TAGS } from '../data/tags'

export const useActionCard = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED, requirementsMet, setLogItems, setItemsExpanded, dataForReplay } =
      useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const { actions, setActions } = useContext(ActionsContext)

   const handleClickArrow = (resource, operation) => {
      sound.btnGeneralClick.play()
      let resMln = actions.mln
      let resSteel = actions.steel
      let resTitan = actions.titan
      let resHeat = actions.heat
      if (operation === 'increment') {
         resource === RESOURCES.STEEL ? resSteel++ : resource === RESOURCES.TITAN ? resTitan++ : resHeat++
      } else if (operation === 'decrement') {
         resource === RESOURCES.STEEL ? resSteel-- : resource === RESOURCES.TITAN ? resTitan-- : resHeat--
      }
      resMln = Math.max(0, modals.modalCard.currentCost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resHeat)
      if (resMln === 0 && resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat > modals.modalCard.currentCost && resHeat > 0)
         resHeat = Math.max(modals.modalCard.currentCost - (resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan), 0)

      const disabled =
         !requirementsMet(modals.modalCard) ||
         stateGame.phaseViewGameState ||
         stateGame.phasePlaceTile ||
         Math.min(resMln, statePlayer.resources.mln) + resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat < modals.modalCard.currentCost
      setActions((prev) => ({ ...prev, mln: resMln, steel: resSteel, titan: resTitan, heat: resHeat, disabled }))
   }

   function getInitResources() {
      let resTitan
      let resSteel
      let resHeat
      let resMln
      let dis

      // Calculate init titan
      if (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE)) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln

         if (diff > 0) {
            if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) {
               if (statePlayer.valueTitan - statePlayer.valueSteel === 1 || statePlayer.resources.steel > 1) {
                  resTitan = Math.min(Math.floor(diff / statePlayer.valueTitan), statePlayer.resources.titan)
               } else {
                  resTitan = Math.min(Math.ceil(diff / statePlayer.valueTitan), statePlayer.resources.titan)
               }
            } else {
               resTitan = Math.min(Math.ceil(diff / statePlayer.valueTitan), statePlayer.resources.titan)
            }
         } else {
            resTitan = 0
         }
      } else {
         resTitan = 0
      }
      // Calculate init steel
      if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln - resTitan * statePlayer.valueTitan

         if (diff > 0) {
            if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0) {
               if (statePlayer.valueSteel === 2 || statePlayer.resources.heat > 1) {
                  resSteel = Math.min(Math.floor(diff / statePlayer.valueSteel), statePlayer.resources.steel)
               } else {
                  resSteel = Math.min(Math.ceil(diff / statePlayer.valueSteel), statePlayer.resources.steel)
               }
            } else {
               resSteel = Math.min(Math.ceil(diff / statePlayer.valueSteel), statePlayer.resources.steel)
            }
         } else {
            resSteel = 0
         }
      } else {
         resSteel = 0
      }
      // Calculate init heat
      if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln - resTitan * statePlayer.valueTitan - resSteel * statePlayer.valueSteel
         if (diff > 0) {
            resHeat = Math.min(diff, statePlayer.resources.heat)
         } else {
            resHeat = 0
         }
      } else {
         resHeat = 0
      }
      // Calculate init mln
      const diff = Math.max(0, modals.modalCard.currentCost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resHeat)
      resMln = diff
      // Determine disability
      dis = getDisabled(resMln, resSteel, resTitan, resHeat)

      setActions((prev) => ({ ...prev, mln: resMln, steel: resSteel, titan: resTitan, heat: resHeat, disabled: dis }))
   }
   function getDisabled(resMln, resSteel, resTitan, resHeat) {
      // When viewing Game State, disable button
      if (stateGame.phaseViewGameState) return true
      if (stateGame.phasePlaceTile) return true
      // When resources to use the card are not enough, disable button
      if (Math.min(resMln, statePlayer.resources.mln) + resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat < modals.modalCard.currentCost)
         return true
      // When requirements are not met, disable button
      if (!requirementsMet(modals.modalCard)) return true

      return false
   }

   const onYesFunc = async () => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.IMMEDIATE_EFFECT, title: modals.modalCard.name, titleIcon: modals.modalCard.id }, setItemsExpanded)
      // Also save action (string) for log that is being performed
      let actionString = `immEffect[${actions.mln ? 'paidMln: ' + actions.mln + '; ' : ''}${actions.steel ? 'paidSteel: ' + actions.steel + '; ' : ''}${
         actions.titan ? 'paidTitan: ' + actions.titan + '; ' : ''
      }${actions.heat ? 'paidHeat: ' + actions.heat + '; ' : ''}id: ${modals.modalCard.id}]`
      funcUpdateLogItemAction(setLogItems, actionString)

      // ANIMATIONS
      let animResPaidTypes = []
      if (actions.mln) animResPaidTypes.push([RESOURCES.MLN, actions.mln])
      if (actions.steel) animResPaidTypes.push([RESOURCES.STEEL, actions.steel])
      if (actions.titan) animResPaidTypes.push([RESOURCES.TITAN, actions.titan])
      if (actions.heat) animResPaidTypes.push([RESOURCES.HEAT, actions.heat])
      // Close all modals
      setModals((prev) => ({
         ...prev,
         confirmation: false,
         cardWithAction: false,
         cards: false,
         cardPlayed: true,
      }))

      // For Research, Invention Contest, Lagrange Observatory and Technology Demonstration
      // (which are the only cards, for which Olympus Conference effect is implemented
      // directly in the Immediate Effects), before showing animations and doing actual actions,
      // draw random ids first
      let initDrawCardsIds
      if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
         switch (modals.modalCard.id) {
            case 90:
               initDrawCardsIds = await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
               break
            case 192:
               if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science > 0) {
                  initDrawCardsIds = await getNewCardsDrawIds(4, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
               }
               break
            case 196:
               if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science > 0) {
                  initDrawCardsIds = await getNewCardsDrawIds(2, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
               }
               break
            case 204:
               if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science > 0) {
                  initDrawCardsIds = await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
               }
               break
            default:
               break
         }
      }
      // ----------------------------------------------------------------------------------------

      startAnimation(setModals)
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setAnimation(ANIMATIONS.RESOURCES_OUT, animResPaidTypes[i][0], animResPaidTypes[i][1], setModals, sound)
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease Corporation Resources
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actions.mln })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -actions.steel })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -actions.titan })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actions.heat })
         if (actions.mln) funcSetLogItemsSingleActions(`Paid ${actions.mln} MC`, RESOURCES.MLN, -actions.mln, setLogItems)
         if (actions.steel) funcSetLogItemsSingleActions(`Paid ${actions.steel} steel`, RESOURCES.STEEL, -actions.steel, setLogItems)
         if (actions.titan) funcSetLogItemsSingleActions(`Paid ${actions.titan} titanium`, RESOURCES.TITAN, -actions.titan, setLogItems)
         if (actions.heat) funcSetLogItemsSingleActions(`Paid ${actions.heat} heat`, RESOURCES.HEAT, -actions.heat, setLogItems)
         // Remove this card from Cards In Hand
         let newCardsInHand = statePlayer.cardsInHand.filter((card) => card.id !== modals.modalCard.id)
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCardsInHand })
         // Add this card to Cards Played
         let newCardsPlayed = [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed(modals.modalCard)]
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCardsPlayed })

         // ============== IMMEDIATE EFFECTS AND EFFECTS ==============
         // Add Card immediate actions to the subActions list
         let subActions = getImmEffects(modals.modalCard.id, initDrawCardsIds)
         // Add Effects to call that are included in the cardsPlayed effects (and corporation effects) list to the subActions list
         modals.modalCard.effectsToCall.forEach((effect) => {
            if (statePlayer.cardsPlayed.some((card) => card.effect === effect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === effect))
               subActions = [...subActions, ...getEffect(effect)]
         })
         // ===========================================================

         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })

         performSubActions(subActions)
         // =======================================================
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return { onYesFunc, handleClickArrow, getInitResources }
}
