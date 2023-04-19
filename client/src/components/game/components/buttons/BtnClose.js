import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { SoundContext } from '../../../../App'
import { useContext } from 'react'

const BtnClose = ({ onCloseClick }) => {
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="btn-close pointer"
         onClick={() => {
            sound.btnGeneralClick.play()
            onCloseClick()
         }}
      >
         <FontAwesomeIcon icon={faXmark} />
      </div>
   )
}

export default BtnClose
