import { useContext, useState } from 'react'
import { OPTION_ICONS } from '../../../../../data/selectOneOptions'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import iconProdBg from '../../../../../assets/images/resources/res_prodBg.svg'
import iconHeat from '../../../../../assets/images/resources/res_heat.svg'
import { funcUpdateLogItemAction } from '../../../../../data/log/log'

const InsulationSection = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { dispatchGame, getOptionsActions, performSubActions, setLogItems } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const [heatAmount, setHeatAmount] = useState(0)

   const btnActionConfirmPosition = {
      bottom: '-5%',
      left: '50%',
      transform: 'translate(-50%, 110%)',
   }

   const handleClickConfirmBtn = () => {
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `option: ${heatAmount}`)

      let subActions = getOptionsActions(OPTION_ICONS.CARD152_OPTION1, 0, heatAmount)
      setModals((prev) => ({ ...prev, selectOne: false }))
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
            <div className="amount">{heatAmount}</div>
            <div className="icon">
               <img src={iconProdBg} alt="icon_prodBg" />
               <img src={iconHeat} alt="icon_heat" />
            </div>
            {heatAmount > 0 && <div className="decrease-arrow pointer decrease-arrow-left" onClick={() => setHeatAmount((prevValue) => prevValue - 1)}></div>}
            {heatAmount < statePlayer.production.heat && (
               <div className="decrease-arrow pointer decrease-arrow-right" onClick={() => setHeatAmount((prevValue) => prevValue + 1)}></div>
            )}
         </div>
         {/* CONFIRM BUTTON */}
         <BtnAction text="CONFIRM" onYesFunc={handleClickConfirmBtn} position={btnActionConfirmPosition} />
      </div>
   )
}

export default InsulationSection
