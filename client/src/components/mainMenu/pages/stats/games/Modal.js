import { useState, useContext } from 'react'
import { ModalsContext, PlayersContext } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react'
import { updateEndedGameData } from '../../../../../api/endedGame'
import spinner from '../../../../../assets/other/spinner.gif'
import { APP_MESSAGES } from '../../../../../App'

const Modal = ({ user }) => {
   const { setShowModal, modalText, editMode, setEditMode, linkOrComment, gameId } = useContext(ModalsContext)
   const { currPlayerId, setCurrPlayers } = useContext(PlayersContext)
   const refTextarea = useRef()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')

   const handleClickEdit = () => {
      if (loading) return
      setEditMode((prev) => !prev)
      refTextarea.current.focus()
   }

   const handleClickSave = async () => {
      if (!editMode || loading) return
      try {
         setError(null)
         setLoading(true)
         const newValue = refTextarea.current.value
         const details = {
            gameId,
            link: linkOrComment === 'link' ? newValue : undefined,
            comment: linkOrComment === 'link' ? undefined : newValue,
         }
         // Update Game on server
         await updateEndedGameData(user.token, details)
         // Update Game on app
         setCurrPlayers((prevCurrPlayers) => {
            let newCurrPlayers = [...prevCurrPlayers]
            let playerId
            newCurrPlayers.forEach((player, idx) => {
               if (player._id === currPlayerId) playerId = idx
            })
            newCurrPlayers[playerId].games.forEach((game, idx) => {
               if (game._id === gameId) {
                  if (linkOrComment === 'link') {
                     newCurrPlayers[playerId].games[idx].link = newValue
                  } else {
                     newCurrPlayers[playerId].games[idx].comment = newValue
                  }
               }
            })
            return newCurrPlayers
         })

         setLoading(false)
         setShowModal(false)
      } catch (error) {
         setError(APP_MESSAGES.FAILURE)
         setLoading(false)
      }
   }

   return (
      <div className="modal center" onClick={(e) => e.stopPropagation()}>
         {/* Close Button */}
         <div className="btn-close pointer" style={{ right: '-2%', top: '-9%' }} onClick={() => setShowModal(false)}>
            <FontAwesomeIcon icon={faXmark} />
         </div>
         {/* Title */}
         <div className="title">{linkOrComment === 'link' ? 'LINK:' : 'COMMENT:'}</div>
         {/* Error */}
         {error && <div className="error">{error}</div>}
         {/* Textarea */}
         <textarea ref={refTextarea} className={`center ${editMode && 'edit'}`} name="text" defaultValue={modalText} readOnly={!editMode} autoFocus></textarea>
         {currPlayerId === user?._id && (
            <div className="btns">
               {/* Edit Mode Button */}
               <div className="btn-edit pointer" onClick={handleClickEdit}>
                  <FontAwesomeIcon icon={faPenToSquare} />
               </div>
               {/* Save Button */}
               <div className={`btn-save ${!editMode || loading ? 'disabled' : 'pointer'}`} onClick={handleClickSave}>
                  {/* Loading Spinner */}
                  {loading ? (
                     <div className="spinner">
                        <img className="full-size" src={spinner} alt="loading_spinner" />
                     </div>
                  ) : (
                     <span>SAVE</span>
                  )}
               </div>
            </div>
         )}
      </div>
   )
}

export default Modal
