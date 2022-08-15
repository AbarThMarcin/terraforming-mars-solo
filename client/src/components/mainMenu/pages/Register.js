import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../../api/apiUser'
import BtnGoBack from '../BtnGoBack'
import spinner from '../../../assets/other/spinner.gif'

const Register = ({ setUser }) => {
   const navigate = useNavigate()
   const nameRef = useRef()
   const emailRef = useRef()
   const passwordRef = useRef()
   const passwordConfRef = useRef()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)

   useEffect(() => {
      const userInfo = localStorage.getItem('user')
      if (userInfo) {
         setUser(JSON.parse(userInfo))
         navigate('/')
      }
   }, [setUser, navigate])

   const handleRegister = async (e) => {
      e.preventDefault()

      if (loading) return

      // Passwords do not match
      if (passwordRef.current.value !== passwordConfRef.current.value)
         return setError('Passwords do not match')

      try {
         setError(null)
         setLoading(true)

         const { data } = await register(
            nameRef.current.value,
            emailRef.current.value,
            passwordRef.current.value
         )

         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
         navigate('/')

         setLoading(false)
      } catch (error) {
         setError('REGISTER FAILED. TRY AGAIN')
         setLoading(false)
      }
   }

   return (
      <div className="login-register center">
         <div className="window-header">REGISTER</div>
         <form onSubmit={handleRegister}>
            <div className="container">
               <label htmlFor="name">PLAYER NAME</label>
               <input
                  type="text"
                  id="name"
                  ref={nameRef}
                  required
               />
            </div>
            <div className="container">
               <label htmlFor="email">EMAIL</label>
               <input
                  type="email"
                  id="email"
                  ref={emailRef}
                  required
               />
            </div>
            <div className="container">
               <label htmlFor="password">PASSWORD</label>
               <input type="password" id="password" ref={passwordRef} required />
            </div>
            <div className="container">
               <label htmlFor="password-conf">PASSWORD CONFIRMATION</label>
               <input
                  type="password"
                  id="password-conf"
                  ref={passwordConfRef}
                  required
               />
            </div>
            <button className={`pointer ${loading && 'disabled'}`} type="submit">
               {/* Loading Spinner */}
               {loading ? (
                  <div className="spinner">
                     <img className="full-size" src={spinner} alt="loading_spinner" />
                  </div>
               ) : (
                  <span>REGISTER</span>
               )}
            </button>
         </form>
         <div className="text">
            {`ALREADY HAVE AN ACCOUNT?`}{' '}
            <span
               className="pointer"
               onClick={() => {
                  if (loading) return
                  navigate('/login')
               }}
            >
               LOGIN
            </span>
         </div>
         {error && <div className="main-menu-error">{error}</div>}
         <BtnGoBack />
      </div>
   )
}

export default Register
