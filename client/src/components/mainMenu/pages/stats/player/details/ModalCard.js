/* Used to view card only */
import { useContext } from 'react'
import { ModalsContext } from '../../Stats'
import CardForStats from './CardForStats'

const ModalCard = () => {
   const { modalCard } = useContext(ModalsContext)

   return (
      <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
         <CardForStats card={modalCard} isBig={true} />
      </div>
   )
}

export default ModalCard
