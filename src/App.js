import { useState } from 'react'
import Game from './components/game/Game'
import { CARDS } from './data/cards'
import { CORPORATIONS } from './data/corporations'
import { BOARD } from './data/board'
import { getBoardWithNeutral, shuffle } from './util/misc'
import MainMenu from './components/mainMenu/MainMenu'
export var shuffledCorps
export var shuffledCards
export var randomBoard

function App() {
   const [gameOn, setGameOn] = useState(false)
   const handleClickStartGame = () => {
      randomBoard = JSON.parse(JSON.stringify(BOARD))
      shuffledCorps = shuffle(CORPORATIONS)
      shuffledCards = shuffle(CARDS)
      randomBoard = getBoardWithNeutral(randomBoard)
      setGameOn(true)
   }

   return (
      <div className="app">
         {!gameOn && <MainMenu startGame={handleClickStartGame} />}
         {gameOn && <Game setGameOn={setGameOn} />}
      </div>
   )
}

export default App
