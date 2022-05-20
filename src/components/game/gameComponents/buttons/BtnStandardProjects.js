import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const BtnStandardProjects = () => {
   const { modals, setModals } = useContext(ModalsContext)
   return (
      <div
         className="btn-standard-projects pointer"
         onClick={() => setModals({ ...modals, standardProjects: true })}
      >
         Standard Projects
      </div>
   )
}

export default BtnStandardProjects
