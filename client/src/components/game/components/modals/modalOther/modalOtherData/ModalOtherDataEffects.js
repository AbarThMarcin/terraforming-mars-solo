import { useMemo } from 'react'
import { useContext } from 'react'
import { getEffectIcon } from '../../../../../../data/effects/effectIcons'
import { sorted } from '../../../../../../utils/misc'
import { ModalsContext } from '../../../../../game'

const ModalOtherDataEffects = ({ setCardSnap }) => {
   const { modals } = useContext(ModalsContext)
   const effects = useMemo(
      () => getEffects(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   )

   function getEffects() {
      if (typeof modals.modalOther.data[0] === 'string') {
         return [modals.modalOther.data[0], ...sorted(modals.modalOther.data.slice(1), '4a-played')]
      } else {
         return sorted(modals.modalOther.data.slice(0), '4a-played')
      }
   }

   const handleMouseOverItem = (item) => {
      if (typeof item !== 'string') setCardSnap(item)
   }

   return (
      <div className="modal-other-data center">
         {effects.map((item, idx) => (
            <div key={idx} className="modal-other-data-item" onMouseOver={() => handleMouseOverItem(item)} onMouseLeave={() => setCardSnap(null)}>
               <div className="effect">
                  <img src={typeof item === 'string' ? getEffectIcon(item) : getEffectIcon(item.effect)} alt={typeof item !== 'string' ? item.effect : 'corp_effect'} />
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalOtherDataEffects
