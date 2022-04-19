import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../../Game'

const ModalDraftDoneBtn = ({ buyCost, textDoneConfirmation, onYesFunc }) => {
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
            className={`modal-draft-done-btn ${buyCost > statePlayer.resources.mln && 'disabled'}`}
            onClick={handleClickDoneBtn}
         >
            DONE
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

export default ModalDraftDoneBtn
