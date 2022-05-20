/* Used to show selected corp */
import { useContext } from 'react'
import { ModalsContext, StatePlayerContext } from '../../Game'
import Corp from '../Corp'

const ModalCorp = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   return (
      <div
         className="modal-background"
         onClick={() => setModals({ ...modals, corp: false })}
      >
         <Corp corp={statePlayer.corporation} />
      </div>
   )
}

export default ModalCorp
