/* Used to show the log window at the right side */
import { useContext } from 'react'
import { ModalsContext } from '../../../Game'
import LogItem from './LogItem'

const ModalLog = ({ logItems }) => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div className="full-size" onClick={() => setModals({ ...modals, log: false })}>
         <div className="modal-log" onClick={(e) => e.stopPropagation()}>
            {logItems.map((item, idx) => (
               <LogItem key={idx} item={item} />
            ))}
         </div>
      </div>
   )
}

export default ModalLog
