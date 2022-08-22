import { useContext } from 'react'
import { ModalsContext } from '../../../../Game'
import { getVpIcon } from '../../../../../../data/vp'

const ModalOtherDataVP = ({ setCardSnap }) => {
   const { modals } = useContext(ModalsContext)

   return (
      <div className="modal-other-data center">
         {modals.modalOther.data.map((item, idx) => (
            <div
               key={idx}
               className="modal-other-data-item"
               onMouseOver={() => setCardSnap(item)}
               onMouseLeave={() => setCardSnap(null)}
            >
               <span>
                  {item.vp} {`${item.vp > 1 ? 'VPs' : 'VP'}`} {' - '} {item.name}
               </span>
               <img src={getVpIcon(item.iconNames.vp)} className="img-vp" alt={item.iconNames.vp} />
            </div>
         ))}
      </div>
   )
}

export default ModalOtherDataVP
