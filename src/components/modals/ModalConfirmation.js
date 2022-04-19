import { useContext } from "react"
import { ModalsContext } from "../../Game"

const ModalConfirmation = () => {
   const { modals } = useContext(ModalsContext)
   
   return (
      <div className="modal-confirmation-container center">
         <div className="modal-confirmation center">{modals.modalConfData.text}</div>
         <div className="modal-confirmation-btns center">
            <button onClick={modals.modalConfData.onYes}>YES</button>
            <button onClick={modals.modalConfData.onNo}>NO</button>
         </div>
      </div>
   )
}

export default ModalConfirmation
