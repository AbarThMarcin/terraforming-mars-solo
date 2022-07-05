/* Used to show the rules window */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import BtnClose from '../buttons/BtnClose'

const ModalRules = () => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div
         className="full-size"
         onClick={() => setModals({ ...modals, rules: false, settings: false })}
      >
         <div className="modal-rules center" onClick={(e) => e.stopPropagation()}>
            <BtnClose
               onCloseClick={() => setModals((prevModals) => ({ ...prevModals, rules: false }))}
            />
            <div className="header">RULES</div>
            <div className="data">RULES</div>
         </div>
      </div>
   )
}

export default ModalRules