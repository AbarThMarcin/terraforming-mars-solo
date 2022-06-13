import { useState } from 'react'

const BtnSelect = ({ initBtnText, handleClick, sourceCardId }) => {
   const [btnText, setBtnText] = useState(initBtnText)

   return (
      <div
         className={`pointer ${btnText === 'SELECTED' ? 'btn-selected' : 'btn-select'}`}
         onClick={(e) => {
            e.stopPropagation()
            if (sourceCardId === 5) return // If search for life action, don't allow to select / unselect card
            handleClick()
            btnText === 'SELECT' ? setBtnText('SELECTED') : setBtnText('SELECT')
         }}
      >
         {btnText}
      </div>
   )
}

export default BtnSelect
