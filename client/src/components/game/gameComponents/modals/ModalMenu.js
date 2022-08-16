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
   const { user, setUser, type } = useContext(UserContext)

   const onYes = async (withForfeit) => {
      // If Logged and pressed Forfeit
      if (user && withForfeit) {
         // Delete Game from active games
         await deleteActiveGameData(user.token, type)
         // Create forfeited game (endedGame) if type is ranked
         if (type === 'ranked') {
            const gameData = {
               corporation: statePlayer.corporation,
               cards: {
                  played: statePlayer.cardsPlayed,
                  seen: statePlayer.cardsSeen,
                  purchased: statePlayer.cardsPurchased,
               },
               forfeited: true,
            }
            await createEndedGameData(user.token, gameData)
         }
         // Update user by changing activeMatches
         const { data } = await updateUser(user.token, {
            activeMatches: {
               quickMatch: type === 'quickMatch' ? false : user.activeMatches.quickMatch,
               quickMatchId: type === 'quickMatchId' ? false : user.activeMatches.quickMatchId,
               ranked: type === 'ranked' ? false : user.activeMatches.ranked,
            },
         })
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
            onClick={() => setModals({ ...modals, menu: false, settings: false, rules: false })}
         >
            <div className="modal-menu" onClick={(e) => e.stopPropagation()}>
               <ul>
                  <li
                     className="pointer"
                     onClick={() =>
                        setModals({ ...modals, settings: !modals.settings, rules: false })
                     }
                  >
                     SETTINGS
                  </li>
                  <li
                     className="pointer"
                     onClick={() => setModals({ ...modals, rules: !modals.rules, settings: false })}
                  >
                     RULES
                  </li>
                  {user && (
                     <li className="pointer" onClick={() => handleClickForfeitOrMainMenu(true)}>
                        FORFEIT
                     </li>
                  )}
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
