import { LOG_TYPES, getIconForLog } from '../../../../../../data/log'
import { CORP_NAMES } from '../../../../../../data/corpNames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import LogItemState from './logItemState'
import LogItemSteps from './LogItemSteps'

const LogItem = ({ id, item, expanded, itemsExpanded, setItemsExpanded, setResizeBox }) => {
   const logItemHeader = getMainData()

   function handleClickExpand() {
      if (expanded === true || expanded === false) return
      const itemsCopy = [...itemsExpanded]
      if (itemsExpanded[id]) {
         itemsCopy[id] = false
         setItemsExpanded(itemsCopy)
      } else {
         itemsCopy[id] = true
         setItemsExpanded(itemsCopy)
      }
   }

   function getMainData() {
      switch (item.type) {
         case LOG_TYPES.GENERATION:
            return { title: `GENERATION ${item.title}`, style: 'generation' }
         case LOG_TYPES.DRAFT:
            return { title: 'DRAFT', style: 'action' }
         case LOG_TYPES.FORCED_ACTION:
            return { title: `FORCED ACTION (${item.title})`, style: 'action' }
         case LOG_TYPES.IMMEDIATE_EFFECT:
            return { title: item.title, style: 'action' }
         case LOG_TYPES.CARD_ACTION:
            return { title: `${item.title} (ACTION)`, style: 'action' }
         case LOG_TYPES.CONVERT_PLANTS:
            return { title: 'PLANTS CONVERSION', style: 'action' }
         case LOG_TYPES.CONVERT_HEAT:
            return { title: 'HEAT CONVERSION', style: 'action' }
         case LOG_TYPES.SP_ACTION:
            return { title: `${item.title} (SP ACTION)`, style: 'action' }
         case LOG_TYPES.PASS:
            return { title: 'PASSED', style: 'action' }
         case LOG_TYPES.FINAL_CONVERT_PLANTS:
            return { title: 'FINAL PLANTS CONVERSION', style: 'action' }
         default:
            return
      }
   }

   function getArrowIcon() {
      if (expanded === true) {
         return <FontAwesomeIcon icon={faAngleDown} />
      } else if (expanded === false) {
         return <FontAwesomeIcon icon={faAngleLeft} />
      } else if (itemsExpanded[id]) {
         return <FontAwesomeIcon icon={faAngleDown} />
      } else {
         return <FontAwesomeIcon icon={faAngleLeft} />
      }
   }

   function hiddenStyle() {
      if (expanded === true) {
         return ''
      } else if (expanded === false) {
         return 'hidden'
      } else if (itemsExpanded[id]) {
         return ''
      } else {
         return 'hidden'
      }
   }

   function getDetails() {
      return (
         <div className={`log-details ${hiddenStyle()}`}>
            {/* STATE BEFORE */}
            {item.details?.stateBefore && <LogItemState type="BEFORE" state={item.details.stateBefore} setResizeBox={setResizeBox} />}
            {/* STEPS */}
            {(item.details?.steps || item.details?.stateAfter) && <LogItemSteps steps={item.details.steps} setResizeBox={setResizeBox} />}
            {/* STATE AFTER */}
            {item.details?.stateAfter && <LogItemState type="AFTER" state={item.details.stateAfter} setResizeBox={setResizeBox} />}
         </div>
      )
   }

   return (
      <li className={logItemHeader.style}>
         <div className={`title ${logItemHeader.style === 'action' && expanded === null ? 'pointer' : ''}`} onClick={handleClickExpand}>
            {item.type !== LOG_TYPES.GENERATION && item.type !== LOG_TYPES.PASS && item.titleIcon && (
               <div className={`icon ${item.title === CORP_NAMES.UNMI && 'icon-unmi'}`}>
                  <img className="full-size" src={getIconForLog(item.titleIcon)} alt="icon" />
               </div>
            )}
            <div className={`text ${!item.titleIcon ? 'without-icon' : ''}`}>
               <span
                  style={{
                     color: item.type === LOG_TYPES.DRAFT || item.type === LOG_TYPES.PASS ? 'RGB(140, 245, 231)' : '#fff',
                     fontWeight: item.type === LOG_TYPES.DRAFT || item.type === LOG_TYPES.PASS ? '600' : 'initial',
                  }}
               >
                  {logItemHeader.title}
               </span>
            </div>
            {logItemHeader.style === 'action' && expanded === null && <div className="arrows">{getArrowIcon()}</div>}
         </div>
         {logItemHeader.style === 'action' && (itemsExpanded[id] || expanded) && getDetails()}
      </li>
   )
}

export default LogItem
