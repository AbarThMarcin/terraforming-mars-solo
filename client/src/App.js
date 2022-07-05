import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CARDS } from './data/cards'
import { CORPORATIONS } from './data/corporations'
import { INIT_STATE_BOARD } from './initStates/initStateBoard'
import { getBoardWithNeutral, shuffle } from './util/misc'
import Menu from './components/mainMenu/pages/Menu'
import Stats from './components/mainMenu/pages/Stats'
import Settings from './components/mainMenu/pages/Settings'
import Rules from './components/mainMenu/pages/Rules'
import Credits from './components/mainMenu/pages/Credits'
import Login from './components/mainMenu/pages/Login'
import Register from './components/mainMenu/pages/Register'
import ResetPassword from './components/mainMenu/pages/ResetPassword'
import Account from './components/mainMenu/pages/Account'
import Game from './components/game/Game'

function App() {
   const [shuffledCorps, setShuffledCorps] = useState(shuffle(CORPORATIONS))
   const [shuffledCards, setShuffledCards] = useState(shuffle(CARDS))
   const [randomBoard, setRandomBoard] = useState(getRandBoard())

   function qmAction() {
      setShuffledCorps(shuffle(CORPORATIONS))
      setShuffledCards(shuffle(CARDS))
      setRandomBoard(getRandBoard())
   }

   function getRandBoard() {
      let randBoard = JSON.parse(JSON.stringify(INIT_STATE_BOARD))
      randBoard = getBoardWithNeutral(randBoard)
      return randBoard
   }

   return (
      <div className="app">
         <Router>
            <Routes>
               <div className="main-menu">
                  {/* Background, Header & Message */}
                  <div className="bg"></div>
                  <div className="header">
                     TERRAFORMING MARS <span>SOLO</span>
                  </div>
                  <Route path="/" component={Menu} />
                  <Route path="/stats" component={Stats} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/rules" component={Rules} />
                  <Route path="/credits" component={Credits} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/reset-password" component={ResetPassword} />
                  <Route path="/account" component={Account} />
               </div>
               <Route
                  path="quick-match"
                  element={
                     <Game
                        shuffledCorps={shuffledCorps}
                        shuffledCards={shuffledCards}
                        randomBoard={randomBoard}
                     />
                  }
               />
               <Route
                  path="ranked-match"
                  element={
                     <Game
                        shuffledCorps={shuffledCorps}
                        shuffledCards={shuffledCards}
                        randomBoard={randomBoard}
                     />
                  }
               />
            </Routes>
         </Router>
      </div>
   )
}

export default App
