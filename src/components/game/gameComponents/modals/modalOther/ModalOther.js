/* Used to view card resources, tags, vp, actions and effects */

import { useState, useContext } from 'react'
import { ModalsContext } from '../../../Game'
import BtnClose from '../../buttons/BtnClose'
import Card from '../../Card'
import ModalOtherData from './modalOtherData/ModalOtherData'

const ModalOther = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const [cardSnap, setCardSnap] = useState(null)

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
            className={`modal-background ${modals.confirmation && 'display-none'}`}
            onClick={() => setModals({ ...modals, other: false })}
         >
            <div
               className="modal-standard-projects-box other center"
               onClick={(e) => e.stopPropagation()}
            >
               {/* HEADER */}
               <div className="header">
                  {modals.modalOther.header} {modals.modalOther.amount}
               </div>
               {/* CLOSE BUTTON */}
               <BtnClose
                  onCloseClick={() => setModals((prevModals) => ({ ...prevModals, other: false }))}
               />
               {/* DATA */}
               {modals.modalOther.data.length === 0 ? (
                  <div className="modal-other-box-no-data center">
                     {getTextWhenNoData(modals.modalOther.header)}
                  </div>
               ) : (
                  <ModalOtherData setCardSnap={setCardSnap} />
               )}
               {/* CARD SNAP FOR VP VIEW */}
               {cardSnap && (
                  <div className="card-container medium">
                     <Card card={cardSnap} />
                  </div>
               )}
            </div>
         </div>
      </>
   )
}

export default ModalOther
