/* Used to show the game menu window */
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteActiveGameData } from '../../../../../api/activeGame'
import { createEndedGameData } from '../../../../../api/endedGame'
import { updateUser } from '../../../../../api/user'
import { StatePlayerContext, StateGameContext, ModalsContext, UserContext } from '../../../../game'
import { SettingsContext, SoundContext } from '../../../../../App'

const ModalMenu = () => {
   const navigate = useNavigate()
   const { statePlayer } = useContext(StatePlayerContext)
   const { logItems } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { user, setUser, type, id } = useContext(UserContext)
   const { settings } = useContext(SettingsContext)
   const { music, sound } = useContext(SoundContext)

   const onYes = async (withForfeit) => {
      // If Logged and pressed Forfeit
      if (user && withForfeit) {
         // Delete Game from active games
         let res
         res = await deleteActiveGameData(user.token, type)

         if (res?.response) return
         // Create forfeited game (endedGame) if type is ranked
         if (type === 'RANKED MATCH') {
            const gameData = {
               corporation: statePlayer.corporation,
               cards: {
                  played: statePlayer.cardsPlayed,
                  seen: statePlayer.cardsSeen,
                  purchased: statePlayer.cardsPurchased,
                  inDeck: statePlayer.cardsDeckIds,
               },
               logItems,
               forfeited: true,
               startTime: res.startTime,
               endTime: new Date().toJSON(),
               durationSeconds: res.durationSeconds
            }
            await createEndedGameData(user.token, gameData)
         }
         // Update user by changing activeMatches
         const { data } = await updateUser(user.token, {
            activeMatches: {
               quickMatch: type === 'QUICK MATCH' ? false : user.activeMatches.quickMatch,
               quickMatchId: type === 'QUICK MATCH (ID)' ? false : user.activeMatches.quickMatchId,
               ranked: type === 'RANKED MATCH' ? false : user.activeMatches.ranked,
            },
         })
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
      }
      // Go to Main Menu
      music.volume(settings.musicVolume)
      Object.keys(sound).forEach((key) => sound[key].volume(settings.gameVolume))
      navigate('/')
   }

   const handleClickForfeitOrMainMenu = (withForfeit = false) => {
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: withForfeit ? 'Do you want to forfeit the game?' : 'Do you want to go to main menu?',
            onYes: () => onYes(withForfeit),
            onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
         },
         confirmation: true,
      }))
   }

   return (
      <>
         <div
            className="full-size"
            onClick={() => {
               setModals((prev) => ({ ...prev, menu: false, settings: false, rules: false }))
               music.volume(settings.musicVolume)
               Object.keys(sound).forEach((key) => sound[key].volume(settings.gameVolume))
            }}
         >
            <div className="modal-menu" onClick={(e) => e.stopPropagation()}>
               {/* Menu List */}
               <ul>
                  <li
                     className="pointer"
                     onClick={() => {
                        sound.btnGeneralClick.play()
                        setModals((prev) => ({ ...prev, settings: !modals.settings, rules: false }))
                        music.volume(settings.musicVolume)
                        Object.keys(sound).forEach((key) => sound[key].volume(settings.gameVolume))
                     }}
                  >
                     SETTINGS
                  </li>
                  <li
                     className="pointer"
                     onClick={() => {
                        sound.btnGeneralClick.play()
                        setModals((prev) => ({ ...prev, rules: !modals.rules, settings: false }))
                        music.volume(settings.musicVolume)
                        Object.keys(sound).forEach((key) => sound[key].volume(settings.gameVolume))
                     }}
                  >
                     RULES
                  </li>
                  {user && (
                     <li
                        className="pointer"
                        onClick={() => {
                           sound.btnGeneralClick.play()
                           handleClickForfeitOrMainMenu(true)
                        }}
                     >
                        FORFEIT
                     </li>
                  )}
                  <li
                     className="pointer"
                     onClick={() => {
                        sound.btnGeneralClick.play()
                        handleClickForfeitOrMainMenu()
                     }}
                  >
                     MAIN MENU
                  </li>
               </ul>
               {/* Game Id */}
               {type === 'QUICK MATCH (ID)' && (
                  <div className="game-id">
                     <span>MATCH ID: </span>
                     <span className="id">{id}</span>
                  </div>
               )}
            </div>
         </div>
      </>
   )
}

export default ModalMenu
