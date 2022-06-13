/* Used to show confirmation window */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import BtnAction from '../buttons/BtnAction'

const ModalConfirmation = () => {
   const { modals } = useContext(ModalsContext)

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
         <BtnAction text="YES" onYesFunc={modals.modalConf.onYes} position={btnActionYesPosition} />
         <BtnAction text="NO" position={btnActionNoPosition} />
      </div>
   )
}

export default ModalConfirmation
