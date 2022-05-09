import { useContext } from 'react'
import { StateGameContext } from '../Game'
import panelStateGame from '../../../assets/images/panelStateGame.png'
import { scale } from '../../../util/misc'

const PanelStateGame = () => {
   const { stateGame } = useContext(StateGameContext)

   const tempHeight = {
      height: `${7 + 3.1 * scale(stateGame.globalParameters.temperature, -30, 8, 0, 19)}%`,
   }
   const oxHeight = {
      height: `${8.5 + 4.15 * stateGame.globalParameters.oxygen}%`,
   }

   return (
      <div className="panel-state-game">
         {/* Background */}
         <img src={panelStateGame} alt="panelStateGame" />
         {/* Generation */}
         <span className="panel-state-game-text gen">{stateGame.generation}</span>
         {/* Temperature */}
         <div className="panel-state-game-temp-cont" style={tempHeight}>
            <span className="panel-state-game-text temp">
               {stateGame.globalParameters.temperature}
            </span>
         </div>
         {/* Oxygen */}
         <div className="panel-state-game-ox-cont" style={oxHeight}>
            <span className="panel-state-game-text ox">{stateGame.globalParameters.oxygen}</span>
         </div>
         {/* Oceans */}
         <span className="panel-state-game-text oceans">{stateGame.globalParameters.oceans}</span>
      </div>
   )
}

export default PanelStateGame
