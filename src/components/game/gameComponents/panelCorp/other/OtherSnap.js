import { useContext } from 'react'
import { ModalsContext } from '../../../Game'

const OtherSnap = ({ icon, headerForModal, amountForModal, dataForModal }) => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div
         className="other-snap pointer"
         onClick={() =>
            setModals({
               ...modals,
               modalOther: {
                  header: headerForModal,
                  amount: amountForModal,
                  data: dataForModal,
               },
               other: true,
            })
         }
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
