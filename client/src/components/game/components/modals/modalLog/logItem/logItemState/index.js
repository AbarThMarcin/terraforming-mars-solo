import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import LogItemStateProdRes from './logItemStateParts/LogItemStateProdRes'
import LogItemStateParams from './logItemStateParts/LogItemStateParams'
import LogItemStateCards from './logItemStateParts/LogItemStateCards'
import LogItemStateActionsEffects from './logItemStateParts/LogItemStateActionsEffects'
import LogItemStateResources from './logItemStateParts/LogItemStateResources'

const LogItemState = ({ type, state }) => {
   const [expanded, setExpanded] = useState(false)
   const refDetails = useRef()

   function handleClickUpdate() {
      const el = refDetails.current
      if (expanded) {
         el.style.height = '0px'
         el.style.marginBottom = '0px'
         setExpanded(false)
      } else {
         el.style.height = el.scrollHeight + 'px'
         el.style.marginBottom = 'calc(var(--default-size) * 0.2)'
         setExpanded(true)
      }
   }

   return (
      <div className="state">
         <div className="state-title pointer" onClick={handleClickUpdate}>
            <span>STATE {type}</span>
            <div className="arrows">
               <FontAwesomeIcon icon={expanded ? faAngleDown : faAngleLeft} />
            </div>
         </div>
         <div ref={refDetails} className="state-details">
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
      </div>
   )
}

export default LogItemState
