import { useEffect, useRef, useState, useMemo, useContext } from 'react'
import { CARDS } from '../../../../../../data/cards'
import { ModalsContext } from '../../index'
import CardForStats from './CardForStats'
import { SoundContext } from '../../../../../../App'

const ModalSeeAllCards = () => {
   const { sound } = useContext(SoundContext)
   const refTable = useRef()
   const { modalCardsIds, modalCardsTitle, setShowModalCard, setModalCard } =
      useContext(ModalsContext)
   const [filterValue, setFilterValue] = useState('')
   const cards = useMemo(
      () => getCards(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   ) // Array of arrays with three elements: [card object, value, rank]

   useEffect(() => {
      const table = refTable.current
      if (hasScrollbar(table)) {
         table.classList.add('with-scrollbar')
      } else {
         table.classList.remove('with-scrollbar')
      }
   }, [filterValue])

   const hasScrollbar = (el) => {
      return el.scrollHeight > el.clientHeight
   }

   function filterFunc(cardRow) {
      if (filterValue === '') return true
      if (
         String(cardRow.card.id).includes(filterValue) ||
         cardRow.card.name.includes(filterValue.toUpperCase())
      )
         return true
      return false
   }

   function getCards() {
      const cardsWithValues = modalCardsIds.map((cardId) => {
         return {
            card: CARDS.find((card) => card.id === cardId[0]),
            value: cardId[1],
         }
      })
      const cardsWithValuesAndRank = cardsWithValues.map((item, id) => {
         if (id > 0) {
            const prevItem = cardsWithValues[id - 1]
            if (prevItem.value === item.value) {
               item.rank = prevItem.rank
            } else {
               item.rank = id + 1
            }
         } else {
            item.rank = 1
         }

         return item
      })
      return cardsWithValuesAndRank
   }

   return (
      <div className="see-all-cards-container center" onClick={(e) => e.stopPropagation()}>
         {/* Title Section */}
         <div className="title-container">
            <span>{modalCardsTitle}</span>
         </div>
         {/* Search Section */}
         <div className="search-container">
            <input
               type="text"
               className="filter filter-user"
               style={{ transform: 'translateY(15%)' }}
               onChange={(e) => setFilterValue(e.target.value)}
               placeholder="SEARCH CARD(S)"
            />
         </div>
         {/* Content Section */}
         <div className="content-container">
            {/* Headers */}
            <div className="headers">
               <div>
                  <span>RANK</span>
               </div>
               <div>
                  <span>CARD</span>
               </div>
               {modalCardsTitle === 'MOST PLAYED CARDS' && (
                  <div>
                     <span>PLAYED COUNT</span>
                  </div>
               )}
               {modalCardsTitle === 'MOST SEEN CARDS' && (
                  <div>
                     <span>SEEN COUNT</span>
                  </div>
               )}
               {modalCardsTitle === 'MOST PURCHASED CARDS' && (
                  <div>
                     <span>PURCHASED COUNT</span>
                  </div>
               )}
               {modalCardsTitle === 'MOST % PLAYED CARDS' && (
                  <div>
                     <span>% PLAYED</span>
                  </div>
               )}
            </div>
            {/* Table */}
            <div ref={refTable} className="table">
               {cards.filter(filterFunc).map(({ rank, card, value }, idx) => (
                  <div key={idx} className="card-row">
                     <div>
                        <span>{rank}.</span>
                     </div>
                     <div>
                        <div
                           className="card-container small"
                           style={{ transform: 'translate(0) scale(0.52)' }}
                           onClick={() => {
                              sound.btnCardsClick.play()
                              setModalCard(card)
                              setShowModalCard(true)
                           }}
                        >
                           <CardForStats card={card} />
                        </div>
                     </div>
                     <div>
                        <span>
                           {value}
                           {modalCardsTitle === 'MOST % PLAYED CARDS' && '%'}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default ModalSeeAllCards
