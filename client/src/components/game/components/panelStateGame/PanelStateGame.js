import { memo, useContext } from 'react'
import { StateGameContext } from '../../../game'
import panelStateGame from '../../../../assets/images/panelStateGame.svg'
import { scale } from '../../../../utils/misc'

const PanelStateGame = () => {
   const { stateGame } = useContext(StateGameContext)

   const tempHeight = {
      height: `${4.1 + 2.93 * scale(stateGame.globalParameters.temperature, -30, 8, 0, 19)}%`,
   }
   const oxHeight = {
      height: `${4.1 + 3.98 * stateGame.globalParameters.oxygen}%`,
   }
   
   return (
      <>
         {/* Background */}
         <img src={panelStateGame} alt="panelStateGame" />
         {/* Generation */}
         <span className="gen-text">GEN</span>
         <span className="gen">{stateGame.generation}</span>
         {/* Ox/ Temp  counters */}
         <span className="ox-numbers">
            14
            <br />
            13
            <br />
            12
            <br />
            11
            <br />
            10
            <br />9<br />8<br />7<br />6<br />5<br />4<br />3<br />2<br />1<br />0
         </span>
         <span className="temp-numbers">
            8<br />6<br />4<br />2<br />0<br />
            -2
            <br />
            -4
            <br />
            -6
            <br />
            -8
            <br />
            -10
            <br />
            -12
            <br />
            -14
            <br />
            -16
            <br />
            -18
            <br />
            -20
            <br />
            -22
            <br />
            -24
            <br />
            -26
            <br />
            -28
            <br />
            -30
         </span>
         {/* Temperature */}
         <div className="temp-container" style={tempHeight}>
            <span className="current-value">{stateGame.globalParameters.temperature}</span>
         </div>
         {/* Oxygen */}
         <div className="ox-container" style={oxHeight}>
            <span className="current-value">{stateGame.globalParameters.oxygen}</span>
         </div>
         {/* Oceans */}
         <div className="oceans-container">
            <span className="oceans">{stateGame.globalParameters.oceans}</span>
            <span>/9</span>
         </div>
      </>
   )
}

export default memo(PanelStateGame)
