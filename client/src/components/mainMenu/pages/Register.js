import { useRef } from 'react'
import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Register = ({ setPage }) => {
   const emailRef = useRef()
   const passwordRef = useRef()
   const passwordConfRef = useRef()

   const handleRegister = () => {}

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
            <button type="submit">REGISTER</button>
         </form>
         <div>
            {`ALREADY HAVE AN ACCOUNT?`} <span onClick={() => setPage(PAGES.LOGIN)}>LOGIN</span>
         </div>
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Register
