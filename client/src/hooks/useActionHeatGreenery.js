import { useContext } from 'react'
import { ModalsContext, StateGameContext, StatePlayerContext } from '../components/game'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { EFFECTS } from '../data/effects/effectIcons'
import { IMM_EFFECTS } from '../data/immEffects/immEffects'
import { LOG_ICONS, LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { SoundContext } from '../App'
import { RESOURCES } from '../data/resources'
import { useSubactionTile } from './useSubactionTile'

export const useActionHeatGreenery = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const { handleClickField } = useSubactionTile()

   const onYesFuncGreenery = () => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.CONVERT_PLANTS, titleIcon: LOG_ICONS.CONVERT_PLANTS }, setItemsExpanded)
      // Save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, 'convertGreenery')
      // Close confirmation window
      setModals((prev) => ({ ...prev, confirmation: false, cardPlayed: false }))
      // Cost animation
      startAnimation(setModals)
      setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.PLANT, statePlayer.valueGreenery, setModals, sound)
      // Proper convert plants to greenery action
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease plants
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })
         funcSetLogItemsSingleActions(`Paid ${statePlayer.valueGreenery} plants`, RESOURCES.PLANT, -statePlayer.valueGreenery, setLogItems)
         // Proper action
         let actions = getImmEffects(IMM_EFFECTS.GREENERY)
         // Possible effect for placing greenery (herbivores only)
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions, false, handleClickField)
      }, ANIMATION_SPEED)
   }

   const onYesFuncHeat = () => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.CONVERT_HEAT, titleIcon: LOG_ICONS.CONVERT_HEAT }, setItemsExpanded)
      // Save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, 'convertHeat')
      // Close confirmation window
      setModals((prev) => ({ ...prev, confirmation: false, cardPlayed: false }))
      // Cost animation
      startAnimation(setModals)
      setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.HEAT, 8, setModals, sound)
      // Proper convert heat to temperature action
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease heat
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
         funcSetLogItemsSingleActions('Paid 8 heat', RESOURCES.HEAT, -8, setLogItems)
         // Proper action
         let actions = getImmEffects(IMM_EFFECTS.TEMPERATURE)
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, ANIMATION_SPEED)
   }

   return { onYesFuncGreenery, onYesFuncHeat }
}
