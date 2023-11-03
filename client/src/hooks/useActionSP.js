import { useContext } from "react"
import { ModalsContext, StateGameContext, StatePlayerContext } from "../components/game"
import { LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLogItemAction } from "../data/log"
import { SoundContext } from "../App"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from "../data/animations"
import { IMM_EFFECTS } from "../data/immEffects/immEffects"
import { EFFECTS } from "../data/effects/effectIcons"
import { SP } from "../data/StandardProjects"
import { RESOURCES } from "../data/resources"
import { getSPeffectsToCall } from "../data/effects/effects"
import { ACTIONS_GAME } from "../stateActions/actionsGame"

export const useActionSP = (btnClickedId, toBuyMln, toBuyHeat) => {
   const { setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { sound } = useContext(SoundContext)

   const onYesFunc = (name) => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      let logData = { type: LOG_TYPES.SP_ACTION, title: name, titleIcon: name }
      funcCreateLogItem(setLogItems, statePlayer, stateGame, logData, setItemsExpanded)
      // Also save action (string) for log that is being performed
      let actionString = `sp[${toBuyMln[btnClickedId] ? 'paidMln: ' + toBuyMln[btnClickedId] + '; ' : ''}${toBuyHeat ? 'paidHeat: ' + toBuyHeat + '; ' : ''}id: ${btnClickedId}]`
      funcUpdateLogItemAction(setLogItems, actionString)

      let animResPaidTypes = []
      if (toBuyMln[btnClickedId] !== 0) animResPaidTypes.push([RESOURCES.MLN, toBuyMln[btnClickedId]])
      // if (toBuyHeat) animResPaidTypes.push([RESOURCES.HEAT, toBuyHeat])
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
         // Decrease heat (Helion only)
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         if (toBuyHeat) funcSetLogItemsSingleActions(`Paid ${toBuyHeat} MC`, RESOURCES.HEAT, -toBuyHeat, setLogItems)
         // Decrease corporation resources, perform actions and call effects
         let actions = []
         let spEffects = []
         switch (name) {
            case SP.POWER_PLANT:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[1] })
               if (toBuyMln[1]) funcSetLogItemsSingleActions(`Paid ${toBuyMln[1]} MC`, RESOURCES.MLN, -toBuyMln[1], setLogItems)
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.POWER_PLANT)
               // Possible effect for SP Power Plant (standard technology)
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_STANDARD_TECHNOLOGY))
                  actions = [...actions, ...getEffect(EFFECTS.EFFECT_STANDARD_TECHNOLOGY)]
               break
            case SP.ASTEROID:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[2] })
               if (toBuyMln[2]) funcSetLogItemsSingleActions(`Paid ${toBuyMln[2]} MC`, RESOURCES.MLN, -toBuyMln[2], setLogItems)
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.TEMPERATURE)
               // Possible effect for SP Asteroid (standard technology)
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_STANDARD_TECHNOLOGY))
                  actions = [...actions, ...getEffect(EFFECTS.EFFECT_STANDARD_TECHNOLOGY)]
               break
            case SP.AQUIFER:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[3] })
               if (toBuyMln[3]) funcSetLogItemsSingleActions(`Paid ${toBuyMln[3]} MC`, RESOURCES.MLN, -toBuyMln[3], setLogItems)
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.AQUIFER)
               // Possible effects for placing ocean
               spEffects = getSPeffectsToCall(SP.AQUIFER)
               spEffects.forEach((spEffect) => {
                  if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
                     actions = [...actions, ...getEffect(spEffect)]
               })
               break
            case SP.GREENERY:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[4] })
               if (toBuyMln[4]) funcSetLogItemsSingleActions(`Paid ${toBuyMln[4]} MC`, RESOURCES.MLN, -toBuyMln[4], setLogItems)
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.GREENERY)
               // Possible effects for placing greenery
               spEffects = getSPeffectsToCall(SP.GREENERY)
               spEffects.forEach((spEffect) => {
                  if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
                     actions = [...actions, ...getEffect(spEffect)]
               })
               break
            case SP.CITY:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[5] })
               if (toBuyMln[5]) funcSetLogItemsSingleActions(`Paid ${toBuyMln[5]} MC`, RESOURCES.MLN, -toBuyMln[5], setLogItems)
               // Proper action No 1: 1 mln production
               actions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.MLN,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
               })
               // Proper action No 2:
               actions = [...actions, ...getImmEffects(IMM_EFFECTS.CITY)]
               // Possible effects for placing city
               spEffects = getSPeffectsToCall(SP.CITY)
               spEffects.forEach((spEffect) => {
                  if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
                     actions = [...actions, ...getEffect(spEffect)]
               })
               break
            default:
               break
         }
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return { onYesFunc }
}
