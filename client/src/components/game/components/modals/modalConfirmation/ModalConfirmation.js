/* Used to show confirmation window */
import { useContext, useState } from 'react'
import { ModalsContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'

const ModalConfirmation = () => {
   const { modals } = useContext(ModalsContext)
   const [loading, setLoading] = useState(false)

   const btnActionYesPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '35%',
      transform: 'translate(-50%, 100%)',
   }
   const btnActionNoPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '65%',
      transform: 'translate(-50%, 100%)',
   }

   return (
      <div className="modal-confirmation center">
         <span>{modals.modalConf.text}</span>
         <BtnAction
            text="YES"
            onYesFunc={async () => {
               setLoading(true)
               await modals.modalConf.onYes()
               setLoading(false)
            }}
            disabled={loading}
            position={btnActionYesPosition}
            allowDespiteReplay={true}
         />
         <BtnAction text="NO" position={btnActionNoPosition} allowDespiteReplay={true} />
      </div>
   )
}

export default ModalConfirmation
