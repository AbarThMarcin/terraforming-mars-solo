import { useNavigate } from 'react-router-dom'

const Button = ({ text, path, disabled, action }) => {
   let navigate = useNavigate()

   const handleClickBtn = () => {
      if (disabled) return
      if (action) action()
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
