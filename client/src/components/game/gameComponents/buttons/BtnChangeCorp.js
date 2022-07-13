import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { ModalsContext } from '../../Game'
import { useContext } from 'react'

const BtnChangeCorp = ({ dispatchGame, statePlayer, dispatchPlayer }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickChangeCorpBtn = () => {
      // Reset player state
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 8 })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: false })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS,
         payload: -statePlayer.globParamReqModifier,
      })
      // Reset game state
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: true })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Go back to modals.corps
      setModals({ ...modals, corps: true, draft: false })
   }

   return (
      <div className="btn-change-corp pointer" onClick={handleClickChangeCorpBtn}>
         CHANGE CORPORATION
      </div>
   )
}

export default BtnChangeCorp
