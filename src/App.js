import { useState } from 'react'
import Game from './Game'
import { CARDS } from './data/cards'
import { CORPORATIONS } from './data/corporations'
import { shuffle } from './util/misc' 
import MainMenu from './MainMenu'

export var shuffledCorps
export var shuffledCards

function App() {
   const [gameOn, setGameOn] = useState(false)

   const handleClickStartGame = () => {
      shuffledCorps = shuffle(CORPORATIONS)
      shuffledCards = shuffle(CARDS)
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
