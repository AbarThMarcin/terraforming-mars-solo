/* Used to view card resources, tags, vp, actions and effects */
import { useState, useContext } from 'react'
import { CORP_NAMES } from '../../../../../data/corpNames'
import { ModalsContext, StatePlayerContext } from '../../../../game'
import BtnClose from '../../buttons/BtnClose'
import Card from '../../card/Card'
import ModalOtherData from './modalOtherData'

const ModalOther = () => {
   const { statePlayer } = useContext(StatePlayerContext)
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
      <div
         className="modal-standard-projects-box other center"
         onClick={(e) => e.stopPropagation()}
      >
         {/* HEADER */}
         <div className="header">
            {modals.modalOther.header} {modals.modalOther.amount}
         </div>
         {/* CLOSE BUTTON */}
         <BtnClose onCloseClick={() => setModals((prev) => ({ ...prev, other: false }))} />
         {/* DATA */}
         {(modals.modalOther.data.length === 0 && modals.modalOther.header !== 'ACTIONS') ||
         (modals.modalOther.data.length === 0 &&
            modals.modalOther.header === 'ACTIONS' &&
            statePlayer.corporation.name !== CORP_NAMES.UNMI) ? (
            <div className="modal-other-box-no-data center">
               {getTextWhenNoData(modals.modalOther.header)}
            </div>
         ) : (
            <ModalOtherData setCardSnap={setCardSnap} />
         )}
         {/* CARD SNAP FOR VP VIEW */}
         {cardSnap && (
            <div className="card-container medium">
               <Card card={cardSnap} isBig={true} isSnap={true} />
            </div>
         )}
      </div>
   )
}

export default ModalOther
