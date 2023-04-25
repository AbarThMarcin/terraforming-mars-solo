/* Used to view card only */
import { useContext } from 'react'
import CardForStats from './CardForStats'
import { ModalsContext } from '../../index'

const ModalCard = () => {
   const { modalCard } = useContext(ModalsContext)

   return (
      <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
         <CardForStats card={modalCard} isBig={true} />
      </div>
   )
}

export default ModalCard
