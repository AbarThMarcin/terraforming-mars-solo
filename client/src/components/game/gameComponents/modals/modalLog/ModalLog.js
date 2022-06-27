/* Used to show the log window at the right side */
import { useEffect, useRef } from 'react'
import LogItem from './LogItem'

const ModalLog = ({ logItems }) => {
   const botLogRef = useRef(null)

   useEffect(() => {
      botLogRef.current?.scrollIntoView({ block: 'end' })
   }, [])

   return (
      <div className="modal-log" onClick={(e) => e.stopPropagation()}>
         <div className="box" onClick={(e) => e.stopPropagation()}>
            {logItems.map((item, idx) => (
               <LogItem key={idx} item={item} />
            ))}
            <div ref={botLogRef} />
         </div>
      </div>
   )
}

export default ModalLog
