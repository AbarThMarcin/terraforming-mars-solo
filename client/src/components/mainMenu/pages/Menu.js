import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import spinner from '../../../assets/other/spinner.gif'
import ModalConfirmation from '../ModalConfirmation'
import { deleteActiveGameData, getActiveGameData } from '../../../api/apiActiveGame'
import { createEndedGameData } from '../../../api/apiEndedGame'
import { useContext } from 'react'
import { ModalConfirmationContext } from '../../../App'
import { updateUser } from '../../../api/apiUser'
import { useEffect } from 'react'
import ModalQMId from '../ModalQMId'

// Quick Match Text for Confirmation Window
const QM_text = 'Do you want to resume previous quick match?'
// Match With Id Texts for Confirmation Window
const QMId_text = 'Do you want to resume previous match with id?'
// Ranked Match Texts for Confirmation Window
const RM_new_text =
   'You are about to create a new ranked match. You have 24 hours to finish it. Are you sure you want to continue?'
const RM_new_text_with_expired = `Your active ranked match has been expired, and therefore treated as forfeited. You are about to create a new ranked match. You have 24 hours to finish it. Are you sure you want to continue?`
const RM_resume_text = 'Do you want to resume previous ranked match or forfeit and start a new one?'

const tipText_QMId = 'Log in to play match with id'
const tipText_RM = 'Log in to play ranked match'
const tipText_account = 'Log in to manage your account'

const Menu = ({ user, setUser, setData, logout, showLogoutMsg, setShowLogoutMsg }) => {
   let navigate = useNavigate()
   const {
      showModalConf,
      setShowModalConf,
      showModalQMId,
      setShowModalQMId,
      overwrite,
      setOverwrite,
   } = useContext(ModalConfirmationContext)
   const [loading, setLoading] = useState(false)
   const [text, setText] = useState('')
   const [btn1, setBtn1] = useState()
   const [btn2, setBtn2] = useState()

   useEffect(() => {
      setShowLogoutMsg(false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   function cancel() {
      setShowModalConf(false)
   }

   // Modals Preparation & Show
   function setConfirmationDetails(text, btn1, btn2) {
      setText(text)
      setBtn1(btn1)
      setBtn2(btn2)
      setShowModalConf(true)
   }

   // Quick Match
   async function handleClickQuickMatch() {
      setShowLogoutMsg(false)
      if (user?.activeMatches.quickMatch) {
         setConfirmationDetails(
            QM_text,
            { text: 'RESUME', func: QM_resume },
            { text: 'START NEW', func: QM_startNew }
         )
      } else {
         setLoading(true)
         await setData('quickMatch')
         setLoading(false)
         navigate('/match')
      }
   }
   async function QM_resume() {
      setShowModalConf(false)
      setLoading(true)
      await setData('quickMatch')
      setLoading(false)
      navigate('/match')
   }
   async function QM_startNew() {
      setShowModalConf(false)
      setLoading(true)
      await deleteActiveGameData(user.token, 'quickMatch')
      await setData('quickMatch', true)
      setLoading(false)
      navigate('/match')
   }

   // Match With Id
   async function handleClickMatchWithId() {
      setShowLogoutMsg(false)
      if (user.activeMatches.quickMatchId) {
         setConfirmationDetails(
            QMId_text,
            { text: 'RESUME', func: QMId_resume },
            { text: 'START NEW', func: QMId_startNew }
         )
      } else {
         setOverwrite(false)
         setShowModalQMId(true)
      }
   }
   async function QMId_resume() {
      setShowModalConf(false)
      setLoading(true)
      await setData('quickMatchId')
      setLoading(false)
      navigate('/match')
   }
   async function QMId_startNew() {
      setShowModalConf(false)
      setOverwrite(true)
      setShowModalQMId(true)
   }

   // Ranked Match
   async function handleClickRankedMatch() {
      setShowLogoutMsg(false)
      if (user.activeMatches.ranked) {
         setLoading(true)
         const game = await getActiveGameData(user.token, 'ranked')
         if ((Date.now() - game.createdAt_ms) / (1000 * 60 * 60 * 24) > 3) {
            // Delete Expired Ranked Game from Active Games
            await deleteActiveGameData(user.token, 'ranked')
            // Create forfeited game (endedGame)
            const gameData = {
               corporation: game.statePlayer.corporation,
               cards: {
                  played: game.statePlayer.cardsPlayed,
                  seen: game.statePlayer.cardsSeen,
                  purchased: game.statePlayer.cardsPurchased,
                  inDeck: game.statePlayer.cardsDeckIds,
               },
               logItems: game.logItems,
               forfeited: true,
            }
            await createEndedGameData(user.token, gameData)
            // Update user by changing activeMatches
            const { data } = await updateUser(user.token, {
               activeMatches: {
                  quickMatch: user.activeMatches.quickMatch,
                  quickMatchId: user.activeMatches.quickMatchId,
                  ranked: false,
               },
            })
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
            setLoading(false)
            setConfirmationDetails(RM_new_text_with_expired, { text: 'YES', func: RM_startNew })
         } else {
            setLoading(false)
            setConfirmationDetails(
               RM_resume_text,
               { text: 'RESUME', func: RM_resume },
               { text: 'START NEW', func: RM_forfeitAndStartNew }
            )
         }
      } else {
         setConfirmationDetails(RM_new_text, { text: 'YES', func: RM_startNew })
      }
   }
   async function RM_resume() {
      setShowModalConf(false)
      setLoading(true)
      await setData('ranked')
      setLoading(false)
      navigate('/match')
   }
   async function RM_forfeitAndStartNew() {
      setShowModalConf(false)
      setLoading(true)
      const gameData = await getActiveGameData(user.token, 'ranked')
      const endedGameData = {
         corporation: gameData.statePlayer.corporation,
         cards: {
            played: gameData.statePlayer.cardsPlayed,
            seen: gameData.statePlayer.cardsSeen,
            purchased: gameData.statePlayer.cardsPurchased,
            inDeck: gameData.statePlayer.cardsDeckIds,
         },
         logItems: gameData.logItems,
         forfeited: true,
      }
      await createEndedGameData(user.token, endedGameData)
      await deleteActiveGameData(user.token, 'ranked')
      await setData('ranked', true)
      setLoading(false)
      navigate('/match')
   }
   async function RM_startNew() {
      setShowModalConf(false)
      setLoading(true)
      await setData('ranked')
      setLoading(false)
      navigate('/match')
   }

   return (
      <>
         <div className="menu">
            {/* Logout Message */}
            {showLogoutMsg && (
               <div className="message">
                  <span>YOU HAVE LOGGED OUT SUCCESSFULLY!</span>
               </div>
            )}
            {/* Loading Spinner */}
            {loading && (
               <div className="spinner">
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            )}
            {/* Quick Match */}
            <Button text="QUICK MATCH" action={handleClickQuickMatch} disabled={loading} />
            {/* Quick Match With Id*/}
            <Button
               text="MATCH WITH ID"
               action={handleClickMatchWithId}
               disabled={user == null || loading}
               tipText={tipText_QMId}
            />
            {/* Ranked */}
            <Button
               text="RANKED MATCH"
               action={handleClickRankedMatch}
               disabled={user == null || loading}
               tipText={tipText_RM}
            />
            {/* Ranking */}
            <Button text="RANKING" path="ranking" disabled={loading} />
            {/* Statistics */}
            <Button text="STATISTICS" path="stats" disabled={loading} />
            {/* Settings */}
            <Button text="SETTINGS" path="settings" disabled={loading} />
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
         {showModalConf && (
            <ModalConfirmation text={text} btn1={btn1} btn2={btn2} cancel={cancel} />
         )}
         {/* Modal for Match With Id */}
         {showModalQMId && (
            <ModalQMId
               setShowModalQMId={setShowModalQMId}
               overwrite={overwrite}
               setData={setData}
               user={user}
            />
         )}
      </>
   )
}

export default Menu
