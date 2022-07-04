import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Button = ({ text, action, path, forUser }) => {
   const { currentUser } = useAuth()
   const disabled = forUser && !currentUser
   let navigate = useNavigate()

   const handleClickBtn = () => {
      if (disabled) return
      action()
      if (path) navigate(path)
   }

   return (
      <div
         className={`btn-main-menu pointer ${disabled ? 'disabled' : ''}`}
         onClick={handleClickBtn}
      >
         {text}
      </div>
   )
}

export default Button
