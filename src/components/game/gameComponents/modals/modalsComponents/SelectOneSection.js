import { useContext } from 'react'
import { getOptionIcon } from '../../../../../data/selectOneOptions'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import { StateGameContext, ModalsContext } from '../../../Game'

const SelectOneSection = ({ selectedOptionId, setSelectedOptionId }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { dispatchGame, getOptionsActions, performSubActions } = useContext(StateGameContext)

   const handleClickOptionConfirm = (option) => {
      let subActions = getOptionsActions(option)
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
            <div
               key={idx}
               className={`option ${idx === selectedOptionId && 'selected'}`}
               onClick={(idx) => setSelectedOptionId(idx)}
            >
               <img
                  src={getOptionIcon(option)}
                  alt={`${modals.modalSelectOne.card.name}_opt_${idx + 1}`}
               />
            </div>
         ))}
         {/* CONFIRM BUTTON */}
         <div
            className="modal-resource-confirm-btn pointer"
            onClick={(option) => handleClickOptionConfirm(option)}
         >
            CONFIRM
         </div>
      </div>
   )
}

export default SelectOneSection
