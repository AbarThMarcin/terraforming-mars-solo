import { useState, useRef } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { PAGES } from '../../../../data/pages'
import GoBack from '../../GoBack'

const ERROR_CODES = {
   WRONG_PASSWORD: 'auth/wrong-password',
   USER_NOT_FOUND: 'auth/user-not-found',
}

const ResetPassword = ({ setPage }) => {
   const emailRef = useRef()
   const { resetPassword } = useAuth()
   const [error, setError] = useState('')
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)

   function handleResetPassword(e) {
      e.preventDefault()

      setMessage('')
      setError('')
      setLoading(true)
      resetPassword(emailRef.current.value)
         .then((userCred) => {
            setLoading(false)
            setMessage('Check your inbox for further instructions')
         })
         .catch((err) => {
            setError(getResetPasswordErrorMessage(err.code))
            setLoading(false)
         })
   }

   function getResetPasswordErrorMessage(code) {
      switch (code) {
         case ERROR_CODES.WRONG_PASSWORD:
            return 'Incorrect password.'
         case ERROR_CODES.USER_NOT_FOUND:
            return 'Email does not exist.'
         default:
            return 'Failed to reset password. Try again later.'
      }
   }

   return (
      <div className="forgot-password center">
         <div className="form-header">RESET PASSWORD</div>
         {message && <div>{message}</div>}
         <form onSubmit={handleResetPassword}>
            <div className="email-container">
               <label htmlFor="email">EMAIL</label>
               <input type="email" name="email" id="email" ref={emailRef} required />
            </div>
            <button type="submit" disabled={loading}>
               RESET
            </button>
         </form>
         <div>
            {`ALREADY HAVE AN ACCOUNT?`} <span onClick={() => setPage(PAGES.LOGIN)}>LOGIN</span>
         </div>
         {error && <div>{error}</div>}
         <GoBack action={() => setPage(PAGES.LOGIN)} />
      </div>
   )
}

export default ResetPassword
