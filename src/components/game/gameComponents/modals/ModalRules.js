/* Used to show the rules window */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const ModalRules = () => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div
         className="full-size"
         onClick={() => setModals({ ...modals, rules: false, settings: false })}
      >
         <div className="modal-rules center" onClick={(e) => e.stopPropagation()}>RULES</div>
      </div>
   )
}

export default ModalRules
