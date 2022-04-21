import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../../Game'

const ModalBtnAction = ({ text, buyCost, textDoneConfirmation, onYesFunc }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickDoneBtn = () => {
      if (buyCost <= statePlayer.resources.mln)
         setModals({
            ...modals,
            modalConfData: {
               text: textDoneConfirmation,
               onYes: onYesFunc,
               onNo: () => setModals({ ...modals, confirmation: false }),
            },
            confirmation: true,
         })
   }

   return (
      <div className="modal-draft-done-btn-container">
         <div
            className={`modal-draft-done-btn pointer ${
               buyCost > statePlayer.resources.mln && 'disabled'
            }`}
            onClick={handleClickDoneBtn}
         >
            {text}
         </div>
         <div
            className={`modal-draft-done-btn-mln ${
               buyCost > statePlayer.resources.mln && 'disabled'
            }`}
         >
            {buyCost}
         </div>
      </div>
   )
}

export default ModalBtnAction
