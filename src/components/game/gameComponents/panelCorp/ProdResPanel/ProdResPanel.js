import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import { ACTIONS } from '../../../../../data/actions'
import { ACTIONS_PLAYER } from '../../../../../util/actionsPlayer'
import ProdResSnap from './ProdResSnap'
import { INIT_ANIMATION_DATA } from '../../../../../initStates/initModals'

const ProdResPanel = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { performActions, ANIMATION_SPEED } = useContext(StateGameContext)

   const actionGreenery = () => {
      // ------------------------ ANIMATIONS ------------------------
      setModals({
         ...modals,
         animationData: {
            ...modals.animationData,
            resourcesOut: {
               type: 'plants',
               value: statePlayer.valueGreenery,
            },
         },
         animation: true,
      })
      setTimeout(() => {
         setModals({
            ...modals,
            animationData: INIT_ANIMATION_DATA,
            animation: false,
         })
         // Greenery Action
         dispatchPlayer({
            type: ACTIONS_PLAYER.CHANGE_RES_PLANTS,
            payload: -statePlayer.valueGreenery,
         })
         performActions(ACTIONS.CONVERT_PLANTS)
      }, ANIMATION_SPEED)
   }

   const actionTemperature = () => {
      // ------------------------ ANIMATIONS ------------------------
      setModals({
         ...modals,
         animationData: {
            ...modals.animationData,
            resourcesOut: {
               type: 'heat',
               value: 8,
            },
         },
         animation: true,
      })
      setTimeout(() => {
         setModals({
            ...modals,
            animationData: INIT_ANIMATION_DATA,
            animation: false,
         })
         // Heat Action
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 })
         performActions(ACTIONS.CONVERT_HEAT)
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
            prod={statePlayer.production.plants}
            res={statePlayer.resources.plants}
            icon={null}
            action={{ func: actionGreenery, type: 'greenery' }}
         />
         <ProdResSnap
            prod={statePlayer.production.power}
            res={statePlayer.resources.power}
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
