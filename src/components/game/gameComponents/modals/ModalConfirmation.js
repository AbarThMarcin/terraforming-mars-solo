/* Used to show confirmation window */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import BtnAction from '../buttons/BtnAction'

const ModalConfirmation = () => {
   const { modals } = useContext(ModalsContext)

   const btnActionYesPosition = { bottom: '0%', left: '35%', transform: 'translate(-50%, 100%)' }
   const btnActionNoPosition = { bottom: '0%', left: '65%', transform: 'translate(-50%, 100%)' }

   return (
      <div className="modal-background">
         <div className="modal-confirmation center">
            {modals.modalConf.text}
            <BtnAction
               text="YES"
               onYesFunc={modals.modalConf.onYes}
               position={btnActionYesPosition}
            />
            <BtnAction text="NO" position={btnActionNoPosition} />
         </div>
      </div>
   )
}

export default ModalConfirmation
