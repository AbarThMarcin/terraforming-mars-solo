import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../Game'
import { getResIcon, RESOURCES } from '../../../../../data/resources'

const ModalResourceData = ({ setCardSnap }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)

   function getResource(item) {
      let res
      if (item.units.microbe) res = RESOURCES.MICROBE
      if (item.units.animal) res = RESOURCES.ANIMAL
      if (item.units.science) res = RESOURCES.SCIENCE
      if (item.units.fighter) res = RESOURCES.FIGHTER
      return modals.modalResource.resType === null ? res : modals.modalResource.resType
   }

   const handleClickResCard = (itemId) => {
      setModals((prev) => ({
         ...prev,
         modalResource: { ...prev.modalResource, cardId: itemId },
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
               <div>{item.name}</div>
               <div>
                  <span>
                     {item.units.microbe +
                        item.units.animal +
                        item.units.science +
                        item.units.fighter}{' '}
                  </span>
                  {getResource(item) === RESOURCES.MICROBE && (
                     <img src={getResIcon(RESOURCES.MICROBE)} className="img-res" alt="microbe" />
                  )}
                  {getResource(item) === RESOURCES.ANIMAL && (
                     <img src={getResIcon(RESOURCES.ANIMAL)} className="img-res" alt="animal" />
                  )}
                  {getResource(item) === RESOURCES.SCIENCE && (
                     <img src={getResIcon(RESOURCES.SCIENCE)} className="img-res" alt="science" />
                  )}
                  {getResource(item) === RESOURCES.FIGHTER && (
                     <img src={getResIcon(RESOURCES.FIGHTER)} className="img-res" alt="fighter" />
                  )}
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalResourceData
