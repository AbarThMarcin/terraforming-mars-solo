import { CORP_NAMES } from '../../../../data/corpNames'
import { LOG_TYPES, getIconForLog } from '../../../../data/log'

const ReplayLogListItem = ({ logItem, idx, clickLogItemReplay, currentLogItem }) => {
   const logItemHeader = getMainData()

   function getIcon(item) {
      const iconForLog = getIconForLog(item.titleIcon)
      return iconForLog ? <img className="full-size" src={iconForLog} alt="icon" /> : <></>
   }

   function getMainData() {
      switch (logItem.type) {
         case LOG_TYPES.GENERATION:
            return { title: `GENERATION ${logItem.title}`, style: 'generation' }
         case LOG_TYPES.DRAFT:
            return { title: 'DRAFT', style: 'action' }
         case LOG_TYPES.FORCED_ACTION:
            return { title: `FORCED ACTION (${logItem.title})`, style: 'action' }
         case LOG_TYPES.IMMEDIATE_EFFECT:
            return { title: logItem.title, style: 'action' }
         case LOG_TYPES.CARD_ACTION:
            return { title: `${logItem.title} (ACTION)`, style: 'action' }
         case LOG_TYPES.CONVERT_PLANTS:
            return { title: 'PLANTS CONVERSION', style: 'action' }
         case LOG_TYPES.CONVERT_HEAT:
            return { title: 'HEAT CONVERSION', style: 'action' }
         case LOG_TYPES.SP_ACTION:
            return { title: `${logItem.title} (SP ACTION)`, style: 'action' }
         case LOG_TYPES.PASS:
            return { title: 'PASSED', style: 'action' }
         case LOG_TYPES.FINAL_CONVERT_PLANTS:
            return { title: 'FINAL PLANTS CONVERSION', style: 'action' }
         default:
            return
      }
   }

   return (
      <li className={`${logItemHeader.style}${idx === currentLogItem ? ' active': ''}`} onClick={() => clickLogItemReplay(idx, logItem)}>
         {/* Icon */}
         <div className={`icon ${logItem.title === CORP_NAMES.UNMI && 'icon-unmi'}`}>{getIcon(logItem)}</div>
         {/* Title */}
         <div className={`text${logItem.type === LOG_TYPES.DRAFT || logItem.type === LOG_TYPES.PASS ? ' draft-pass' : ''}`}>{logItemHeader.title}</div>
      </li>
   )
}

export default ReplayLogListItem
