import { useContext } from "react"
import { StateGameContext } from "../.."

const BtnCoordinates = ({ showCoordinates, setShowCoordinates }) => {
   const { stateGame } = useContext(StateGameContext)

   return (
      <div className="board-btn pointer" onClick={() => {
         if (stateGame.replayActionId) return
         setShowCoordinates((prev) => !prev)}
      }>
         {showCoordinates ? 'HIDE' : 'SHOW'} COORDINATES
      </div>
   )
}

export default BtnCoordinates
