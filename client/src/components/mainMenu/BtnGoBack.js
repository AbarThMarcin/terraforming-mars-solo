import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

const BtnGoBack = () => {
   const navigate = useNavigate()

   const handleClickGoBack = () => {
      navigate('/')
   }

   return (
      <div className="go-back pointer" onClick={handleClickGoBack}>
         <FontAwesomeIcon icon={faAngleLeft} />
      </div>
   )
}

export default BtnGoBack
