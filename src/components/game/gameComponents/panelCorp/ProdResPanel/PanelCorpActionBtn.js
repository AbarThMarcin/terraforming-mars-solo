import { useContext } from 'react'
import { ModalsContext } from '../../../Game'

const PanelCorpActionBtn = ({ textConfirmation, action, bg }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickCorpAction = () => {
      setModals({
         ...modals,
         modalConfData: {
            text: textConfirmation,
            onYes: () => {
               setModals({ ...modals, confirmation: false })
               action()
            },
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return <img src={bg} className="panel-corp-action-btn pointer" alt='' onClick={handleClickCorpAction} />
}

export default PanelCorpActionBtn
