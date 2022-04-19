import { useContext } from 'react'
import { StatePlayerContext } from '../../../Game'

const ModalOtherVP = ({ setCardSnapForVP }) => {
   const { statePlayer } = useContext(StatePlayerContext)

   return (
      <div className="full-size">
         {statePlayer.vp.map((card, idx) => (
            <div
               key={idx}
               className="modal-other-container modal-other-container-vp"
               onMouseOver={() => setCardSnapForVP(card)}
               onMouseLeave={() => setCardSnapForVP(null)}
            >
               <div className="modal-other-vp-text">
                  {card.vp} {`${card.vp > 1 ? 'VPs' : 'VP'}`}
               </div>
               <div className="modal-other-vp-icon">icon</div>
            </div>
         ))}
      </div>
   )
}

export default ModalOtherVP
