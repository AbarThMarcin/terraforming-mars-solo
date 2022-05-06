import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../Game'
import panelStateGame from '../../../assets/images/panelStateGame.png'
import { scale } from '../../../util/misc'
import AnimTemperature from './animations/AnimTemperature'

const PanelStateGame = () => {
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   const tempHeight = {
      height: `${7 + 3.1 * scale(stateGame.globalParameters.temperature, -30, 8, 0, 19)}%`,
   }
   const oxHeight = {
      height: `${8.5 + 4.15 * stateGame.globalParameters.oxygen}%`,
   }

   return (
      <div className="panel-state-game">
         <img src={panelStateGame} alt="panelStateGame" />
         <span className="panel-state-game-text gen">{stateGame.generation}</span>

         {!modals.animationData.temperature.type && (
            <div className="panel-state-game-temp-cont" style={tempHeight}>
               <span className="panel-state-game-text temp">
                  {stateGame.globalParameters.temperature}
               </span>
            </div>
         )}
         {modals.animationData.temperature.type !== null && <AnimTemperature />}

         <div className="panel-state-game-ox-cont" style={oxHeight}>
            <span className="panel-state-game-text ox">{stateGame.globalParameters.oxygen}</span>
         </div>

         <span className="panel-state-game-text oceans">{stateGame.globalParameters.oceans}</span>
      </div>
   )
}

export default PanelStateGame
