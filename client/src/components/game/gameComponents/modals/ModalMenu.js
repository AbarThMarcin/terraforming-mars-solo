/* Used to show the game menu window */
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteGameData } from '../../../../api/apiGame'
import { updateUser } from '../../../../api/apiUser'
import { ModalsContext, UserContext } from '../../Game'

const ModalMenu = () => {
   const navigate = useNavigate()
   const { modals, setModals } = useContext(ModalsContext)
   const { user, setUser, isRanked } = useContext(UserContext)

   const onYes = async (withForfeit) => {
      if (user && withForfeit) {
         // Delete Game
         await deleteGameData(user.token, isRanked)
         // Update user by changing quickMatchOn or rankedMatchOn
         const { data } = await updateUser(user.token, {
            quickMatchOn: isRanked ? user.quickMatchOn : false,
            rankedMatchOn: isRanked ? false : user.rankedMatchOn,
         })
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
      }
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
