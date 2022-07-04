import { useState, useRef } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { PAGES } from '../../../../data/pages'
import GoBack from '../../GoBack'

const ERROR_CODES = {
   WRONG_PASSWORD: 'auth/wrong-password',
   USER_NOT_FOUND: 'auth/user-not-found',
}

const Login = ({ setPage }) => {
   const emailRef = useRef()
   const passwordRef = useRef()
   const { login } = useAuth()
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   function handleLogin(e) {
      e.preventDefault()

      setError('')
      setLoading(true)
      login(emailRef.current.value, passwordRef.current.value)
         .then((userCred) => setPage(PAGES.BUTTONS))
         .catch((err) => {
            setError(getLoginErrorMessage(err.code))
            setLoading(false)
         })
   }

   function getLoginErrorMessage(code) {
      switch (code) {
         case ERROR_CODES.WRONG_PASSWORD:
            return 'Incorrect password.'
         case ERROR_CODES.USER_NOT_FOUND:
            return 'Email does not exist.'
         default:
            return 'Failed to login. Try again later.'
      }
   }

   return (
      <div className="login center">
         <div className="form-header">LOGIN</div>
         <form onSubmit={handleLogin}>
            <div className="email-container">
               <label htmlFor="email">EMAIL</label>
               <input type="email" name="email" id="email" ref={emailRef} required />
            </div>
            <div className="password-container">
               <label htmlFor="password">PASSWORD</label>
               <input type="password" name="password" id="password" ref={passwordRef} required />
            </div>
            <button type="submit" disabled={loading}>
               LOGIN
            </button>
         </form>
         <div onClick={() => setPage(PAGES.RESET_PASSWORD)}>FORGOT PASSWORD?</div>
         <div>
            {`DON'T HAVE AN ACCOUNT?`} <span onClick={() => setPage(PAGES.REGISTER)}>REGISTER</span>
         </div>
         {error && <div>{error}</div>}
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Login
