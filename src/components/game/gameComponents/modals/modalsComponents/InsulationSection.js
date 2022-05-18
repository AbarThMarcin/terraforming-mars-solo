import { useContext, useState } from 'react'
import { OPTION_ICONS } from '../../../../../data/selectOneOptions'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'

const InsulationSection = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { dispatchGame, getOptionsActions, performSubActions } =
      useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const [heatAmount, setHeatAmount] = useState(0)

   const handleClickOptionConfirm = () => {
      let subActions = getOptionsActions(OPTION_ICONS.CARD152_OPTION1, 0, heatAmount)
      setModals((prevModals) => ({ ...prevModals, selectOne: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return (
      <div className="select-one-section">
         {/* HEADER */}
         <div className="header">SELECT AMOUNT</div>
         {/* HEAT */}
         <div className="card-decrease-cost">
            <span>{heatAmount} HEAT</span>
            {heatAmount > 0 && (
               <div
                  className="decrease-arrow pointer decrease-arrow-left"
                  onClick={() => setHeatAmount((prevValue) => prevValue - 1)}
               ></div>
            )}
            {heatAmount < statePlayer.production.heat && (
               <div
                  className="decrease-arrow pointer decrease-arrow-right"
                  onClick={() => setHeatAmount((prevValue) => prevValue + 1)}
               ></div>
            )}
         </div>
         {/* CONFIRM BUTTON */}
         <div className="modal-resource-confirm-btn pointer" onClick={handleClickOptionConfirm}>
            CONFIRM
         </div>
      </div>
   )
}

export default InsulationSection
