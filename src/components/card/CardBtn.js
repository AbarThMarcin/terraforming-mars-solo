import { useState } from 'react'

const CardBtn = ({ btnText, handleClick, disabled }) => {
   const [clicked, setClicked] = useState(btnText === 'SELECT' ? false : true)
   return (
      <div
         className={`card-btn ${(clicked || btnText === 'USE') && 'selected-or-use'} ${
            disabled && 'disabled'
         }`}
         onClick={(e) => {
            e.stopPropagation()
            handleClick()
            if (btnText === 'SELECT') setClicked(!clicked)
         }}
      >
         {btnText}
      </div>
   )
}

export default CardBtn
