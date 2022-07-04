import Button from '../Button'
import { PAGES } from '../../../data/pages'
import { useAuth } from '../../../contexts/AuthContext'

const Buttons = ({ setPage, qmAction, setLogoutConfirmation }) => {
   const { currentUser, logout } = useAuth()

   function handleLogout() {
      logout()
         .then(() => setLogoutConfirmation('You have successfully logged out!'))
         .catch((err) => console.log('Failed to logout'))
   }

   return (
      <div className="buttons center">
         {/* Quick Match */}
         <Button
            text="QUICK MATCH"
            action={() => {
               qmAction()
               setLogoutConfirmation('')
            }}
            path="quick-match"
         />
         {/* Statistics */}
         <Button
            text="STATS"
            action={() => {
               setPage(PAGES.STATS)
               setLogoutConfirmation('')
            }}
         />
         {/* Ranked */}
         <Button
            text="RANKED MATCH"
            action={() => {
               qmAction()
               setLogoutConfirmation('')
            }}
            path="ranked-match"
            forUser={true}
         />
         {/* Settings */}
         <Button
            text="SETTINGS"
            action={() => {
               setPage(PAGES.SETTINGS)
               setLogoutConfirmation('')
            }}
            forUser={true}
         />
         {/* Rules */}
         <Button
            text="RANK RULES"
            action={() => {
               setPage(PAGES.RULES)
               setLogoutConfirmation('')
            }}
         />
         {/* Credits */}
         <Button
            text="CREDITS"
            action={() => {
               setPage(PAGES.CREDITS)
               setLogoutConfirmation('')
            }}
         />
         {/* Login / Logout */}
         {currentUser ? (
            <Button text="LOGOUT" action={handleLogout} />
         ) : (
            <Button
               text="LOGIN"
               action={() => {
                  setPage(PAGES.LOGIN)
                  setLogoutConfirmation('')
               }}
            />
         )}
         <Button
            text="ACCOUNT"
            action={() => {
               setPage(PAGES.ACCOUNT)
               setLogoutConfirmation('')
            }}
            forUser={true}
         />
      </div>
   )
}

export default Buttons
