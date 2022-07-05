import { useRef } from 'react'
import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Login = ({ setPage }) => {
   const emailRef = useRef()
   const passwordRef = useRef()

   function handleLogin(e) {
      
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
            <button type="submit">
               LOGIN
            </button>
         </form>
         <div onClick={() => setPage(PAGES.RESET_PASSWORD)}>FORGOT PASSWORD?</div>
         <div>
            {`DON'T HAVE AN ACCOUNT?`} <span onClick={() => setPage(PAGES.REGISTER)}>REGISTER</span>
         </div>
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Login
