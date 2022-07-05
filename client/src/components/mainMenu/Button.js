import { useNavigate } from 'react-router-dom'

const Button = ({ text, action, path, forUser }) => {
   const disabled = forUser
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
