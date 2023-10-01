import { useContext } from 'react'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import { StateGameContext, ModalsContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import SelectOption from './SelectOption'
import { funcUpdateLogItemAction } from '../../../../../data/log/log'

const SelectOptionSection = ({ selectedOption, setSelectedOption }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { stateGame, dispatchGame, getOptionsActions, performSubActions, setLogItems } = useContext(StateGameContext)

   const btnActionConfirmPosition = {
      bottom: '-5%',
      left: '50%',
      transform: 'translate(-50%, 110%)',
   }

   const handleClickConfirmBtn = () => {
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `option: ${selectedOption}`)

      let subActions = [...getOptionsActions(selectedOption), ...stateGame.actionsLeft]
      setModals((prev) => ({ ...prev, selectOne: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return (
      <div className="select-one-section">
         {/* HEADER */}
         <div className="header">SELECT ONE</div>
         {/* OPTIONS */}
         {modals.modalSelectOne.options.map((option, idx) => (
            <SelectOption key={idx} idx={idx} option={option} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
         ))}
         {/* CONFIRM BUTTON */}
         <BtnAction text="CONFIRM" onYesFunc={handleClickConfirmBtn} position={btnActionConfirmPosition} />
      </div>
   )
}

export default SelectOptionSection
