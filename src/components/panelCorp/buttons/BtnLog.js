import { useContext } from 'react'
import { ModalsContext } from '../../../Game'

const BtnLog = () => {
   const { modals, setModals } = useContext(ModalsContext)

   return (
      <div className="panel-corp-btn btn-log" onClick={() => setModals({...modals, log: true})}>
         LOG
      </div>
   )
}

export default BtnLog
