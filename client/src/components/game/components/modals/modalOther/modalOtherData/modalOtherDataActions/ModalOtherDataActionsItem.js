import BtnAction from '../../../../buttons/BtnAction'
import { CORP_NAMES } from '../../../../../../../data/corpNames'
import { ACTION_ICONS, getActionIcon } from '../../../../../../../data/cardActions/actionIcons'
import { useActionCardAction } from '../../../../../../../hooks/useActionCardAction'

const ModalOtherDataActionsItem = ({ item, setCardSnap }) => {
   const isUnmi = item.name === CORP_NAMES.UNMI
   const { handleClickAction, getAvailability } = useActionCardAction()
   const isAvailable = getAvailability(item)

   const btnActionPosition = { right: '-3%', transform: 'scale(0.65)' }

   const handleMouseOverItem = (item) => {
      if (!isUnmi) setCardSnap(item)
   }

   return (
      <div className="modal-other-data-item" onMouseOver={() => handleMouseOverItem(item)} onMouseLeave={() => setCardSnap(null)}>
         {/* ICON */}
         <div className="action">
            <img
               style={{ opacity: isAvailable ? 1 : 0.5 }}
               src={isUnmi ? getActionIcon(ACTION_ICONS.ACTION_UNMI) : getActionIcon(item.iconNames.action)}
               alt={isUnmi ? 'UNMI_action' : item.iconNames.action}
            />
         </div>
         {/* CONFIRM BUTTON */}
         <BtnAction text="USE" onYesFunc={() => handleClickAction(item)} disabled={!isAvailable} position={btnActionPosition} />
      </div>
   )
}

export default ModalOtherDataActionsItem
