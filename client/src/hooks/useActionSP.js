import { useContext } from 'react'
import { ActionsContext, ModalsContext, StateBoardContext, StateGameContext, StatePlayerContext } from '../components/game'
import { LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { SoundContext } from '../App'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { IMM_EFFECTS } from '../data/immEffects/immEffects'
import { EFFECTS } from '../data/effects/effectIcons'
import { SP } from '../data/StandardProjects'
import { RESOURCES } from '../data/resources'
import { getSPeffectsToCall } from '../data/effects/effects'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { TILES, setAvailFieldsAdjacent } from '../data/board'
import { getAllResourcesInMlnOnlyHeat } from '../utils/misc'

export const useActionSP = () => {
   const { setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { sound } = useContext(SoundContext)
   const { actions, setActions } = useContext(ActionsContext)

   const handleClickArrow = (operation) => {
      sound.btnGeneralClick.play()

      if (operation === 'increment') {
         setActions((prev) => ({ ...prev, mln: prev.mln - 1, heat: prev.heat + 1 }))
      } else if (operation === 'decrement') {
         setActions((prev) => ({ ...prev, mln: prev.mln + 1, heat: prev.heat - 1 }))
      }
   }

   function SPrequirementsMet(id, currentCost) {
      let v = true
      // If stateGame.phasePlaceTile
      if (stateGame.phasePlaceTile) v = false
      // If less resources than cost
      if (actions.id === id) {
         if (statePlayer.resources.mln < currentCost) v = false
      } else {
         if (getAllResourcesInMlnOnlyHeat(statePlayer) < currentCost) v = false
      }
      // Other requirements
      let availFields = []
      switch (id) {
         case 0: // SP.SELL_PATENT
            if (statePlayer.cardsInHand.length === 0) v = false
            break
         case 1: // SP.POWER_PLANT
            // No requirements
            break
         case 2: // SP.ASTEROID
            if (stateGame.globalParameters.temperature === 8) v = false
            break
         case 3: // SP.AQUIFER
            if (stateGame.globalParameters.oceans === 9) v = false
            break
         case 4: // SP.GREENERY
            availFields = stateBoard.filter(
               (field) => !field.oceanOnly && !field.object && field.name !== 'PHOBOS SPACE HAVEN' && field.name !== 'GANYMEDE COLONY' && field.name !== 'NOCTIS CITY'
            )
            if (availFields.length === 0) v = false
            break
         case 5: // SP.CITY
            const cityTiles = stateBoard.filter((field) => field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL)
            availFields = setAvailFieldsAdjacent(stateBoard, cityTiles, false).filter((availField) => availField.available === true)
            if (availFields.length === 0) v = false
            break
         default:
            break
      }
      return v
   }

   const handleClickBtn = (id, name, textConfirmation, currentCost, isAvailable) => {
      // Do nothing if not available
      if (!isAvailable) return
      sound.btnGeneralClick.play()
      // Set id of actions object to the current id
      setActions((prev) => ({ ...prev, id, mln: currentCost, heat: 0 }))
      // If clicked SELL PATENT
      if (name === SP.SELL_PATENT) {
         setModals((prev) => ({ ...prev, sellCards: true, modalCards: statePlayer.cardsInHand }))
         return
      }
      // For Helion only: first click shows 'Decrease Cost with heat' minimodal,
      // second click shows confirmation modal
      if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0 && actions.id !== id) return

      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: textConfirmation,
            onYes: () => onYesFunc(id, name, currentCost, actions.heat),
            onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
         },
         confirmation: true,
      }))
   }

   const onYesFunc = (id, name, currentCost, heat) => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      let logData = { type: LOG_TYPES.SP_ACTION, title: name, titleIcon: name }
      funcCreateLogItem(setLogItems, statePlayer, stateGame, logData, setItemsExpanded)
      // Also save action (string) for log that is being performed
      let actionString = `sp[${currentCost ? 'paidMln: ' + currentCost + '; ' : ''}${heat ? 'paidHeat: ' + heat + '; ' : ''}id: ${id}]`
      funcUpdateLogItemAction(setLogItems, actionString)

      let animResPaidTypes = []
      if (currentCost) animResPaidTypes.push([RESOURCES.MLN, currentCost])
      if (heat) animResPaidTypes.push([RESOURCES.HEAT, heat])
      setModals((prev) => ({
         ...prev,
         confirmation: false,
         standardProjects: false,
         sellCards: false,
         cardPlayed: false,
      }))
      // ------------------------ ANIMATIONS ------------------------
      startAnimation(setModals)
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setAnimation(ANIMATIONS.RESOURCES_OUT, animResPaidTypes[i][0], animResPaidTypes[i][1], setModals, sound)
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         endAnimation(setModals)
         let actionsToPerform = []
         let spEffects = []
         // Decrease MC (if applicable)
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -currentCost })
         if (currentCost) funcSetLogItemsSingleActions(`Paid ${currentCost} MC`, RESOURCES.MLN, -currentCost, setLogItems)
         // Decrease heat (Helion only)
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -heat })
         if (heat) funcSetLogItemsSingleActions(`Paid ${heat} heat`, RESOURCES.HEAT, -heat, setLogItems)

         switch (name) {
            case SP.POWER_PLANT:
               actionsToPerform = getImmEffects(IMM_EFFECTS.POWER_PLANT)
               // Possible effect for SP Power Plant (standard technology)
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_STANDARD_TECHNOLOGY))
                  actionsToPerform = [...actionsToPerform, ...getEffect(EFFECTS.EFFECT_STANDARD_TECHNOLOGY)]
               break
            case SP.ASTEROID:
               actionsToPerform = getImmEffects(IMM_EFFECTS.TEMPERATURE)
               // Possible effect for SP Asteroid (standard technology)
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_STANDARD_TECHNOLOGY))
                  actionsToPerform = [...actionsToPerform, ...getEffect(EFFECTS.EFFECT_STANDARD_TECHNOLOGY)]
               break
            case SP.AQUIFER:
               actionsToPerform = getImmEffects(IMM_EFFECTS.AQUIFER)
               // Possible effects for placing ocean
               spEffects = getSPeffectsToCall(SP.AQUIFER)
               spEffects.forEach((spEffect) => {
                  if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
                     actionsToPerform = [...actionsToPerform, ...getEffect(spEffect)]
               })
               break
            case SP.GREENERY:
               actionsToPerform = getImmEffects(IMM_EFFECTS.GREENERY)
               // Possible effects for placing greenery
               spEffects = getSPeffectsToCall(SP.GREENERY)
               spEffects.forEach((spEffect) => {
                  if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
                     actionsToPerform = [...actionsToPerform, ...getEffect(spEffect)]
               })
               break
            case SP.CITY:
               // Proper action No 1: 1 mln production
               actionsToPerform.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.MLN,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
               })
               // Proper action No 2: City
               actionsToPerform = [...actionsToPerform, ...getImmEffects(IMM_EFFECTS.CITY)]
               // Possible effects for placing city
               spEffects = getSPeffectsToCall(SP.CITY)
               spEffects.forEach((spEffect) => {
                  if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
                     actionsToPerform = [...actionsToPerform, ...getEffect(spEffect)]
               })
               break
            default:
               break
         }
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actionsToPerform })
         performSubActions(actionsToPerform)
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return { handleClickArrow, SPrequirementsMet, handleClickBtn, onYesFunc }
}
