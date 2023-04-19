import { useContext, useState } from 'react'
import { ModalsContext } from '../../../game'
import { SoundContext } from '../../../../App'

const BtnConvertPlantsHeat = ({ textConfirmation, action, bg, bgBright }) => {
   const [hovered, setHovered] = useState(false)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleClickCorpAction = () => {
      sound.btnGeneralClick.play()
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: textConfirmation,
            onYes: () => {
               setModals((prev) => ({ ...prev, confirmation: false, cardPlayed: false }))
               action()
            },
            onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
         },
         confirmation: true,
      }))
   }

   return (
      <div
         className="btn-convert-plants-heat pointer"
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
      >
         {hovered ? (
            <img src={bgBright} alt="btn-convert-plants-heat" onClick={handleClickCorpAction} />
         ) : (
            <img src={bg} alt="btn-convert-plants-heat" onClick={handleClickCorpAction} />
         )}
      </div>
   )
}

export default BtnConvertPlantsHeat
