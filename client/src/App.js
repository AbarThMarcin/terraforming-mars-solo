import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CARDS } from './data/cards'
import { CORPORATIONS } from './data/corporations'
import { INIT_STATE_BOARD } from './initStates/initStateBoard'
import { getBoardWithNeutral, shuffle } from './util/misc'
import MainMenu from './components/mainMenu/MainMenu'
import Game from './components/game/Game'
import { AuthProvider } from './contexts/AuthContext'

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
      <AuthProvider>
         <div className="app">
            <Router>
               <Routes>
                  <Route path="/" element={<MainMenu qmAction={qmAction} />} />
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
      </AuthProvider>
   )
}

export default App