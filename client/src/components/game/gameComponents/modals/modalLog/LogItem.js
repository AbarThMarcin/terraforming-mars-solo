import { LOG_TYPES } from '../../../../../data/log'
import { CORP_NAMES } from '../../../../../data/corpNames'

const LogItem = ({ item }) => {
   const itemDetails = getDetails()

   function getDetails() {
      switch (item.type) {
         case LOG_TYPES.LOG:
            return { text: 'LOG', styles: 'log' }
         case LOG_TYPES.GENERATION:
            return { text: `GENERATION ${item.data.text}`, styles: 'generation' }
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
         default:
            break
      }
   }

   return (
      <div className={itemDetails.styles}>
         {item.type !== LOG_TYPES.LOG &&
            item.type !== LOG_TYPES.GENERATION &&
            item.type !== LOG_TYPES.PASS && item.data.icon && (
               <div className={`icon ${item.data.text === CORP_NAMES.UNMI && 'icon-unmi'}`}>
                  <img className="full-size" src={item.data.icon} alt="icon" />
               </div>
            )}
         <div className="text">
            <span>{itemDetails.text}</span>
         </div>
      </div>
   )
}

export default LogItem
