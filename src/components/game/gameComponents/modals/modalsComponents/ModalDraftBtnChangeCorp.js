import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../../util/actionsPlayer'
import { ModalsContext } from '../../../Game'
import { useContext } from 'react'

const ModalDraftBtnChangeCorp = ({ dispatchGame, dispatchPlayer }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickChangeCorpBtn = () => {
      // Reset player state
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 8 })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: false })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_PARAMETERS_REQUIREMENTS, payload: 0 })
      // Reset game state
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: true })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Go back to modals.corps
      setModals({ ...modals, corps: true, draft: false })
   }

   return (
      <div className="modal-draft-change-corp-btn pointer" onClick={handleClickChangeCorpBtn}>
         ChangeCorpBtn
      </div>
   )
}

export default ModalDraftBtnChangeCorp
