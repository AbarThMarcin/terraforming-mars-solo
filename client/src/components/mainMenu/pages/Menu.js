import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import spinner from '../../../assets/other/spinner.gif'
import MainMenuConfirmation from '../MainMenuConfirmation'
import { deleteActiveGameData, getActiveGameData } from '../../../api/apiActiveGame'
import { createEndedGameData } from '../../../api/apiEndedGame'

const QM_text = 'Do you want to resume previous quick match?'
const RM_new_text = 'You are about to create a new ranked match. Are you sure you want to continue?'
const RM_resume_text = 'Do you want to resume previous ranked match or forfeit and start a new one?'

const tipText_RM = 'Log in to play ranked match'
const tipText_settings = 'Log in to manage your settings'
const tipText_account = 'Log in to manage your account'

const Menu = ({ user, setData, logout }) => {
   let navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [modalConfirmation, setModalConfirmation] = useState(false)
   const [text, setText] = useState('')
   const [btnText1, setBtnText1] = useState('')
   const [btnText2, setBtnText2] = useState('')
   const [func1, setFunc1] = useState(null)
   const [func2, setFunc2] = useState(null)

   // Quick Match
   async function handleClickQuickMatch() {
      if (user?.quickMatchOn) {
         setConfirmationDetails(QM_text, 'RESUME', 'START NEW', QM_resume, QM_startNew)
      } else {
         setLoading(true)
         await setData(false)
         setLoading(false)
         navigate('/match')
      }
   }
   async function QM_resume() {
      setModalConfirmation(false)
      setLoading(true)
      await setData(false)
      setLoading(false)
      navigate('/match')
   }
   async function QM_startNew() {
      setModalConfirmation(false)
      setLoading(true)
      await deleteActiveGameData(user.token, false)
      await setData(false, true)
      setLoading(false)
      navigate('/match')
   }

   // Ranked Match
   async function handleClickRankedMatch() {
      if (user.rankedMatchOn) {
         setConfirmationDetails(
            RM_resume_text,
            'RESUME',
            'START NEW',
            RM_resume,
            RM_forfeitAndStartNew
         )
      } else {
         setConfirmationDetails(RM_new_text, 'YES', 'NO', RM_startNew, cancel)
      }
   }
   async function RM_resume() {
      setModalConfirmation(false)
      setLoading(true)
      await setData(true)
      setLoading(false)
      navigate('/match')
   }
   async function RM_forfeitAndStartNew() {
      setModalConfirmation(false)
      setLoading(true)
      const gameData = await getActiveGameData(user.token, true)
      const endedGameData = {
         corporation: gameData.statePlayer.corporation,
         cards: {
            played: gameData.statePlayer.cardsPlayed,
            seen: gameData.statePlayer.cardsSeen,
            purchased: gameData.statePlayer.cardsPurchased,
         },
         forfeited: true,
      }
      await createEndedGameData(user.token, endedGameData)
      await deleteActiveGameData(user.token, true)
      await setData(true, true)
      setLoading(false)
      navigate('/match')
   }
   async function RM_startNew() {
      setModalConfirmation(false)
      setLoading(true)
      await setData(true)
      setLoading(false)
      navigate('/match')
   }

   function cancel() {
      setModalConfirmation(false)
   }

   function setConfirmationDetails(text, btnText1, btnText2, func1, func2) {
      setText(text)
      setBtnText1(btnText1)
      setBtnText2(btnText2)
      setFunc1(() => func1)
      setFunc2(() => func2)
      setModalConfirmation(true)
   }

   return (
      <>
         <div className="menu">
            {/* Loading Spinner */}
            {loading && (
               <div className="spinner">
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            )}
            {/* Quick Match */}
            <Button text="QUICK MATCH" action={handleClickQuickMatch} disabled={loading} />
            {/* Statistics */}
            <Button text="STATS" path="stats" disabled={loading} />
            {/* Ranked */}
            <Button
               text="RANKED MATCH"
               action={handleClickRankedMatch}
               disabled={user == null || loading}
               tipText={tipText_RM}
            />
            {/* Settings */}
            <Button
               text="SETTINGS"
               path="settings"
               disabled={user == null || loading}
               tipText={tipText_settings}
            />
            {/* Rules */}
            <Button text="RANK RULES" path="rules" disabled={loading} />
            {/* Account */}
            <Button
               text="ACCOUNT"
               path="account"
               disabled={user == null || loading}
               tipText={tipText_account}
            />
            {/* Login */}
            {user ? (
               <Button text="LOGOUT" path="/" action={logout} disabled={loading} />
            ) : (
               <Button text="LOGIN" path="login" disabled={loading} />
            )}
         </div>
         {/* Confirmation Modal */}
         {modalConfirmation && (
            <MainMenuConfirmation
               text={text}
               btnText1={btnText1}
               btnText2={btnText2}
               func1={func1}
               func2={func2}
               cancel={cancel}
            />
         )}
      </>
   )
}

export default Menu
