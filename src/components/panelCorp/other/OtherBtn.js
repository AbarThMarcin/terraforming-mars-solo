import { useContext } from 'react'
import { ModalsContext } from '../../../Game'

const OtherBtn = ({ icon, headerForModal, amountForModal, dataForModal }) => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div
         className="other-btn"
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
         <div className="other-btn-header">{headerForModal}</div>
         <div className="other-btn-data">
            <div className="other-btn-icon">{icon}</div>
            <div className="other-btn-value">{amountForModal}</div>
         </div>
      </div>
   )
}

export default OtherBtn
