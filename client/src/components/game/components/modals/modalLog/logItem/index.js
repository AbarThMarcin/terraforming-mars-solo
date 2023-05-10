import { LOG_TYPES } from '../../../../../../data/log/log'
import { CORP_NAMES } from '../../../../../../data/corpNames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import LogItemState from './logItemState'
import LogItemSteps from './LogItemSteps'

const LogItem = ({ id, item, expanded, itemsExpanded, setItemsExpanded }) => {
   const itemDetails = getMainData()

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
            return { text: `GENERATION ${item.data.text}`, styles: 'generation' }
         case LOG_TYPES.DRAFT:
            return { text: 'DRAFT', styles: 'action' }
         case LOG_TYPES.FORCED_ACTION:
            return { text: `FORCED ACTION (${item.data.text})`, styles: 'action' }
         case LOG_TYPES.IMMEDIATE_EFFECT:
            return { text: item.data.text, styles: 'action' }
         case LOG_TYPES.CARD_ACTION:
            return { text: `${item.data.text} (ACTION)`, styles: 'action' }
         case LOG_TYPES.CONVERT_PLANTS:
            return { text: 'PLANTS CONVERSION', styles: 'action' }
         case LOG_TYPES.CONVERT_HEAT:
            return { text: 'HEAT CONVERSION', styles: 'action' }
         case LOG_TYPES.SP_ACTION:
            return { text: `${item.data.text} (SP ACTION)`, styles: 'action' }
         case LOG_TYPES.PASS:
            return { text: 'PASSED', styles: 'action' }
         case LOG_TYPES.FINAL_CONVERT_PLANTS:
            return { text: 'FINAL PLANTS CONVERSION', styles: 'action' }
         default:
            break
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
            {item.details?.stateBefore && <LogItemState type="BEFORE" state={item.details.stateBefore}  />}
            {/* STEPS */}
            {(item.details?.steps || item.details?.stateAfter) && <LogItemSteps item={item} />}
            {/* STATE AFTER */}
            {item.details?.stateAfter && <LogItemState type="AFTER" state={item.details.stateAfter} />}
         </div>
      )
   }

   return (
      <li className={itemDetails.styles}>
         <div className={`title ${itemDetails.styles === 'action' && expanded === null ? 'pointer' : ''}`} onClick={handleClickExpand}>
            {item.type !== LOG_TYPES.GENERATION && item.type !== LOG_TYPES.PASS && item.data.icon && (
               <div className={`icon ${item.data.text === CORP_NAMES.UNMI && 'icon-unmi'}`}>
                  <img className="full-size" src={item.data.icon} alt="icon" />
               </div>
            )}
            <div className={`text ${!item.data?.icon ? 'without-icon' : ''}`}>
               <span>{itemDetails.text}</span>
            </div>
            {itemDetails.styles === 'action' && expanded === null && <div className="arrows">{getArrowIcon()}</div>}
         </div>
         {itemDetails.styles === 'action' && getDetails()}
      </li>
   )
}

export default LogItem
