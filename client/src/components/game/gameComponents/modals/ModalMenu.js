/* Used to show the game menu window */
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteActiveGameData } from '../../../../api/apiActiveGame'
import { createEndedGameData } from '../../../../api/apiEndedGame'
import { updateUser } from '../../../../api/apiUser'
import { StatePlayerContext, ModalsContext, UserContext } from '../../Game'

const ModalMenu = () => {
   const navigate = useNavigate()
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { user, setUser, isRanked } = useContext(UserContext)

   const onYes = async (withForfeit) => {
      // If Logged and pressed Forfeit
      if (user && withForfeit) {
         // Delete Game from active games
         await deleteActiveGameData(user.token, isRanked)
         // Create forfeited game (endedGame) if isRanked === true
         if (isRanked) {
            const gameData = {
               corporation: statePlayer.corporation,
               cardsPlayed: statePlayer.cardsPlayed,
            }
            await createEndedGameData(user.token, gameData)
         }
         // Update user by changing quickMatchOn or rankedMatchOn
         const userMatches = {
            quickMatchOn: isRanked ? user.quickMatchOn : false,
            rankedMatchOn: isRanked ? false : user.rankedMatchOn,
         }
         const { data } = await updateUser(user.token, userMatches)
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
      }
      // Go to Main Menu
      navigate('/')
   }

   const handleClickForfeitOrMainMenu = (withForfeit = false) => {
      setModals({
         ...modals,
         modalConf: {
            text: withForfeit
               ? 'Do you want to forfeit the game?'
               : 'Do you want to go to main menu?',
            onYes: () => onYes(withForfeit),
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      <>
         <div
            className="full-size"
            onClick={() => setModals({ ...modals, menu: false, settings: false })}
         >
            <div className="modal-menu" onClick={(e) => e.stopPropagation()}>
               <ul>
                  <li
                     className="pointer"
                     onClick={() => setModals({ ...modals, settings: !modals.settings })}
                  >
                     SETTINGS
                  </li>
                  {user && (
                     <li className="pointer" onClick={() => handleClickForfeitOrMainMenu(true)}>
                        FORFEIT
                     </li>
                  )}
                  <li
                     className="pointer"
                     onClick={() => setModals({ ...modals, rules: true, settings: false })}
                  >
                     RULES
                  </li>
                  <li className="pointer" onClick={() => handleClickForfeitOrMainMenu()}>
                     MAIN MENU
                  </li>
               </ul>
            </div>
         </div>
      </>
   )
}

export default ModalMenu
