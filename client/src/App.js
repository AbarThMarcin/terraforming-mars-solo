import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { addNeutralTiles } from './utils/misc'
import { INIT_STATE_PLAYER } from './initStates/initStatePlayer'
import { INIT_STATE_GAME } from './initStates/initStateGame'
import { INIT_MODALS } from './initStates/initModals'
import { INIT_BOARD } from './initStates/initBoard'
import { LOG_TYPES } from './data/log'
import Menu from './components/mainMenu/pages/Menu'
import Stats from './components/mainMenu/pages/stats/Stats'
import Settings from './components/mainMenu/pages/Settings'
import Rules from './components/mainMenu/pages/Rules'
import Login from './components/mainMenu/pages/Login'
import Register from './components/mainMenu/pages/Register'
import Account from './components/mainMenu/pages/Account'
import Game from './components/game/Game'
import MainMenu from './components/mainMenu/MainMenu'
import { createActiveGameData, getActiveGameData, getRandIntNumbers } from './api/apiActiveGame'
import { updateUser } from './api/apiUser'
import { createContext } from 'react'

export const ModalConfirmationContext = createContext()
export const SettingsContext = createContext()

const defaultSettings = {
   speedId: 2,
   showTotVP: false,
   sortId: ['4a', '4a-played'],
}

function App() {
   // User
   const [user, setUser] = useState(null)
   // Game States
   const [initStatePlayer, setInitStatePlayer] = useState()
   const [initStateGame, setInitStateGame] = useState()
   const [initStateModals, setInitStateModals] = useState()
   const [initStateBoard, setInitStateBoard] = useState()
   const [initCorpsIds, setInitCorpsIds] = useState()
   const [initCardsIds, setInitCardsIds] = useState()
   const [initLogItems, setInitLogItems] = useState()
   // Match Type
   const [type, setType] = useState()
   // Modal Confirmation Details
   const [showModalConf, setShowModalConf] = useState(false)
   // App Settings
   const [settings, setSettings] = useState(defaultSettings)

   useEffect(() => {
      const user = localStorage.getItem('user')
      if (user) {
         const userObj = JSON.parse(user)
         setUser(userObj)
         setSettings({
            speedId: userObj.settings.gameSpeed,
            showTotVP: userObj.settings.showTotalVP,
            sortId: [userObj.settings.handSortId, userObj.settings.playedSortId],
         })
      }
   }, [])

   async function setData(type, restartMatch = false) {
      // Empty Data
      let gameData = {
         statePlayer: null,
         stateGame: null,
         stateModals: null,
         stateBoard: null,
         corps: null,
         initCards: null,
         logItems: null,
      }
      let token = user?.token
      if (!token) {
         // User not logged in
         await initNewGame(gameData)
      } else {
         let matchStarted
         switch (type) {
            case 'quickMatch':
               matchStarted = user.activeMatches.quickMatch
               break
            case 'quickMatchId':
               matchStarted = user.activeMatches.quickMatchId
               break
            case 'ranked':
               matchStarted = user.activeMatches.ranked
               break
            default:
               break
         }
         if (!matchStarted || restartMatch) {
            // ============= Game not started
            await initNewGame(gameData)
            // Save init game data to the server
            await createActiveGameData(
               user.token,
               {
                  statePlayer: gameData.statePlayer,
                  stateGame: gameData.stateGame,
                  stateModals: gameData.stateModals,
                  stateBoard: gameData.stateBoard,
                  corps: gameData.corps,
                  initCards: gameData.initCards,
                  logItems: gameData.logItems,
               },
               type
            )
            // Update user
            const { data } = await updateUser(user.token, {
               activeMatches: {
                  quickMatch: type === 'quickMatch' ? true : user.activeMatches.quickMatch,
                  quickMatchId: type === 'quickMatchId' ? true : user.activeMatches.quickMatchId,
                  ranked: type === 'ranked' ? true : user.activeMatches.ranked,
               },
            })
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
         } else {
            // ============= Game already started
            gameData = await getActiveGameData(user.token, type)
         }
      }

      // Assign Data to states
      setInitStatePlayer(gameData.statePlayer)
      setInitStateGame(gameData.stateGame)
      setInitStateModals(gameData.stateModals)
      setInitStateBoard(gameData.stateBoard)
      setInitCorpsIds(gameData.corps)
      setInitCardsIds(gameData.initCards)
      setInitLogItems(gameData.logItems)
      setType(type)
   }

   async function initNewGame(gameData) {
      const board = JSON.parse(JSON.stringify(INIT_BOARD))
      gameData.statePlayer = INIT_STATE_PLAYER
      gameData.stateGame = INIT_STATE_GAME
      gameData.stateModals = INIT_MODALS
      gameData.stateBoard = addNeutralTiles(board)
      gameData.corps = await getRandIntNumbers(2, 1, 12)
      gameData.initCards = await getRandIntNumbers(10, 1, 208)
      // gameData.initCards = [111, 20, 192, 196, 204, 156, 73, 3, 4, 5]
      gameData.logItems = [
         { type: LOG_TYPES.LOG, data: null },
         { type: LOG_TYPES.GENERATION, data: { text: '1' } },
      ]
   }

   function logout() {
      localStorage.removeItem('user')
      setUser(null)
   }

   return (
      <ModalConfirmationContext.Provider value={{ showModalConf, setShowModalConf }}>
         <SettingsContext.Provider value={{ settings, setSettings }}>
            <div className="app">
               <Router>
                  <Routes>
                     <Route path="/" element={<MainMenu />}>
                        <Route
                           index
                           element={
                              <Menu
                                 user={user}
                                 setUser={setUser}
                                 setData={setData}
                                 logout={logout}
                              />
                           }
                        />
                        <Route path="stats" element={<Stats user={user} />} />
                        <Route
                           path="settings"
                           element={<Settings user={user} setUser={setUser} />}
                        />
                        <Route path="rules" element={<Rules />} />
                        <Route path="login" element={<Login setUser={setUser} />} />
                        <Route path="register" element={<Register setUser={setUser} />} />
                        <Route path="account" element={<Account user={user} setUser={setUser} />} />
                     </Route>
                     <Route
                        path="match"
                        element={
                           <Game
                              initStatePlayer={initStatePlayer}
                              initStateGame={initStateGame}
                              initStateModals={initStateModals}
                              initStateBoard={initStateBoard}
                              initCorpsIds={initCorpsIds}
                              initCardsIds={initCardsIds}
                              initLogItems={initLogItems}
                              type={type}
                              user={user}
                              setUser={setUser}
                           />
                        }
                     />
                  </Routes>
               </Router>
            </div>
         </SettingsContext.Provider>
      </ModalConfirmationContext.Provider>
   )
}

export default App
