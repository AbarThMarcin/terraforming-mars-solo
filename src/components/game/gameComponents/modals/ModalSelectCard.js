import { useContext, useState } from 'react'
import { TAGS } from '../../../../data/tags'
import { hasTag } from '../../../../util/misc'
import { StateGameContext, ModalsContext } from '../../Game'
import Card from '../Card'

const ModalSelectCard = () => {
   const { stateGame } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [selected, setSelected] = useState(getInitSelected)
   const [toBuyMln, setToBuyMln] = useState(0)

   const handleClickConfirmBtn = () => {
      setModals((prevModals) => ({
         ...prevModals,
         modalSelectCard: {
            cardIdAction: null,
            card: null,
            func: null,
         },
         selectCard: false,
      }))
      if (selected) modals.modalSelectCard.func()
   }

   const handleClickSelect = () => {
      if (modals.modalSelectCard.cardIdAction === 5) return
      setSelected((prev) => !prev)
      if (toBuyMln === 0) {
         setToBuyMln(3)
      } else {
         setToBuyMln(0)
      }
   }

   function getInitSelected() {
      if (modals.modalSelectCard.cardIdAction === 5) {
         return hasTag(modals.modalSelectCard.card, TAGS.MICROBE)
      } else {
         return false
      }
   }

   return (
      <div
         className={`
            modal-background
            ${(modals.confirmation || stateGame.phaseViewGameState) && 'display-none'}
         `}
      >
         <div className="card-container big center">
            {/* CARD */}
            <Card card={modals.modalSelectCard.card} isBig={true} />
            {/* CARD BUTTON */}
            <div
               className={`
                     ${modals.modalSelectCard.cardIdAction !== 5 && 'pointer'}
                     ${selected ? 'btn-selected' : 'btn-select'}
                  `}
               onClick={handleClickSelect}
            >
               {selected ? 'SELECTED' : 'SELECT'}
            </div>
            {modals.modalSelectCard.cardIdAction !== 5 && (
               <div className="card-to-buy-mln">{toBuyMln}</div>
            )}
            {/* CONFIRM BUTTON */}
            <div className="modal-select-card-confirm-btn pointer" onClick={handleClickConfirmBtn}>
               CONFIRM
            </div>
         </div>
      </div>
   )
}

export default ModalSelectCard
