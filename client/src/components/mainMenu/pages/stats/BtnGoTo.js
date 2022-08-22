import { useContext } from 'react'
import { SoundContext } from '../../../../App'

const BtnGoTo = ({ text, action, styles }) => {
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="btn-goto pointer"
         style={styles}
         onClick={() => {
            sound.btnGeneralClick.play()
            action()
         }}
      >
         <span>{text}</span>
      </div>
   )
}

export default BtnGoTo
