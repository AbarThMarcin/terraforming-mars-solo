/* Used to view one played card only */

import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import Card from '../Card'

const ModalCardViewOnly = () => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <>
         <div
            className={`modal-background ${modals.confirmation && 'display-none'}`}
            onClick={() => setModals({ ...modals, cardViewOnly: false, modalCard: null })}
         >
            <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
               <Card card={modals.modalCard} isBig={true} />
            </div>
         </div>
      </>
   )
}

export default ModalCardViewOnly
