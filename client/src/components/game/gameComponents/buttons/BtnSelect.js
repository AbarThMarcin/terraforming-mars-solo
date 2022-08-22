import { useContext, useState } from 'react'
import { SoundContext } from '../../../../App'

const BtnSelect = ({ initBtnText, handleClick, sourceCardId, resources }) => {
   const [btnText, setBtnText] = useState(initBtnText)
   const { sound } = useContext(SoundContext)

   return (
      <div
         className={`pointer ${btnText === 'SELECTED' ? 'btn-selected' : 'btn-select'}`}
         onClick={(e) => {
            e.stopPropagation()
            // If search for life action, don't allow to select / unselect card
            if (sourceCardId === 5) return
            // If Inventors' Guild or Business Network and resources are less than 3,
            // don't allow to select / unselect card
            if (resources !== undefined) {
               if (resources < 3) return
            }
            sound.btnSelectClick.play()
            handleClick()
            btnText === 'SELECT' ? setBtnText('SELECTED') : setBtnText('SELECT')
         }}
      >
         {btnText}
      </div>
   )
}

export default BtnSelect
