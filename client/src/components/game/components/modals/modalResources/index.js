/* Modal component used to choose target card that can contain any resource (animal, microbe, fighter) after playing a card that lets you put any amount of particular resource (for example: IMPORTED HYDROGEN 19) */
/* So it's not a modal where you choose between plant, microbe or animal (for mentioned example) but to choose target card to place chosen animal or microbe (unless you choose plant, then this modal does not appear) */
import { useState } from 'react'
import Card from '../../card/Card'
import ModalResourceData from './ModalResourceData'
import BtnAction from '../../buttons/BtnAction'
import { useSubactionResources } from '../../../../../hooks/useSubactionResources'

const ModalResource = () => {
   const [cardSnap, setCardSnap] = useState(null)

   const btnActionConfirmPosition = {
      bottom: '-1%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   const { handleClickConfirmBtn } = useSubactionResources()

   return (
      <>
         {/* HEADER */}
         <div className="modal-resource-header">SELECT ANY RESOURCE</div>
         {/* BOX */}
         <div className="modal-standard-projects-box other center" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="header">CARD RESOURCES</div>
            {/* DATA */}
            <ModalResourceData setCardSnap={setCardSnap} />
            {/* CARD SNAP FOR VP VIEW */}
            {cardSnap && (
               <div className="card-container medium">
                  <Card card={cardSnap} />
               </div>
            )}
            {/* CONFIRM BUTTON */}
            <BtnAction text="CONFIRM" onYesFunc={handleClickConfirmBtn} position={btnActionConfirmPosition} />
         </div>
      </>
   )
}

export default ModalResource
