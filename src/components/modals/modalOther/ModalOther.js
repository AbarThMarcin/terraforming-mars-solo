import { useState, useContext } from 'react'
import { ModalsContext } from '../../../Game'
import Card from '../../card/Card'
import ModalOtherData from './ModalOtherData'

const ModalOther = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnapForVP, setCardSnapForVP] = useState(null)

   const getTextWhenNoData = (header) => {
      switch (header) {
         case 'CARD RESOURCES':
            return 'No card with resource'
         case 'TAGS':
            return 'No tags yet'
         case 'VP':
            return 'No VP yet'
         case 'ACTIONS':
            return 'No action available'
         case 'EFFECTS':
            return 'No effects available'
         default:
            return 'No data'
      }
   }

   return (
      <>
         <div
            className="modal-other-sp-container full-size"
            onClick={() => setModals({ ...modals, other: false })}
         >
            <div className="modal-other-sp otherbg center" onClick={(e) => e.stopPropagation()}>
               {/* HEADER */}
               <div className="modal-other-sp-header">
                  {modals.modalOther.header} {modals.modalOther.amount}
               </div>
               {/* CLOSE BUTTON */}
               <div
                  className="modal-other-sp-close-btn"
                  onClick={() => setModals({ ...modals, other: false })}
               >
                  X
               </div>
               {/* DATA */}
               {modals.modalOther.data.length === 0 ? (
                  <div className="modal-other-sp-no-data">
                     {getTextWhenNoData(modals.modalOther.header)}
                  </div>
               ) : (
                  <ModalOtherData setCardSnapForVP={setCardSnapForVP} />
               )}
               {/* CARD SNAP FOR VP VIEW */}
               {cardSnapForVP && (
                  <div className="modal-other-vp-card">
                     <Card card={cardSnapForVP} />
                  </div>
               )}
            </div>
         </div>
      </>
   )
}

export default ModalOther
