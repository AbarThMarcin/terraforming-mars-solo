import { useState } from 'react'

const CardBtn = ({ initBtnText, handleClick, disabled }) => {
   const [btnText, setBtnText] = useState(initBtnText)
   const [clicked, setClicked] = useState(btnText === 'SELECT' ? false : true)

   return (
      <div
         className={`
            ${clicked ? 'btn-selected' : 'btn-select'}
            ${btnText === 'USE' ? 'btn-action' : ''}
            ${disabled ? 'disabled' : 'pointer'}
         `}
         onClick={(e) => {
            e.stopPropagation()
            handleClick()
            if (btnText === 'SELECT') setBtnText('SELECTED')
            if (btnText === 'SELECTED') setBtnText('SELECT')
            if (btnText === 'SELECT' || btnText === 'SELECTED') setClicked(!clicked)
         }}
      >
         {btnText}
      </div>
   )
}

export default CardBtn
