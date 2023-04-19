import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BtnGoBack from '../../BtnGoBack'
import spinner from '../../../../assets/other/spinner.gif'
import { updateUser } from '../../../../api/user'

const disabled = {
   backgroundColor: 'rgb(20, 20, 20)',
   color: 'rgb(170, 170, 170)',
}

const Account = ({ user, setUser }) => {
   const navigate = useNavigate()
   const newPasswordRef = useRef()
   const newPasswordConfRef = useRef()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [success, setSuccess] = useState(null)

   useEffect(() => {
      const userInfo = localStorage.getItem('user')
      if (!userInfo) navigate('/')
   }, [setUser, navigate])

   const handleUpdateUser = async (e) => {
      e.preventDefault()

      if (loading) return

      // Passwords do not match
      if (newPasswordRef.current.value !== newPasswordConfRef.current.value)
         return setError('Passwords do not match')

      try {
         setError(null)
         setSuccess(null)
         setLoading(true)

         const newPassword = { password: newPasswordRef.current.value }

         const { data } = await updateUser(user.token, newPassword)
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)

         setSuccess('CHANGES SAVED SUCCESSFULLY!')
         setLoading(false)
      } catch (error) {
         setError('FAILED TO SAVE CHANGES')
         setLoading(false)
      }
   }

   return (
      <div className="login-register center">
         <div className="window-header">ACCOUNT</div>
         <form onSubmit={handleUpdateUser}>
            <div className="container">
               <label>PLAYER NAME</label>
               <input
                  style={disabled}
                  type="text"
                  value={user ? user.name : ''}
                  required
                  disabled
               />
            </div>
            <div className="container">
               <label>EMAIL</label>
               <input
                  style={disabled}
                  type="email"
                  value={user ? user.email : ''}
                  required
                  disabled
               />
            </div>
            <div className="container">
               <label htmlFor="new-password">NEW PASSWORD</label>
               <input type="password" id="new-password" ref={newPasswordRef} required />
            </div>
            <div className="container">
               <label htmlFor="new-password-conf">NEW PASSWORD CONFIRMATION</label>
               <input type="password" id="new-password-conf" ref={newPasswordConfRef} required />
            </div>
            <button className={`pointer ${loading && 'disabled'}`} type="submit">
               {/* Loading Spinner */}
               {loading ? (
                  <div className="spinner">
                     <img className="full-size" src={spinner} alt="loading_spinner" />
                  </div>
               ) : (
                  <span>APPLY CHANGES</span>
               )}
            </button>
         </form>
         {error && <div className="main-menu-error">{error}</div>}
         {success && <div className="main-menu-success">{success}</div>}
         <BtnGoBack />
      </div>
   )
}

export default Account
