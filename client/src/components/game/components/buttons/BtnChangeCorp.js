import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { ModalsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import { useContext } from 'react'

const BtnChangeCorp = ({ dispatchGame, statePlayer, dispatchPlayer }) => {
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleClickChangeCorpBtn = () => {
      sound.btnGeneralClick.play()
      // Reset player state
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 8 })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: false })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS,
         payload: -statePlayer.globParamReqModifier,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_VALUE_TITAN,
         payload: statePlayer.valueTitan === 4 ? -1 : 0,
      })
      dispatchGame({ type: ACTIONS_GAME.SET_POWERPLANT_COST, payload: 11 })
      // Reset game state
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: true })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Go back to modals.corps
      setModals((prev) => ({ ...prev, corps: true, draft: false }))
   }

   return (
      <div className="btn-change-corp pointer" onClick={handleClickChangeCorpBtn}>
         CHANGE CORPORATION
      </div>
   )
}

export default BtnChangeCorp
