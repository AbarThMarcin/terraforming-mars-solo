import { useContext } from 'react'
import { ModalsContext } from '../../../Game'
import BtnSort from '../../buttons/BtnSort'

const SortBtns = () => {
   const { modals } = useContext(ModalsContext)
   return (
      <div className="modal-cards-sort-btns">
         <BtnSort id={1} text="COST" />
         <BtnSort id={2} text="CARD TYPE" />
         <BtnSort id={3} text="TAGS" />
         <BtnSort id={4} text="CHRONOLOGICAL" />
         {modals.modalCardsType === 'Cards In Hand' && <BtnSort id={5} text="PLAYABILITY" />}
      </div>
   )
}

export default SortBtns
