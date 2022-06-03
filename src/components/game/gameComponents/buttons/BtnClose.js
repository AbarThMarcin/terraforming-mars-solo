import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const BtnClose = ({ onCloseClick }) => {
   return (
      <div className="btn-close pointer" onClick={onCloseClick}>
         <FontAwesomeIcon icon={faXmark} />
      </div>
   )
}

export default BtnClose
