/* Used to show the settings sub-menu window */
import { useContext, useState } from 'react'
import { SPEED } from '../../../../data/settings'
import { StateGameContext } from '../../Game'

const ModalSettings = ({ setAnimationSpeed, showTotVP, setShowTotVP }) => {
   const { ANIMATION_SPEED } = useContext(StateGameContext)
   const [speedId, setSpeedId] = useState(getAnimationId())

   function getAnimationId() {
      switch (ANIMATION_SPEED) {
         case SPEED.SLOW:
            return 1
         case SPEED.NORMAL:
            return 2
         case SPEED.FAST:
            return 3
         case SPEED.VERY_FAST:
            return 4
         default:
            break
      }
   }

   const handleClickLeftArrow_speed = () => {
      let id = speedId - 1
      if (id < 1) id = 4
      setSpeedId(id)
      setAnimationSpeed(id)
   }
   const handleClickRightArrow_speed = () => {
      let id = speedId + 1
      if (id > 4) id = 1
      setSpeedId(id)
      setAnimationSpeed(id)
   }

   return (
      <div className="modal-settings">
         <div className="settings">
            <span>ANIMATION SPEED</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={handleClickLeftArrow_speed}></div>
               {speedId === 1 && <span>SLOW</span>}
               {speedId === 2 && <span>NORMAL</span>}
               {speedId === 3 && <span>FAST</span>}
               {speedId === 4 && <span>VERY FAST</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={handleClickRightArrow_speed}
               ></div>
            </div>
         </div>
         <div className="settings">
            <span>SHOW TOTAL POINTS</span>
            <div className="item">
               <div
                  className="arrow arrow-left pointer"
                  onClick={() => setShowTotVP((prev) => !prev)}
               ></div>
               {showTotVP && <span>YES</span>}
               {!showTotVP && <span>NO</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={() => setShowTotVP((prev) => !prev)}
               ></div>
            </div>
         </div>
      </div>
   )
}

export default ModalSettings
