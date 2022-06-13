/* Used to show the settings sub-menu window */
import { useState } from 'react'

const ModalSettings = ({ setAnimationSpeed }) => {
   const [speedId, setSpeedId] = useState(2)

   const handleClickLeftArrow = () => {
      let id = speedId - 1
      if (id < 1) id = 4
      setSpeedId(id)
      setAnimationSpeed(id)
   }
   const handleClickRightArrow = () => {
      let id = speedId + 1
      if (id > 4) id = 1
      setSpeedId(id)
      setAnimationSpeed(id)
   }

   return (
      <div className="modal-settings">
         <div className="settings">
            <span>ANIMATION SPEED</span>
            <div className="speed">
               <div className="arrow arrow-left pointer" onClick={handleClickLeftArrow}></div>
               {speedId === 1 && <span>SLOW</span>}
               {speedId === 2 && <span>NORMAL</span>}
               {speedId === 3 && <span>FAST</span>}
               {speedId === 4 && <span>VERY FAST</span>}
               <div className="arrow arrow-right pointer" onClick={handleClickRightArrow}></div>
            </div>
         </div>
      </div>
   )
}

export default ModalSettings
