import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import spinner from '../../../assets/other/spinner.gif'
import MainMenuConfirmation from '../MainMenuConfirmation'
import { deleteActiveGameData } from '../../../api/apiActiveGame'

const Menu = ({ user, setData, logout }) => {
   let navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [modalConfirmation, setModalConfirmation] = useState(false)

   async function setDataAndStartQuickMatch() {
      if (user?.quickMatchOn) {
         setModalConfirmation(true)
      } else {
         setLoading(true)
         await setData(false)
         setLoading(false)
         navigate('/match')
      }
   }

   async function setDataAndStartRankedMatch() {
      setLoading(true)
      await setData(true)
      setLoading(false)
      navigate('/match')
   }

   async function onYes() {
      setModalConfirmation(false)
      setLoading(true)
      await setData(false)
      setLoading(false)
      navigate('/match')
   }
   async function onNo() {
      setModalConfirmation(false)
      setLoading(true)
      await deleteActiveGameData(user.token, false)
      await setData(false, true)
      setLoading(false)
      navigate('/match')
   }
   function onCancel() {
      setModalConfirmation(false)
   }

   return (
      <>
         <div className="menu center">
            {/* Loading Spinner */}
            {loading && (
               <div className="spinner">
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            )}
            {/* Quick Match */}
            <Button text="QUICK MATCH" action={setDataAndStartQuickMatch} disabled={loading} />
            {/* Statistics */}
            <Button text="STATS" path="stats" disabled={loading} />
            {/* Ranked */}
            <Button
               text="RANKED MATCH"
               action={setDataAndStartRankedMatch}
               disabled={user == null || loading}
            />
            {/* Settings */}
            <Button text="SETTINGS" path="settings" disabled={user == null || loading} />
            {/* Rules */}
            <Button text="RANK RULES" path="rules" disabled={loading} />
            {/* Credits */}
            <Button text="CREDITS" path="credits" disabled={loading} />
            {/* Login */}
            {user ? (
               <Button text="LOGOUT" path="/" action={logout} disabled={loading} />
            ) : (
               <Button text="LOGIN" path="login" disabled={loading} />
            )}
            {/* Account */}
            <Button text="ACCOUNT" path="account" disabled={user == null || loading} />
         </div>
         {/* Confirmation Modal */}
         {modalConfirmation && (
            <MainMenuConfirmation
               setModalConfirmation={setModalConfirmation}
               onYes={onYes}
               onNo={onNo}
               onCancel={onCancel}
            />
         )}
      </>
   )
}

export default Menu
