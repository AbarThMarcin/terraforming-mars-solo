import { useContext } from 'react'
import { getTagIcon, TAGS } from '../../../../../../data/tags'
import { ModalsContext } from '../../../../../game'
import { hasTag } from '../../../../../../utils/cards'

const ModalOtherDataTags = () => {
   const { modals } = useContext(ModalsContext)
   const building = countTags(modals.modalOther.data, TAGS.BUILDING)
   const space = countTags(modals.modalOther.data, TAGS.SPACE)
   const power = countTags(modals.modalOther.data, TAGS.POWER)
   const science = countTags(modals.modalOther.data, TAGS.SCIENCE)
   const jovian = countTags(modals.modalOther.data, TAGS.JOVIAN)
   const earth = countTags(modals.modalOther.data, TAGS.EARTH)
   const plant = countTags(modals.modalOther.data, TAGS.PLANT)
   const microbe = countTags(modals.modalOther.data, TAGS.MICROBE)
   const animal = countTags(modals.modalOther.data, TAGS.ANIMAL)
   const city = countTags(modals.modalOther.data, TAGS.CITY)
   const event = countTags(modals.modalOther.data, TAGS.EVENT)

   function countTags(items, targetTag) {
      let tagsCount = 0
      items.forEach((item) => {
         if (typeof item === 'string') {
            if (item === targetTag) tagsCount++
         } else {
            if (hasTag(item, TAGS.EVENT)) {
               if (targetTag === TAGS.EVENT) tagsCount++
            } else {
               item.tags.forEach((tag) => {
                  if (targetTag === tag) tagsCount++
               })
            }
         }
      })
      return tagsCount
   }

   return (
      <div className="modal-other-data modal-other-data-tags center">
         {building !== 0 && (
            <div className="modal-other-data-item">
               <span>BUILDING</span>
               <div>
                  <span>{building}</span>
                  <img src={getTagIcon(TAGS.BUILDING)} className="img-tag" alt="building_tag" />
               </div>
            </div>
         )}
         {space !== 0 && (
            <div className="modal-other-data-item">
               <span>SPACE</span>
               <div>
                  <span>{space}</span>
                  <img src={getTagIcon(TAGS.SPACE)} className="img-tag" alt="space_tag" />
               </div>
            </div>
         )}
         {power !== 0 && (
            <div className="modal-other-data-item">
               <span>POWER</span>
               <div>
                  <span>{power}</span>
                  <img src={getTagIcon(TAGS.POWER)} className="img-tag" alt="power_tag" />
               </div>
            </div>
         )}
         {science !== 0 && (
            <div className="modal-other-data-item">
               <span>SCIENCE</span>
               <div>
                  <span>{science}</span>
                  <img src={getTagIcon(TAGS.SCIENCE)} className="img-tag" alt="science_tag" />
               </div>
            </div>
         )}
         {jovian !== 0 && (
            <div className="modal-other-data-item">
               <span>JOVIAN</span>
               <div>
                  <span>{jovian}</span>
                  <img src={getTagIcon(TAGS.JOVIAN)} className="img-tag" alt="jovian_tag" />
               </div>
            </div>
         )}
         {earth !== 0 && (
            <div className="modal-other-data-item">
               <span>EARTH</span>
               <div>
                  <span>{earth}</span>
                  <img src={getTagIcon(TAGS.EARTH)} className="img-tag" alt="earth_tag" />
               </div>
            </div>
         )}
         {plant !== 0 && (
            <div className="modal-other-data-item">
               <span>PLANT</span>
               <div>
                  <span>{plant}</span>
                  <img src={getTagIcon(TAGS.PLANT)} className="img-tag" alt="plant_tag" />
               </div>
            </div>
         )}
         {microbe !== 0 && (
            <div className="modal-other-data-item">
               <span>MICROBE</span>
               <div>
                  <span>{microbe}</span>
                  <img src={getTagIcon(TAGS.MICROBE)} className="img-tag" alt="microbe_tag" />
               </div>
            </div>
         )}
         {animal !== 0 && (
            <div className="modal-other-data-item">
               <span>ANIMAL</span>
               <div>
                  <span>{animal}</span>
                  <img src={getTagIcon(TAGS.ANIMAL)} className="img-tag" alt="animal_tag" />
               </div>
            </div>
         )}
         {city !== 0 && (
            <div className="modal-other-data-item">
               <span>CITY</span>
               <div>
                  <span>{city}</span>
                  <img src={getTagIcon(TAGS.CITY)} className="img-tag" alt="city_tag" />
               </div>
            </div>
         )}
         {event !== 0 && (
            <div className="modal-other-data-item">
               <span>EVENT</span>
               <div>
                  <span>{event}</span>
                  <img src={getTagIcon(TAGS.EVENT)} className="img-tag" alt="event_tag" />
               </div>
            </div>
         )}
      </div>
   )
}

export default ModalOtherDataTags
