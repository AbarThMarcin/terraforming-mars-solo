import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const BtnMenu = () => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickMenuIcon = () => {
      modals.menu
         ? setModals({ ...modals, menu: false, settings: false, rules: false })
         : setModals({ ...modals, menu: true })
   }
   return (
      <div className="btn-menu pointer" onClick={handleClickMenuIcon}>
         MENU
      </div>
   )
}

export default BtnMenu
