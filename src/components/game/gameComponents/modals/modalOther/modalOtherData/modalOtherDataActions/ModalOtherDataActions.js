import { useContext } from 'react'
import { ModalsContext, StatePlayerContext } from '../../../../../Game'
import ModalOtherDataActionsItem from './ModalOtherDataActionsItem'

const ModalOtherDataActions = ({ setCardSnap }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)

   return (
      <div className="modal-other-data center">
         {statePlayer.corporation.name === 'UNMI' && (
            <ModalOtherDataActionsItem item={statePlayer.corporation} setCardSnap={setCardSnap} />
         )}
         {modals.modalOther.data.map((item, idx) => (
            <ModalOtherDataActionsItem key={idx} item={item} setCardSnap={setCardSnap} />
         ))}
      </div>
   )
}

export default ModalOtherDataActions
