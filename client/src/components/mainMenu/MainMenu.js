import { Outlet, useNavigate } from 'react-router-dom'
import MainMenuConfirmation from './MainMenuConfirmation'

const MainMenu = () => {
   const navigate = useNavigate()

   return (
      <div className="main-menu">
         {/* Background, Header & Message */}
         <div className="bg"></div>
         <div className="header pointer" onClick={() => navigate('/')}>
            TERRAFORMING MARS <span>SOLO</span>
         </div>
         {/* Current Page */}
         <Outlet />
      </div>
   )
}

export default MainMenu
