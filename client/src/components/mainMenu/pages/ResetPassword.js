import { useRef } from 'react'
import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const ResetPassword = ({ setPage }) => {
   const emailRef = useRef()

   function handleResetPassword(e) {}

   return (
      <div className="forgot-password center">
         <div className="form-header">RESET PASSWORD</div>
         <form onSubmit={handleResetPassword}>
            <div className="email-container">
               <label htmlFor="email">EMAIL</label>
               <input type="email" name="email" id="email" ref={emailRef} required />
            </div>
            <button type="submit">RESET</button>
         </form>
         <div>
            {`ALREADY HAVE AN ACCOUNT?`} <span onClick={() => setPage(PAGES.LOGIN)}>LOGIN</span>
         </div>
         <BtnGoBack action={() => setPage(PAGES.LOGIN)} />
      </div>
   )
}

export default ResetPassword
