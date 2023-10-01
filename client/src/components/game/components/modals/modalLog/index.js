/* Used to show the log window at the right side */
import { useEffect, useRef, useState } from 'react'
import LogItem from './logItem'
import LogCaption from './LogCaption'

const ModalLog = ({ logItems, expanded, setExpanded, itemsExpanded, setItemsExpanded }) => {
   const botLogRef = useRef(null)
   const [menuClicked, setMenuClicked] = useState(false)
   const logBox = useRef(null)
   const [resizeBox, setResizeBox] = useState(false)

   useEffect(() => {
      botLogRef.current?.scrollIntoView({ block: 'end' })
   }, [])

   useEffect(() => {
      correctScrollBar(logBox)
   }, [itemsExpanded, expanded, resizeBox])

   const correctScrollBar = (logBox) => {
      if (logBox.current.scrollHeight > logBox.current.clientHeight) {
         logBox.current.classList.add('with-scrollbar')
      } else {
         logBox.current.classList.remove('with-scrollbar')
      }
   }

   return (
      <div className="modal-log" onClick={(e) => e.stopPropagation()}>
         <ul
            ref={logBox}
            className="box"
            onClick={(e) => {
               e.stopPropagation()
               setMenuClicked(false)
            }}
         >
            {logItems.map((item, idx) => (
               <LogItem key={idx} id={idx} item={item} expanded={expanded} itemsExpanded={itemsExpanded} setItemsExpanded={setItemsExpanded} setResizeBox={setResizeBox} />
            ))}
            <div ref={botLogRef} />
         </ul>
         <LogCaption expanded={expanded} setExpanded={setExpanded} menuClicked={menuClicked} setMenuClicked={setMenuClicked} />
      </div>
   )
}

export default ModalLog
