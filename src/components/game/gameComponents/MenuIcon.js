import { useContext } from 'react'
import { ModalsContext } from '../Game'

const MenuIcon = () => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickMenuIcon = () => {
      setModals({ ...modals, menu: !modals.menu, settings: false })
   }
   return <div className="menu-icon pointer" onClick={handleClickMenuIcon}>MENU</div>
}

export default MenuIcon
