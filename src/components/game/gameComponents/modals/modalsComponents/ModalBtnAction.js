import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../../Game'

const ModalBtnAction = ({ text, mln, textConfirmation, onYesFunc }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   const classContainer = `${
      text === 'CANCEL' ? 'modal-btn-cancel-container' : 'modal-btn-action-container'
   }`
   const classBtnAction = `modal-btn ${isDisabled() ? 'disabled' : 'pointer'}`
   const classBtnActionMln = `modal-mln ${isDisabled() && 'disabled'}`

   const handleClickActionBtn = () => {
      // If Button is CANCEL
      if (text === 'CANCEL') {
         setModals({ ...modals, sellCards: false })
         return
      }
      // If Button is NOT CANCEL and NOT DISABLED
      if (!isDisabled())
         setModals({
            ...modals,
            modalConfData: {
               text: textConfirmation,
               onYes: onYesFunc,
               onNo: () => setModals({ ...modals, confirmation: false }),
            },
            confirmation: true,
         })
   }

   function isDisabled() {
      return (text === 'DONE' && mln > statePlayer.resources.mln) || (text === 'SELL' && mln === 0)
   }

   return (
      <div className={classContainer}>
         <div className={classBtnAction} onClick={handleClickActionBtn}>
            {text}
         </div>
         {text !== 'CANCEL' && <div className={classBtnActionMln}>{mln}</div>}
      </div>
   )
}

export default ModalBtnAction
