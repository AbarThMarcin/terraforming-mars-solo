import { useEffect, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BtnGoBack from '../../BtnGoBack'
import { login } from '../../../../api/user'
import spinner from '../../../../assets/other/spinner.gif'
import { SettingsContext, SoundContext } from '../../../../App'

const Login = ({ setUser }) => {
   const navigate = useNavigate()
   const { setSettings } = useContext(SettingsContext)
   const { music, sound } = useContext(SoundContext)
   const emailRef = useRef()
   const passwordRef = useRef()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)

   useEffect(() => {
      const userInfo = localStorage.getItem('user')
      if (userInfo) {
         setUser(JSON.parse(userInfo))
         navigate('/')
      }
   }, [setUser, navigate])

   async function handleLogin(e) {
      e.preventDefault()

      if (loading) return

      sound.btnGeneralClick.play()
      try {
         setError(null)
         setLoading(true)

         const { data } = await login(emailRef.current.value, passwordRef.current.value)

         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
         setSettings({
            speedId: data.settings.gameSpeed,
            showTotVP: data.settings.showTotalVP,
            sortId: [data.settings.handSortId, data.settings.playedSortId],
            musicVolume: data.settings.musicVolume,
            gameVolume: data.settings.gameVolume,
         })
         music.volume(data.settings.musicVolume)
         Object.keys(sound).forEach((key) => sound[key].volume(data.settings.gameVolume))
         navigate('/')

         setLoading(false)
      } catch (error) {
         setError('INVALID EMAIL ADDRESS AND/OR PASSWORD')
         setLoading(false)
      }
   }

   return (
      <div className="login-register center">
         <div className="window-header">LOGIN</div>
         <form onSubmit={handleLogin}>
            <div className="container">
               <label htmlFor="email">EMAIL</label>
               <input type="email" id="email" ref={emailRef} required />
            </div>
            <div className="container">
               <label htmlFor="password">PASSWORD</label>
               <input type="password" id="password" ref={passwordRef} required />
            </div>
            <button className={`pointer ${loading && 'disabled'}`} type="submit">
               {/* Loading Spinner */}
               {loading ? (
                  <div className="spinner">
                     <img className="full-size" src={spinner} alt="loading_spinner" />
                  </div>
               ) : (
                  <span>LOGIN</span>
               )}
            </button>
         </form>
         <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 'calc(var(--default-size) * 1)' }}>
            <div id="signInWithGoogle"></div>
         </div>
         <div className="text" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {`DON'T HAVE AN ACCOUNT?`}{' '}
            <span
               className="pointer"
               onClick={() => {
                  if (loading) return
                  navigate('/register')
               }}
            >
               &nbsp;REGISTER
            </span>
         </div>
         {error && <div className="main-menu-error">{error}</div>}
         <BtnGoBack />
      </div>
   )
}

export default Login
