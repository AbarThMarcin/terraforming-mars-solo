import { useContext } from 'react'
import PassBtn from './PassBtn'
import PassCorpSnap from './PassCorpSnap'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/dispatchPlayer'
import { ACTIONS_GAME } from '../../../../util/dispatchGame'

const PassContainer = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame } = useContext(StateGameContext)

   const onYesFunc = () => {
      // Close confirmation window
      setModals({ ...modals, confirmation: false })
      // Move production amounts to resources (+ TR to mln resource)
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_MLN,
         payload: statePlayer.production.mln + stateGame.tr,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
         payload: statePlayer.production.steel,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
         payload: statePlayer.production.titan,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_PLANTS,
         payload: statePlayer.production.plants,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
         payload: statePlayer.production.heat + statePlayer.resources.power,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_POWER,
         payload: statePlayer.production.power - statePlayer.resources.power,
      })
      // Move to next generation
      dispatchGame({ type: ACTIONS_GAME.INCREMENT_GEN })
      // Turn Phase Draft on
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
      setModals({ ...modals, draft: true })
   }

   return (
      <>
         <div className="pass-container">
            {!stateGame.phaseDraft && <PassBtn onYesFunc={onYesFunc} />}
            <PassCorpSnap />
         </div>
      </>
   )
}

export default PassContainer
