/* Used to view one played card only */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import Card from '../Card'

const ModalCardViewOnly = () => {
   const { modals } = useContext(ModalsContext)

   return (
      <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
         <Card card={modals.modalCard} isBig={true} />
      </div>
   )
}

export default ModalCardViewOnly
