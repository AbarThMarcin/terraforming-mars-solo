/* Used to show ONE card with selection */
import { useContext, useState } from 'react'
import { TAGS } from '../../../../data/tags'
import { hasTag } from '../../../../util/misc'
import { StateGameContext, ModalsContext } from '../../Game'
import BtnAction from '../buttons/BtnAction'
import BtnSelect from '../buttons/BtnSelect'
import Card from '../Card'

const ModalSelectCard = () => {
   const { stateGame } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [selected, setSelected] = useState(getInitSelected)
   const [toBuyMln, setToBuyMln] = useState(0)

   const btnActionConfirmPosition = {
      bottom: '-20%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

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
            <BtnSelect
               initBtnText={selected ? 'SELECTED' : 'SELECT'}
               handleClick={handleClickSelect}
               sourceCardId={modals.modalSelectCard.cardIdAction}
            />
            {/* CONFIRM BUTTON */}
            <BtnAction
               text="CONFIRM"
               onYesFunc={handleClickConfirmBtn}
               position={btnActionConfirmPosition}
            />
         </div>
      </div>
   )
}

export default ModalSelectCard
