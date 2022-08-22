/* Used to view cards in hand or cards played */
import { useState, useContext } from 'react'
import { SoundContext } from '../../../../App'
import { ModalsContext } from '../../Game'
import Arrows from './modalsComponents/Arrows'
import Card from '../Card'
import { getPosition } from '../../../../utils/misc'
import SortBtns from './modalsComponents/SortBtns'

const ModalCards = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const [page, setPage] = useState(1)

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const handleClickCard = (card) => {
      if (modals.modalCardsType === 'Cards In Hand') {
         setModals((prev) => ({ ...prev, modalCard: card, cardWithAction: true }))
      } else if (modals.modalCardsType === 'Cards Played') {
         setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
      }
   }

   return (
      <>
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
            <div className="box full-size" style={{ left: getBoxPosition() }}>
               {modals.modalCards.length === 0 ? (
                  <div className="no-cards-text center">NO CARDS PLAYED</div>
               ) : (
                  modals.modalCards.map((card, idx) => (
                     <div
                        key={idx}
                        className="card-container small"
                        style={getPosition(modals.modalCards.length, idx)}
                        onClick={() => {
                           sound.btnCardsClick.play()
                           handleClickCard(card)
                        }}
                     >
                        <Card card={card} />
                     </div>
                  ))
               )}
            </div>
         </div>
         {/* HEADER */}
         <div className="modal-cards-header" onClick={(e) => e.stopPropagation()}>
            {modals.modalCardsType.toUpperCase()}
         </div>
         {/* SORT BUTTONS */}
         <SortBtns />
      </>
   )
}

export default ModalCards
