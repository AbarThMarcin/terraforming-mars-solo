import { useContext } from 'react'
import { ModalsContext, StateGameContext } from '../../../game'
import { SoundContext } from '../../../../App'

const BtnLog = () => {
   const { stateGame } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="btn-cards-played-log pointer"
         onClick={() => {
            if (!stateGame.replayActionId) {
               sound.btnGeneralClick.play()
               setModals((prev) => ({ ...prev, log: true }))
            }
         }}
      >
         LOG
      </div>
   )
}

export default BtnLog
