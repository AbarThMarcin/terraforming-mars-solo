import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../Game'
import { getResIcon, RESOURCES } from '../../../../../data/resources'

const ModalResourceData = ({ setCardSnap }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickResCard = (itemId) => {
      setModals((prevModals) => ({
         ...prevModals,
         modalResource: { ...prevModals.modalResource, cardId: itemId },
      }))
   }

   return (
      <div className="modal-other-data center">
         {modals.modalResource.data.map((item, idx) => (
            <div
               key={idx}
               className={`
                  modal-other-data-item
                  ${stateGame.phaseAddRemoveRes && 'pointer'}
                  ${modals.modalResource.cardId === item.id && 'selected'}
               `}
               onMouseOver={() => setCardSnap(item)}
               onMouseLeave={() => setCardSnap(null)}
               onClick={() => handleClickResCard(item.id)}
            >
               <div className="card-name">{item.name}</div>
               <div>
                  <span>
                     {item.units.microbe +
                        item.units.animal +
                        item.units.science +
                        item.units.fighter}{' '}
                  </span>
                  {modals.modalResource.resType === RESOURCES.MICROBE && (
                     <img src={getResIcon(RESOURCES.MICROBE)} className="img-res" alt="microbe" />
                  )}
                  {modals.modalResource.resType === RESOURCES.ANIMAL && (
                     <img src={getResIcon(RESOURCES.ANIMAL)} className="img-res" alt="animal" />
                  )}
                  {modals.modalResource.resType === RESOURCES.SCIENCE && (
                     <img src={getResIcon(RESOURCES.SCIENCE)} className="img-res" alt="science" />
                  )}
                  {modals.modalResource.resType === RESOURCES.FIGHTER && (
                     <img src={getResIcon(RESOURCES.FIGHTER)} className="img-res" alt="fighter" />
                  )}
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalResourceData
