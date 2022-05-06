import { useContext } from 'react'
import { ModalsContext } from '../../../../Game'
import { getResIcon, RESOURCES } from '../../../../../../data/resources'

const ModalOtherDataRes = ({ setCardSnap }) => {
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
               <div className="card-name">{item.name}</div>
               <div>
                  <span>
                     {item.units.microbe +
                        item.units.animal +
                        item.units.science +
                        item.units.fighter}{' '}
                  </span>
                  {item.units.microbe !== 0 && (
                     <img src={getResIcon(RESOURCES.MICROBE)} className="img-res" alt="microbe" />
                  )}
                  {item.units.animal !== 0 && (
                     <img src={getResIcon(RESOURCES.ANIMAL)} className="img-res" alt="animal" />
                  )}
                  {item.units.science !== 0 && (
                     <img src={getResIcon(RESOURCES.SCIENCE)} className="img-res" alt="science" />
                  )}
                  {item.units.fighter !== 0 && (
                     <img src={getResIcon(RESOURCES.FIGHTER)} className="img-res" alt="fighter" />
                  )}
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalOtherDataRes
