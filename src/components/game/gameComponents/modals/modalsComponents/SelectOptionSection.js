import { useContext } from 'react'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import { StateGameContext, ModalsContext } from '../../../Game'
import SelectOption from './SelectOption'

const SelectOptionSection = ({ selectedOption, setSelectedOption }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { stateGame, dispatchGame, getOptionsActions, performSubActions } =
      useContext(StateGameContext)

   const handleClickOptionConfirm = () => {
      let subActions = [...getOptionsActions(selectedOption), ...stateGame.actionsLeft]
      setModals((prevModals) => ({ ...prevModals, selectOne: false }))
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
            <SelectOption
               key={idx}
               idx={idx}
               option={option}
               selectedOption={selectedOption}
               setSelectedOption={setSelectedOption}
            />
         ))}
         {/* CONFIRM BUTTON */}
         <div className="modal-resource-confirm-btn pointer" onClick={handleClickOptionConfirm}>
            CONFIRM
         </div>
      </div>
   )
}

export default SelectOptionSection
