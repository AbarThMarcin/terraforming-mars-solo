import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../game'
import { IMM_EFFECTS } from '../../../../../data/immEffects/immEffects'
import { ACTIONS_PLAYER } from '../../../../../stateActions/actionsPlayer'
import ProdResSnap from './ProdResSnap'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../../data/animations'
import { getResIcon, RESOURCES } from '../../../../../data/resources'
import { EFFECTS } from '../../../../../data/effects/effectIcons'
import { LOG_ICONS, LOG_TYPES, funcCreateLogItem } from '../../../../../data/log/log'
import { SoundContext } from '../../../../../App'

const ProdResPanel = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const actionGreenery = () => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.CONVERT_PLANTS, text: null }, LOG_ICONS.CONVERT_PLANTS, setItemsExpanded)
      // Cost animation
      startAnimation(setModals)
      setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.PLANT, statePlayer.valueGreenery, setModals, sound)
      // Proper convert plants to greenery action
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease plants
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_PLANT,
            payload: -statePlayer.valueGreenery,
         })
         // Proper action
         let actions = getImmEffects(IMM_EFFECTS.GREENERY)
         // Possible effect for placing greenery (herbivores only)
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, ANIMATION_SPEED)
   }

   const actionTemperature = () => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.CONVERT_HEAT, text: null }, LOG_ICONS.CONVERT_HEAT, setItemsExpanded)
      // Cost animation
      startAnimation(setModals)
      setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.HEAT, 8, setModals, sound)
      // Proper convert heat to temperature action
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease heat
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
         // Proper action
         let actions = getImmEffects(IMM_EFFECTS.TEMPERATURE)
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, ANIMATION_SPEED)
   }

   return (
      <div className="prod-res-panel">
         <ProdResSnap
            prod={statePlayer.production.mln}
            res={statePlayer.resources.mln}
            icon={getResIcon(RESOURCES.MLN)}
            action={{ func: null, type: null }}
            resource={RESOURCES.MLN}
         />
         <ProdResSnap
            prod={statePlayer.production.steel}
            res={statePlayer.resources.steel}
            icon={getResIcon(RESOURCES.STEEL)}
            action={{ func: null, type: null }}
            resource={RESOURCES.STEEL}
         />
         <ProdResSnap
            prod={statePlayer.production.titan}
            res={statePlayer.resources.titan}
            icon={getResIcon(RESOURCES.TITAN)}
            action={{ func: null, type: null }}
            resource={RESOURCES.TITAN}
         />
         <ProdResSnap
            prod={statePlayer.production.plant}
            res={statePlayer.resources.plant}
            icon={getResIcon(RESOURCES.PLANT)}
            action={{ func: actionGreenery, type: 'greenery' }}
            resource={RESOURCES.PLANT}
         />
         <ProdResSnap
            prod={statePlayer.production.energy}
            res={statePlayer.resources.energy}
            icon={getResIcon(RESOURCES.ENERGY)}
            action={{ func: null, type: null }}
            resource={RESOURCES.ENERGY}
         />
         <ProdResSnap
            prod={statePlayer.production.heat}
            res={statePlayer.resources.heat}
            icon={getResIcon(RESOURCES.HEAT)}
            action={{ func: actionTemperature, type: 'temperature' }}
            resource={RESOURCES.HEAT}
         />
      </div>
   )
}

export default ProdResPanel
