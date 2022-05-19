import { useContext } from 'react'
import { ACTIONS_GAME } from '../../../util/actionsGame'
import { StateGameContext } from '../Game'

const BtnViewGameState = () => {
   const { stateGame, dispatchGame } = useContext(StateGameContext)

   return (
      <div
         className="btn-view-game-state pointer"
         onClick={() => {
            if (stateGame.phaseViewGameState) {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE, payload: false })
            } else {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE, payload: true })
            }
         }}
      >
         {stateGame.phaseViewGameState ? 'RETURN' : 'VIEW GAME STATE'}
      </div>
   )
}

export default BtnViewGameState
