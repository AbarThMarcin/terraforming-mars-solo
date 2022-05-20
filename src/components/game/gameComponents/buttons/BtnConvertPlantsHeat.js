import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const BtnConvertPlantsHeat = ({ textConfirmation, action, bg }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickCorpAction = () => {
      setModals({
         ...modals,
         modalConf: {
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

   return (
      <img
         src={bg}
         className="btn-convert-plants-heat pointer"
         alt="btn-convert-plants-heat"
         onClick={handleClickCorpAction}
      />
   )
}

export default BtnConvertPlantsHeat
