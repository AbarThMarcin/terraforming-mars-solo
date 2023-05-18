import { useContext } from "react"
import { StatePlayerContext } from "../.."

const TotalVP = () => {
   const { statePlayer } = useContext(StatePlayerContext)

   return <div className="total-points">Total Points: {statePlayer.totalPoints}</div>
}

export default TotalVP
