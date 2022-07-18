import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { addNeutralTiles } from './utils/misc'
import { INIT_STATE_PLAYER } from './initStates/initStatePlayer'
import { INIT_STATE_GAME } from './initStates/initStateGame'
import { INIT_MODALS } from './initStates/initModals'
import { INIT_BOARD } from './initStates/initBoard'
import { LOG_TYPES } from './data/log'
import Menu from './components/mainMenu/pages/Menu'
import Stats from './components/mainMenu/pages/Stats'
import Settings from './components/mainMenu/pages/Settings'
import Rules from './components/mainMenu/pages/Rules'
import Credits from './components/mainMenu/pages/Credits'
import Login from './components/mainMenu/pages/Login'
import Register from './components/mainMenu/pages/Register'
import Account from './components/mainMenu/pages/Account'
import Game from './components/game/Game'
import MainMenu from './components/mainMenu/MainMenu'
import { createActiveGameData, getActiveGameData, getRandIntNumbers } from './api/apiActiveGame'
import { updateUser } from './api/apiUser'

function App() {
   const [user, setUser] = useState(null)
   const [initStatePlayer, setInitStatePlayer] = useState()
   const [initStateGame, setInitStateGame] = useState()
   const [initStateModals, setInitStateModals] = useState()
   const [initStateBoard, setInitStateBoard] = useState()
   const [initCorpsIds, setInitCorpsIds] = useState()
   const [initCardsIds, setInitCardsIds] = useState()
   const [initLogItems, setInitLogItems] = useState()
   const [isRanked, setIsRanked] = useState()

   useEffect(() => {
      const user = localStorage.getItem('user')
      if (user) setUser(JSON.parse(user))
   }, [])

   async function setData(isRanked, restartMatch = false) {
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
         const matchStarted = isRanked ? user.rankedMatchOn : user.quickMatchOn
         if (restartMatch || !matchStarted) {
            // Game not started
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
               isRanked
            )
            // Update user by changing quickMatchOn
            const { data } = await updateUser(user.token, {
               quickMatchOn: isRanked ? user.quickMatchOn : true,
               rankedMatchOn: isRanked ? true : user.rankedMatchOn,
            })
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
         } else {
            // Game already started
            gameData = await getActiveGameData(user.token, isRanked)
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
      setIsRanked(isRanked)
   }

   async function initNewGame(gameData) {
      gameData.statePlayer = INIT_STATE_PLAYER
      gameData.stateGame = INIT_STATE_GAME
      gameData.stateModals = INIT_MODALS
      gameData.stateBoard = addNeutralTiles(INIT_BOARD)
      gameData.corps = await getRandIntNumbers(2, 1, 12)
      gameData.initCards = await getRandIntNumbers(10, 1, 208)
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
      <div className="app">
         <Router>
            <Routes>
               <Route path="/" element={<MainMenu />}>
                  <Route index element={<Menu user={user} setData={setData} logout={logout} />} />
                  <Route path="stats" element={<Stats />} />
                  <Route path="settings" element={<Settings user={user} setUser={setUser} />} />
                  <Route path="rules" element={<Rules />} />
                  <Route path="credits" element={<Credits />} />
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
                        isRanked={isRanked}
                        user={user}
                        setUser={setUser}
                     />
                  }
               />
            </Routes>
         </Router>
      </div>
   )
}

export default App
