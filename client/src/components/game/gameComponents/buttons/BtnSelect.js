import { useState } from 'react'
// import { Howl } from 'howler'
// import selectBtn from '../../../../assets/audio/select-btn.wav'

const BtnSelect = ({ initBtnText, handleClick, sourceCardId, resources }) => {
   const [btnText, setBtnText] = useState(initBtnText)

   // const callSound = () => {
   //    const sound = new Howl({ src: selectBtn })
   //    return sound.play()
   // }

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
            handleClick()
            btnText === 'SELECT' ? setBtnText('SELECTED') : setBtnText('SELECT')
            // callSound()
         }}
      >
         {btnText}
      </div>
   )
}

export default BtnSelect
