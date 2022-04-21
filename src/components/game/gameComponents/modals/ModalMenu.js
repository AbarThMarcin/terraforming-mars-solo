/* Used to show the game menu window */

import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const ModalMenu = ({ setGameOn }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const onYesFunc = () => {
      setGameOn(false)
   }

   const handleClickForfeit = () => {
      setModals({
         ...modals,
         modalConfData: {
            text: 'Do you want to forfeit the game?',
            onYes: onYesFunc,
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      <>
         <div
            className="full-size"
            onClick={() => setModals({ ...modals, menu: false, settings: false })}
         >
            <div className="modal-menu" onClick={(e) => e.stopPropagation()}>
               <ul>
                  <li className='pointer' onClick={() => setModals({ ...modals, settings: !modals.settings })}>
                     SETTINGS
                  </li>
                  <li className='pointer' onClick={handleClickForfeit}>FORFEIT</li>
                  <li className='pointer' onClick={() => setModals({ ...modals, rules: true, settings: false })}>
                     RULES
                  </li>
               </ul>
            </div>
         </div>
      </>
   )
}

export default ModalMenu
