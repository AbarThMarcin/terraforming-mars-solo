import { useContext } from 'react'
import { ModalsContext } from '../Game'

const StandardProjectsBtn = () => {
   const { modals, setModals } = useContext(ModalsContext)
   return (
      <div
         className="standard-projects-btn"
         onClick={() => setModals({ ...modals, standardProjects: true })}
      >
         Standard Projects
      </div>
   )
}

export default StandardProjectsBtn
