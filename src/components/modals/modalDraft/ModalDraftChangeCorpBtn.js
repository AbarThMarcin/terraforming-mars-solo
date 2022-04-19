import { ACTIONS_GAME } from '../../../util/dispatchGame'
import { ACTIONS_PLAYER } from '../../../util/dispatchPlayer'
import { ModalsContext } from '../../../Game'
import { useContext } from 'react'

const ModalDraftChangeCorpBtn = ({ dispatchGame, dispatchPlayer }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickChangeCorpBtn = () => {
      // Reset tags, actions and effects (no VP reset needed because no corp has VP)
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_TAGS, payload: [] })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_ACTIONS, payload: [] })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_EFFECTS, payload: [] })
      // Reset game state
      dispatchGame({ type: ACTIONS_GAME.SET_CORPORATION_PHASE, payload: true })
      dispatchGame({ type: ACTIONS_GAME.SET_DRAFT_PHASE, payload: false })
      // Go back to modals.corps
      setModals({ ...modals, corps: true, draft: false })
   }

   return (
      <div className="modal-draft-change-corp-btn" onClick={handleClickChangeCorpBtn}>
         ChangeCorpBtn
      </div>
   )
}

export default ModalDraftChangeCorpBtn
