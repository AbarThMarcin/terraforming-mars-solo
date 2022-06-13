/* Used to show the log window at the right side */
import LogItem from './LogItem'

const ModalLog = ({ logItems }) => {
   return (
      <div className="modal-log" onClick={(e) => e.stopPropagation()}>
         <div className="box" onClick={(e) => e.stopPropagation()}>
            {logItems.map((item, idx) => (
               <LogItem key={idx} item={item} />
            ))}
         </div>
      </div>
   )
}

export default ModalLog
