import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import { SoundContext } from '../../../../App'

const BtnLog = () => {
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="btn-cards-played-log pointer"
         onClick={() => {
            sound.btnGeneralClick.play()
            setModals((prev) => ({ ...prev, log: true }))
         }}
      >
         LOG
      </div>
   )
}

export default BtnLog
