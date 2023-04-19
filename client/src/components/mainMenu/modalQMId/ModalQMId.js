import { useState, useContext } from 'react'
import { SoundContext } from '../../../App'
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
   const [showError, setShowError] = useState(false)
   const [matchId, setMatchId] = useState('')
   const { sound } = useContext(SoundContext)

   async function funcStartMatchId(id) {
      if (loading) return
      setShowError(false)
      setLoading(true)
      // Check if pressed CREATE or PLAY
      let matchWithId = null
      if (id !== null) {
         matchWithId = await getMatchWithId(user.token, id)
         if (!matchWithId) {
            setLoading(false)
            setShowError(true)
            return
         }
      }
      // Delete existing game (if overwriting)
      if (overwrite) {
         await deleteActiveGameData(user.token, 'quickMatchId')
      }
      // Create new game
      await setData('quickMatchId', overwrite ? true : false, matchWithId)
      setLoading(false)
      setShowModalQMId(false)
      navigate('/match')
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
                  onInput={(e) => setMatchId(e.target.value)}
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
               {showError && (
                  <div className="error">
                     <span>GAME COULD NOT BE FOUND</span>
                  </div>
               )}
            </div>
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
