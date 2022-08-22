import { useContext } from 'react'
import { SoundContext } from '../../../../../App'
import { ModalsContext } from '../../../Game'

const OtherSnap = ({ icon, headerForModal, amountForModal, dataForModal }) => {
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   return (
      <div
         className="other-snap pointer"
         onClick={() => {
            sound.btnSPorOtherSnap.play()
            setModals((prev) => ({
               ...prev,
               modalOther: {
                  header: headerForModal,
                  amount: amountForModal,
                  data: dataForModal,
               },
               other: true,
            }))
         }}
      >
         <div className="header">{headerForModal}</div>
         <div className="data">
            <div className="icon">
               <img src={icon} alt="icon_other_snap" />
            </div>
            <div className="value">{amountForModal}</div>
         </div>
      </div>
   )
}

export default OtherSnap
