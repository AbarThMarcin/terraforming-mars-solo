import { useContext } from 'react'
import { StateGameContext } from '../../Game'

const BtnSort = ({ id, text }) => {
   const { btnClickedId, setBtnClickedId } = useContext(StateGameContext)

   const handleClickSortBtn = (e) => {
      e.stopPropagation()
      setBtnClickedId(id)
   }

   return (
      <div
         className={`btn-sort pointer ${id === btnClickedId ? 'selected' : 'not-selected'}`}
         onClick={handleClickSortBtn}
      >
         {text}
      </div>
   )
}

export default BtnSort
