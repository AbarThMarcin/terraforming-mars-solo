import { useState, useRef } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { PAGES } from '../../../../data/pages'
import GoBack from '../../GoBack'

const ERROR_CODES = {
   WEAK_PASSWORD: 'auth/weak-password',
   EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
}

const Register = ({ setPage }) => {
   const emailRef = useRef()
   const passwordRef = useRef()
   const passwordConfRef = useRef()
   const { register, updProfile } = useAuth()
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   function handleRegister(e) {
      e.preventDefault()

      if (passwordRef.current.value !== passwordConfRef.current.value) {
         return setError('Passwords do not match.')
      }

      setError('')
      setLoading(true)
      register(emailRef.current.value, passwordRef.current.value)
         .then((userCred) => {
            // updProfile(userCred, "Marcin")
            setPage(PAGES.BUTTONS)
         })
         .catch((err) => {
            setError(getRegisterErrorMessage(err.code))
            setLoading(false)
         })
   }

   function getRegisterErrorMessage(code) {
      switch (code) {
         case ERROR_CODES.WEAK_PASSWORD:
            return 'Too weak password.'
         case ERROR_CODES.EMAIL_ALREADY_IN_USE:
            return 'Email already in use.'
         default:
            return 'Failed to register. Try again later.'
      }
   }

   return (
      <div className="register center">
         <div className="form-header">REGISTER</div>
         <form onSubmit={handleRegister}>
            <div className="email-container">
               <label htmlFor="email">EMAIL</label>
               <input type="email" name="email" id="email" ref={emailRef} required />
            </div>
            <div className="password-container">
               <label htmlFor="password">PASSWORD</label>
               <input type="password" name="password" id="password" ref={passwordRef} required />
            </div>
            <div className="password-conf-container">
               <label htmlFor="password-conf">PASSWORD CONFIRMATION</label>
               <input
                  type="password"
                  name="password-conf"
                  id="password-conf"
                  ref={passwordConfRef}
                  required
               />
            </div>
            <button type="submit" disabled={loading}>
               REGISTER
            </button>
         </form>
         <div>
            {`ALREADY HAVE AN ACCOUNT?`} <span onClick={() => setPage(PAGES.LOGIN)}>LOGIN</span>
         </div>
         {error && <div>{error}</div>}
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Register
