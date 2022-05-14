import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import { IMM_EFFECTS } from '../../../../../data/immEffects'
import { ACTIONS_PLAYER } from '../../../../../util/actionsPlayer'
import ProdResSnap from './ProdResSnap'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import {
   ANIMATIONS,
   endAnimation,
   setAnimation,
   startAnimation,
} from '../../../../../data/animations'
import { RESOURCES } from '../../../../../data/resources'
import { EFFECTS } from '../../../../../data/effects'

const ProdResPanel = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED } =
      useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)

   const actionGreenery = () => {
      // Cost animation
      startAnimation(setModals)
      setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.PLANT, statePlayer.valueGreenery, setModals)
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
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES))
            actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
         // Possible effect for placing ocean if placing greenery from converting plants gets the ocean bonus
         // (7% ox, -2 temp, <9 oceans) (arctic algae only)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               actions = [...actions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         }
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, ANIMATION_SPEED)
   }

   const actionTemperature = () => {
      // Cost animation
      startAnimation(setModals)
      setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.HEAT, 8, setModals)
      // Proper convert heat to temperature action
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease heat
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
         // Proper action
         let actions = getImmEffects(IMM_EFFECTS.TEMPERATURE)
         // Possible effects for placing ocean, if increasing temp gets the ocean bonus
         if (
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               actions = [...actions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
         }
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, ANIMATION_SPEED)
   }

   return (
      <div className="prod-res-panel">
         <ProdResSnap
            prod={statePlayer.production.mln}
            res={statePlayer.resources.mln}
            icon={null}
            action={{ func: null, type: null }}
         />
         <ProdResSnap
            prod={statePlayer.production.steel}
            res={statePlayer.resources.steel}
            icon={null}
            action={{ func: null, type: null }}
         />
         <ProdResSnap
            prod={statePlayer.production.titan}
            res={statePlayer.resources.titan}
            icon={null}
            action={{ func: null, type: null }}
         />
         <ProdResSnap
            prod={statePlayer.production.plant}
            res={statePlayer.resources.plant}
            icon={null}
            action={{ func: actionGreenery, type: 'greenery' }}
         />
         <ProdResSnap
            prod={statePlayer.production.energy}
            res={statePlayer.resources.energy}
            icon={null}
            action={{ func: null, type: null }}
         />
         <ProdResSnap
            prod={statePlayer.production.heat}
            res={statePlayer.resources.heat}
            icon={null}
            action={{ func: actionTemperature, type: 'temperature' }}
         />
      </div>
   )
}

export default ProdResPanel
