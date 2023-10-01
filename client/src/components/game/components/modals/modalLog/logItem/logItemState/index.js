import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import LogItemStateProdRes from './logItemStateParts/LogItemStateProdRes'
import LogItemStateParams from './logItemStateParts/LogItemStateParams'
import LogItemStateCards from './logItemStateParts/LogItemStateCards'
import LogItemStateActionsEffects from './logItemStateParts/LogItemStateActionsEffects'
import LogItemStateResources from './logItemStateParts/LogItemStateResources'

const LogItemState = ({ type, state, setResizeBox }) => {
   const [expanded, setExpanded] = useState(false)

   return (
      <div className="state">
         <div
            className="state-title pointer"
            onClick={() => {
               setExpanded((prev) => !prev)
               setResizeBox((prev) => !prev)
            }}
         >
            <span>STATE {type}</span>
            <div className="arrows">
               <FontAwesomeIcon icon={expanded ? faAngleDown : faAngleLeft} />
            </div>
         </div>
         {expanded ? (
            <div className="state-details">
               <div>
                  <LogItemStateProdRes state={state} />
                  <LogItemStateParams state={state} />
               </div>
               <div>
                  <LogItemStateCards state={state} cardsType="CARDS PLAYED" />
                  <LogItemStateCards state={state} cardsType="CARDS IN HAND" />
               </div>
               <div>
                  <LogItemStateActionsEffects state={state} type="ACTIONS" />
                  <LogItemStateActionsEffects state={state} type="EFFECTS" />
               </div>
               <LogItemStateResources state={state} />
            </div>
         ) : (
            <></>
         )}
      </div>
   )
}

export default LogItemState
