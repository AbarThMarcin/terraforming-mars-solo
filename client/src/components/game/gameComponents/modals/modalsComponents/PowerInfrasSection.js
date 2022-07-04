import { useContext, useState } from 'react'
import { OPTION_ICONS } from '../../../../../data/selectOneOptions'
import { ACTIONS_GAME } from '../../../../../initStates/actionsGame'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import BtnAction from '../../buttons/BtnAction'
import iconEnergy from '../../../../../assets/images/resources/energy.svg'

const PowerInfrasSection = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { dispatchGame, getOptionsActions, performSubActions } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const [energyAmount, setEnergyAmount] = useState(0)

   const btnActionConfirmPosition = {
      bottom: '-5%',
      left: '50%',
      transform: 'translate(-50%, 110%)',
   }

   const handleClickConfirmBtn = () => {
      let subActions = getOptionsActions(OPTION_ICONS.CARD194_OPTION1, energyAmount, 0)
      setModals((prevModals) => ({ ...prevModals, selectOne: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return (
      <div className="select-one-section">
         {/* HEADER */}
         <div className="header">SELECT AMOUNT</div>
         {/* ENERGY */}
         <div className="card-decrease-cost">
            <div className="amount">{energyAmount}</div>
            <div className="icon">
               <img src={iconEnergy} alt="icon_energy" />
            </div>
            {energyAmount > 0 && (
               <div
                  className="decrease-arrow pointer decrease-arrow-left"
                  onClick={() => setEnergyAmount((prevValue) => prevValue - 1)}
               ></div>
            )}
            {energyAmount < statePlayer.resources.energy && (
               <div
                  className="decrease-arrow pointer decrease-arrow-right"
                  onClick={() => setEnergyAmount((prevValue) => prevValue + 1)}
               ></div>
            )}
         </div>
         {/* CONFIRM BUTTON */}
         <BtnAction
            text="CONFIRM"
            onYesFunc={handleClickConfirmBtn}
            position={btnActionConfirmPosition}
         />
      </div>
   )
}

export default PowerInfrasSection
