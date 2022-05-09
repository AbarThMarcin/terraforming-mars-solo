/* Used to show confirmation window */

import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const ModalConfirmation = () => {
   const { modals } = useContext(ModalsContext)

   return (
      <div className="modal-confirmation-container center">
         <div className="modal-confirmation center">{modals.modalConf.text}</div>
         <div className="modal-confirmation-btns center">
            <button className="pointer" onClick={modals.modalConf.onYes}>
               YES
            </button>
            <button className="pointer" onClick={modals.modalConf.onNo}>
               NO
            </button>
         </div>
      </div>
   )
}

export default ModalConfirmation
