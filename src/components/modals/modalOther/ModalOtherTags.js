import { useContext } from 'react'
import { StatePlayerContext } from '../../../Game'

const ModalOtherTags = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const building = countTags(statePlayer.tags, 'building')
   const space = countTags(statePlayer.tags, 'space')
   const power = countTags(statePlayer.tags, 'power')
   const science = countTags(statePlayer.tags, 'science')
   const jovian = countTags(statePlayer.tags, 'jovian')
   const earth = countTags(statePlayer.tags, 'earth')
   const plant = countTags(statePlayer.tags, 'plant')
   const microbe = countTags(statePlayer.tags, 'microbe')
   const animal = countTags(statePlayer.tags, 'animal')
   const city = countTags(statePlayer.tags, 'city')
   const event = countTags(statePlayer.tags, 'event')

   function countTags(array, value) {
      var n = 0
      for (let i = 0; i < array.length; i++) {
         if (array[i] === value) n++
      }
      return n
   }

   return (
      <div className="modal-other-tags full-size">
         {building !== 0 && (
            <div className="modal-other-container">
               <span>BUILDING</span>
               <div>{building} icon</div>
            </div>
         )}
         {space !== 0 && (
            <div className="modal-other-container">
               <span>SPACE</span>
               <div>{space} icon</div>
            </div>
         )}
         {power !== 0 && (
            <div className="modal-other-container">
               <span>POWER</span>
               <div>{power} icon</div>
            </div>
         )}
         {science !== 0 && (
            <div className="modal-other-container">
               <span>SCIENCE</span>
               <div>{science} icon</div>
            </div>
         )}
         {jovian !== 0 && (
            <div className="modal-other-container">
               <span>JOVIAN</span>
               <div>{jovian} icon</div>
            </div>
         )}
         {earth !== 0 && (
            <div className="modal-other-container">
               <span>EARTH</span>
               <div>{earth} icon</div>
            </div>
         )}
         {plant !== 0 && (
            <div className="modal-other-container">
               <span>PLANT</span>
               <div>{plant} icon</div>
            </div>
         )}
         {microbe !== 0 && (
            <div className="modal-other-container">
               <span>MICROBE</span>
               <div>{microbe} icon</div>
            </div>
         )}
         {animal !== 0 && (
            <div className="modal-other-container">
               <span>ANIMAL</span>
               <div>{animal} icon</div>
            </div>
         )}
         {city !== 0 && (
            <div className="modal-other-container">
               <span>CITY</span>
               <div>{city} icon</div>
            </div>
         )}
         {event !== 0 && (
            <div className="modal-other-container">
               <span>EVENT</span>
               <div>{event} icon</div>
            </div>
         )}
      </div>
   )
}

export default ModalOtherTags
