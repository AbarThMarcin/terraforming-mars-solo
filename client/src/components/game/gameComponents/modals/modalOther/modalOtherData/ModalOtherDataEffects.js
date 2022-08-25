import { useContext } from 'react'
import { getEffectIcon } from '../../../../../../data/effects/effectIcons'
import { sorted } from '../../../../../../utils/misc'
import { ModalsContext } from '../../../../Game'

const ModalOtherDataEffects = ({ setCardSnap }) => {
   const { modals } = useContext(ModalsContext)

   const handleMouseOverItem = (item) => {
      if (typeof item !== 'string') setCardSnap(item)
   }

   return (
      <div className="modal-other-data center">
         {sorted(modals.modalOther.data, '4a-played').map((item, idx) => (
            <div
               key={idx}
               className="modal-other-data-item"
               onMouseOver={() => handleMouseOverItem(item)}
               onMouseLeave={() => setCardSnap(null)}
            >
               <div className="effect">
                  <img
                     src={
                        typeof item === 'string' ? getEffectIcon(item) : getEffectIcon(item.effect)
                     }
                     alt={typeof item !== 'string' ? item.effect : 'corp_effect'}
                  />
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalOtherDataEffects
