import { useState } from 'react'
import { PAGES } from '../../data/pages'
import Buttons from './pages/Buttons'
import Credits from './pages/Credits'
import Login from './pages/login-components/Login'
import Register from './pages/login-components/Register'
import Rules from './pages/Rules'
import Settings from './pages/Settings'
import Stats from './pages/Stats'
import Account from './pages/Account'
import ResetPassword from './pages/login-components/ResetPassword'
import { useAuth } from '../../contexts/AuthContext'

const MainMenu = ({ qmAction }) => {
   const [page, setPage] = useState(PAGES.BUTTONS)
   const [logoutConfirmation, setLogoutConfirmation] = useState('')
   const { currentUser } = useAuth()

   return (
      <div className="main-menu">
         {/* Background, Header & Message */}
         <div className="bg"></div>
         <div className="header">
            TERRAFORMING MARS <span>{currentUser?.displayName}</span>
         </div>
         {logoutConfirmation && <div className='logout-msg'>{logoutConfirmation}</div>}
         {/* Pages */}
         {page === PAGES.BUTTONS && (
            <Buttons
               setPage={setPage}
               qmAction={qmAction}
               setLogoutConfirmation={setLogoutConfirmation}
            />
         )}
         {page === PAGES.STATS && <Stats setPage={setPage} />}
         {page === PAGES.SETTINGS && <Settings setPage={setPage} />}
         {page === PAGES.RULES && <Rules setPage={setPage} />}
         {page === PAGES.CREDITS && <Credits setPage={setPage} />}
         {page === PAGES.LOGIN && <Login setPage={setPage} />}
         {page === PAGES.REGISTER && <Register setPage={setPage} />}
         {page === PAGES.RESET_PASSWORD && <ResetPassword setPage={setPage} />}
         {page === PAGES.ACCOUNT && <Account setPage={setPage} />}
      </div>
   )
}

export default MainMenu
