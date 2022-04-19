import { useContext } from 'react'
import { StateGameContext } from '../Game'

const PanelStateGame = () => {
   const { stateGame } = useContext(StateGameContext)

   return (
      <div className="panel-state-game">
         <div className="panel-state-game-gen">GEN {stateGame.generation}</div>
         <div className="panel-state-game-oxygen">OX: {stateGame.globalParameters.oxygen}</div>
         <div className="panel-state-game-temp">TEMP: {stateGame.globalParameters.temperature}</div>
         <div className="panel-state-game-oceans">OCEANS: {stateGame.globalParameters.oceans}</div>
      </div>
   )
}

export default PanelStateGame
