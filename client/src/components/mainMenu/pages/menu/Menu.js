import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../button/Button'
import spinner from '../../../../assets/other/spinner.gif'
import ModalConfirmation from '../../ModalConfirmation'
import { deleteActiveGameData, getActiveGameData } from '../../../../api/activeGame'
import { createEndedGameData } from '../../../../api/endedGame'
import { useContext } from 'react'
import { ModalConfirmationContext } from '../../../../App'
import { updateUser } from '../../../../api/user'
import { useEffect } from 'react'
import ModalQMId from '../../modalQMId/ModalQMId'
import Message from './Message'
import { getLogAndStatesConvertedForGame, getLogConvertedForDB, getStatePlayerWithAllDataFromActive, getThinerCardsForEndedGame } from '../../../../utils/dataConversion'
import { APP_MESSAGES, MATCH_TYPES, TIP_TEXTS } from '../../../../data/app'

// Quick Match Text for Confirmation Window
const QM_text = 'Do you want to resume previous quick match?'
// Match With Id Texts for Confirmation Window
const QMId_text = 'Do you want to resume previous match with id?'
// Ranked Match Texts for Confirmation Window
const RM_new_text = 'You are about to create a new ranked match. You have 24 hours to finish it. Are you sure you want to continue?'
const RM_new_text_with_expired = `Your active ranked match has been expired, and therefore treated as forfeited. You are about to create a new ranked match. You have 24 hours to finish it. Are you sure you want to continue?`
const RM_resume_text = 'Do you want to resume previous ranked match or forfeit and start a new one?'

const Menu = ({ user, setUser, setDataForGame }) => {
   let navigate = useNavigate()
   const { showModalConf, setShowModalConf, showModalQMId, setShowModalQMId, overwrite, setOverwrite } = useContext(ModalConfirmationContext)
   const [loading, setLoading] = useState(false)
   const [text, setText] = useState('')
   const [btn1, setBtn1] = useState()
   const [btn2, setBtn2] = useState()
   const [showMsg, setShowMsg] = useState('')
   const [showMsgType, setShowMsgType] = useState('')

   useEffect(() => {
      setShowMsg('')
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
      setShowMsg('')
      setLoading(true)

      if (user?.activeMatches.quickMatch) {
         setLoading(false)
         setConfirmationDetails(QM_text, { text: 'RESUME', func: QM_resume }, { text: 'START NEW', func: QM_startNew })
      } else {
         setLoading(true)
         const data = await setDataForGame({ type: MATCH_TYPES.QUICK_MATCH })
         setLoading(false)
         if (data) {
            navigate('/match')
         } else {
            setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
            setShowMsgType('error')
         }
      }
   }

   async function QM_resume() {
      setShowModalConf(false)
      setLoading(true)
      const data = await setDataForGame({ type: MATCH_TYPES.QUICK_MATCH })
      setLoading(false)
      if (data) {
         navigate('/match')
      } else {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
      }
   }

   async function QM_startNew() {
      setShowModalConf(false)
      setLoading(true)
      let data = await deleteActiveGameData(user.token, MATCH_TYPES.QUICK_MATCH)
      if (!data?.corps) {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
         setLoading(false)
         return
      }
      data = await setDataForGame({ type: MATCH_TYPES.QUICK_MATCH, restartMatch: true })
      setLoading(false)
      if (data) {
         navigate('/match')
      } else {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
      }
   }

   // Match With Id
   async function handleClickMatchWithId() {
      setShowMsg('')
      if (user.activeMatches.quickMatchId) {
         setConfirmationDetails(QMId_text, { text: 'RESUME', func: QMId_resume }, { text: 'START NEW', func: QMId_startNew })
      } else {
         setOverwrite(false)
         setShowModalQMId(true)
      }
   }

   async function QMId_resume() {
      setShowModalConf(false)
      setLoading(true)
      const data = await setDataForGame({ type: MATCH_TYPES.QUICK_MATCH_ID })
      setLoading(false)
      if (data) {
         navigate('/match')
      } else {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
      }
   }

   async function QMId_startNew() {
      setShowModalConf(false)
      setOverwrite(true)
      setShowModalQMId(true)
   }

   // Ranked Match
   async function handleClickRankedMatch() {
      setShowMsg('')
      setLoading(true)

      let res
      if (user.activeMatches.ranked) {
         let game = await getActiveGameData(user.token, MATCH_TYPES.RANKED_MATCH)
         const { convertedLogItems } = getLogAndStatesConvertedForGame(game.logItems, game.initStateBoard, game.statePlayer.cardsDeckIds, false)
         game = {
            ...game,
            statePlayer: getStatePlayerWithAllDataFromActive(game.statePlayer),
            logItems: convertedLogItems,
         }

         if (!game?.corps) {
            setLoading(false)
            setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
            setShowMsgType('error')
            return
         }
         // if ((Date.now() - game.createdAt_ms) / (1000 * 7) > 3) {
         if ((Date.now() - game.createdAt_ms) / (1000 * 60 * 60 * 24) > 3) {
            // Delete Expired Ranked Game from Active Games
            res = await deleteActiveGameData(user.token, MATCH_TYPES.RANKED_MATCH)
            if (!res?.corps) {
               setLoading(false)
               setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
               setShowMsgType('error')
               return
            }
            // Create forfeited game (endedGame)
            const newGame = await createEndedGameData(user.token, {
               corporation: game.statePlayer.corporation?.id,
               cards: getThinerCardsForEndedGame(game.statePlayer),
               initCorps: res.corps,
               initStateBoard: res.initStateBoard,
               logItems: getLogConvertedForDB(game.logItems),
               forfeited: true,
               startTime: res.startTime,
               endTime: new Date().toJSON(),
               durationSeconds: res.durationSeconds,
            })
            if (!newGame?.points) {
               setLoading(false)
               setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
               setShowMsgType('error')
               return
            }
            // Update user by changing activeMatches
            res = await updateUser(user.token, {
               activeMatches: {
                  quickMatch: user.activeMatches.quickMatch,
                  quickMatchId: user.activeMatches.quickMatchId,
                  ranked: false,
               },
            })
            if (res.data) {
               localStorage.setItem('user', JSON.stringify(res.data))
               setUser(res.data)
            } else {
               setLoading(false)
               return
            }
            setLoading(false)
            setConfirmationDetails(RM_new_text_with_expired, { text: 'YES', func: RM_startNew })
         } else {
            setLoading(false)
            setConfirmationDetails(RM_resume_text, { text: 'RESUME', func: RM_resume }, { text: 'START NEW', func: RM_forfeitAndStartNew })
         }
      } else {
         setLoading(false)
         setConfirmationDetails(RM_new_text, { text: 'YES', func: RM_startNew })
      }
   }

   async function RM_resume() {
      setShowModalConf(false)
      setLoading(true)
      const data = await setDataForGame({ type: MATCH_TYPES.RANKED_MATCH })
      setLoading(false)
      if (data) {
         navigate('/match')
      } else {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
      }
   }

   async function RM_forfeitAndStartNew() {
      setShowModalConf(false)
      setLoading(true)
      let gameData = await getActiveGameData(user.token, MATCH_TYPES.RANKED_MATCH)
      const { convertedLogItems } = getLogAndStatesConvertedForGame(gameData.logItems, gameData.initStateBoard, gameData.statePlayer.cardsDeckIds, false)
      gameData = {
         ...gameData,
         statePlayer: getStatePlayerWithAllDataFromActive(gameData.statePlayer),
         logItems: convertedLogItems,
      }

      if (!gameData?.corps) {
         setLoading(false)
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
         return
      }
      const res = await deleteActiveGameData(user.token, MATCH_TYPES.RANKED_MATCH)
      if (!res?.corps) {
         setLoading(false)
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
         return
      }
      const newGame = await createEndedGameData(user.token, {
         corporation: gameData.statePlayer.corporation?.id,
         cards: getThinerCardsForEndedGame(gameData.statePlayer),
         initCorps: res.corps,
         initStateBoard: res.initStateBoard,
         logItems: getLogConvertedForDB(gameData.logItems),
         forfeited: true,
         startTime: res.startTime,
         endTime: new Date().toJSON(),
         durationSeconds: res.durationSeconds,
      })
      if (!newGame?.points) {
         setLoading(false)
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
         return
      }
      const data = await setDataForGame({ type: MATCH_TYPES.RANKED_MATCH, restartMatch: true })
      setLoading(false)
      if (data) {
         navigate('/match')
      } else {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
      }
   }

   async function RM_startNew() {
      setShowModalConf(false)
      setLoading(true)
      const data = await setDataForGame({ type: MATCH_TYPES.RANKED_MATCH })
      setLoading(false)
      if (data) {
         navigate('/match')
      } else {
         setShowMsg(APP_MESSAGES.SOMETHING_WENT_WRONG)
         setShowMsgType('error')
      }
   }

   function logout() {
      localStorage.removeItem('user')
      setUser(null)
      setShowMsg(APP_MESSAGES.LOGGED_OUT)
      setShowMsgType('success')
   }

   return (
      <>
         <div className="menu">
            {/* Message */}
            {showMsg && <Message msg={showMsg} type={showMsgType} />}
            {/* Loading Spinner */}
            {loading && (
               <div className="spinner">
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            )}
            {/* Quick Match */}
            <Button text="QUICK MATCH" action={handleClickQuickMatch} disabled={loading} />
            {/* Quick Match With Id*/}
            <Button text="MATCH WITH ID" action={handleClickMatchWithId} disabled={user == null || loading} loading={loading} tipText={TIP_TEXTS.MENU_QM_ID} />
            {/* Ranked */}
            <Button text="RANKED MATCH" action={handleClickRankedMatch} disabled={user == null || loading} loading={loading} tipText={TIP_TEXTS.MENU_RANKED} />
            {/* Ranking */}
            <Button text="RANKING" path="ranking" disabled={loading} />
            {/* Statistics */}
            <Button text="STATISTICS" path="stats" disabled={loading} />
            {/* Settings */}
            <Button text="SETTINGS" path="settings" disabled={loading} />
            {/* Account */}
            <Button text="ACCOUNT" path="account" disabled={user == null || loading} loading={loading} tipText={TIP_TEXTS.MENU_ACCOUNT} />
            {/* Login */}
            {user ? <Button text="LOGOUT" path="/" action={logout} disabled={loading} /> : <Button text="LOGIN" path="login" disabled={loading} />}
         </div>
         {/* Confirmation Modal */}
         {showModalConf && <ModalConfirmation text={text} btn1={btn1} btn2={btn2} cancel={cancel} />}
         {/* Modal for Match With Id */}
         {showModalQMId && <ModalQMId setShowModalQMId={setShowModalQMId} overwrite={overwrite} setDataForGame={setDataForGame} user={user} />}
      </>
   )
}

export default Menu
