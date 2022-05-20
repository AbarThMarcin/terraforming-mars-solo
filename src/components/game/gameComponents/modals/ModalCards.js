/* Used to view cards in hand or cards played */
import { useState, useContext } from 'react'
import { ModalsContext } from '../../Game'
import Arrows from './modalsComponents/Arrows'
import Card from '../Card'
import { getPosition } from '../../../../util/misc'

const ModalCards = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const [page, setPage] = useState(1)

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const handleClickCard = (card) => {
      if (modals.modalCardsType === 'Cards In Hand') {
         setModals({ ...modals, modalCard: card, cardWithAction: true })
      } else if (modals.modalCardsType === 'Cards Played') {
         setModals({ ...modals, modalCard: card, cardViewOnly: true })
      }
   }

   return (
      <div
         className={`modal-background ${modals.cardWithAction && 'display-none'}`}
         onClick={() => setModals({ ...modals, cards: false })}
      >
         {/* ARROWS */}
         {modals.modalCards.length > 10 && (
            <Arrows
               page={page}
               setPage={setPage}
               pages={Math.ceil(modals.modalCards.length / 10)}
            />
         )}
         {/* CARDS */}
         <div className="modal-cards center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-cards-box full-size" style={{ left: getBoxPosition() }}>
               {modals.modalCards.length === 0 ? (
                  <div className="modal-cards-no-cards center">NO CARDS PLAYED</div>
               ) : (
                  modals.modalCards.map((card, idx) => (
                     <div
                        key={idx}
                        className="card-container"
                        style={getPosition(modals.modalCards.length, idx)}
                        onClick={() => handleClickCard(card)}
                     >
                        <Card card={card} />
                     </div>
                  ))
               )}
            </div>
         </div>
         {/* HEADER */}
         <div className="modal-cards-header">{modals.modalCardsType.toUpperCase()}</div>
      </div>
   )
}

export default ModalCards
