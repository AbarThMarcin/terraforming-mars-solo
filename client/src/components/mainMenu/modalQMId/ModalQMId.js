import { useState, useContext } from 'react'
import { APP_MESSAGES, SoundContext } from '../../../App'
import { useNavigate } from 'react-router-dom'
import { deleteActiveGameData } from '../../../api/activeGame'
import { getMatchWithId } from '../../../api/matchWithId'
import spinner from '../../../assets/other/spinner.gif'

const btnFunc1Position = {
   top: '45%',
   left: '22%',
   transform: 'translate(-50%, -50%)',
}
const btn2Style = {
   position: 'static',
}
const btnCancelPosition = {
   bottom: '13%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
}
const modalBgStyle = {
   background: `linear-gradient(0deg,
      rgba(0, 10, 7, 0.9) 0%,
      rgba(0, 2, 1, 0.9) 40%,
      rgba(0, 2, 1, 0.9) 60%,
      rgba(0, 10, 7, 0.9) 100%
   )`,
}
const spinnerStyle = {
   top: '26%',
}

const ModalQMId = ({ setShowModalQMId, overwrite, setData, user }) => {
   let navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [showError, setShowError] = useState('')
   const [matchId, setMatchId] = useState('')
   const { sound } = useContext(SoundContext)

   async function funcStartMatchId(id) {
      if (loading) return
      setShowError('')
      setLoading(true)
      // Check if pressed CREATE or PLAY
      let matchWithId = null
      if (id !== null) {
         matchWithId = await getMatchWithId(user.token, id)
         if (matchWithId?.response?.status === 500) {
            setLoading(false)
            setShowError(APP_MESSAGES.GAME_WITH_ID_NOT_FOUND)
            return
         } else if (matchWithId?.response?.status === 401) {
            setLoading(false)
            setShowError(APP_MESSAGES.SOMETHING_WENT_WRONG)
            return
         }
      }
      // Delete existing game (if overwriting)
      if (overwrite) {
         const res = await deleteActiveGameData(user.token, 'quickMatchId')
         if (res?.response) {
            setLoading(false)
            setShowError(APP_MESSAGES.SOMETHING_WENT_WRONG)
            return
         }
      }
      // Create new game
      const data = await setData('quickMatchId', overwrite, matchWithId)
      if (data) {
         setLoading(false)
         setShowModalQMId(false)
         navigate('/match')
      } else {
         setLoading(false)
         setShowError(APP_MESSAGES.SOMETHING_WENT_WRONG)
         return
      }
   }

   function cancel() {
      if (loading) return
      setShowModalQMId(false)
   }

   return (
      <div className="modal-background">
         <div className="modal-confirmation center" style={modalBgStyle}>
            {/* Loading Spinner */}
            {loading && (
               <div className="spinner" style={spinnerStyle}>
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            )}
            {/* Text */}
            <div className="title">START QUICK MATCH WITH ID</div>
            {/* Tip */}
            <div className="tip">YOU CAN FIND MATCH ID IN THE GAME MENU</div>
            {/* Button 1 */}
            <div
               className="btn-action pointer"
               style={btnFunc1Position}
               onClick={() => {
                  sound.btnGeneralClick.play()
                  funcStartMatchId(null)
               }}
            >
               <span>CREATE</span>
            </div>
            {/* Button 2 */}
            <div className="qmid-play-container">
               <input
                  type="text"
                  name="qmid"
                  placeholder="ENTER MATCH ID"
                  disabled={loading}
                  onInput={(e) => {
                     setShowError('')
                     setMatchId(e.target.value)
                  }}
               />
               <div
                  className="btn-action pointer"
                  style={btn2Style}
                  onClick={() => {
                     sound.btnGeneralClick.play()
                     funcStartMatchId(matchId)
                  }}
               >
                  <span>PLAY</span>
               </div>
            </div>
            {showError && (
               <div className="error">
                  <span>{showError}</span>
               </div>
            )}
            {/* Button Cancel */}
            <div
               className="btn-cancel pointer"
               style={btnCancelPosition}
               onClick={() => {
                  sound.btnGeneralClick.play()
                  cancel()
               }}
            >
               <span>CANCEL</span>
            </div>
         </div>
      </div>
   )
}

export default ModalQMId
