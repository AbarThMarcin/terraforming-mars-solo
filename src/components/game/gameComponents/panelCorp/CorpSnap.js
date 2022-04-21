import { useContext } from 'react'
import { ModalsContext, StatePlayerContext } from '../../Game'

const CorpSnap = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div className="corp-snap pointer" onClick={() => setModals({ ...modals, corp: true })}>
         {statePlayer.corporation.name}
      </div>
   )
}

export default CorpSnap
