import { useContext, useState } from 'react'
import { ModalsContext } from '../../Game'

const BtnConvertPlantsHeat = ({ textConfirmation, action, bg, bgBright }) => {
   const [hovered, setHovered] = useState(false)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickCorpAction = () => {
      setModals({
         ...modals,
         modalConf: {
            text: textConfirmation,
            onYes: () => {
               setModals({ ...modals, confirmation: false, cardPlayed: false })
               action()
            },
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      <div className="btn-convert-plants-heat pointer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
         {hovered ? (
            <img
               src={bgBright}
               alt="btn-convert-plants-heat"
               onClick={handleClickCorpAction}
            />
         ) : (
            <img
               src={bg}
               alt="btn-convert-plants-heat"
               onClick={handleClickCorpAction}
            />
         )}
      </div>
   )
}

export default BtnConvertPlantsHeat
