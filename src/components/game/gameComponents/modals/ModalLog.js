/* Used to show the log window at the right side */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const ModalLog = () => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div className="full-size" onClick={() => setModals({ ...modals, log: false })}>
         <div className="modal-log" onClick={(e) => e.stopPropagation()}></div>
      </div>
   )
}

export default ModalLog
