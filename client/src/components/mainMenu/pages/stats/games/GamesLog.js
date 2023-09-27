import { useContext, useRef, useState } from 'react'
import LogItem from '../../../../game/components/modals/modalLog/logItem'
import LogCaption from '../../../../game/components/modals/modalLog/LogCaption'
import { DataContext } from '..'

const GamesLog = () => {
   const { game } = useContext(DataContext)
   const [menuClicked, setMenuClicked] = useState(false)
   const [expanded, setExpanded] = useState(null)
   const [itemsExpanded, setItemsExpanded] = useState(new Array(game.logItems.length).fill(false))
   const logBox = useRef(null)

   return (
      <div className="games center">
         <div className="modal-log in-stats" onClick={(e) => e.stopPropagation()}>
            <ul
               ref={logBox}
               className="box"
               onClick={(e) => {
                  e.stopPropagation()
                  setMenuClicked(false)
               }}
            >
               {game.logItems.map((item, idx) => (
                  <LogItem key={idx} id={idx} item={item} expanded={expanded} itemsExpanded={itemsExpanded} setItemsExpanded={setItemsExpanded} />
               ))}
               <div></div>
            </ul>
            <LogCaption expanded={expanded} setExpanded={setExpanded} menuClicked={menuClicked} setMenuClicked={setMenuClicked} />
         </div>
      </div>
   )
}

export default GamesLog
