import { useContext } from 'react'
import { ModalsContext, StateGameContext } from '../../../game'
import { SoundContext } from '../../../../App'

const BtnConvertPlantsHeat = ({ textConfirmation, action, bg }) => {
   const { dataForReplay } = useContext(StateGameContext)
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
      <div className={`btn-convert-plants-heat${!dataForReplay ? ' pointer' : ''}`}>
         <img
            src={bg}
            alt="btn-convert-plants-heat"
            onClick={() => {
               if (dataForReplay) return
               handleClickCorpAction()
            }}
         />
      </div>
   )
}

export default BtnConvertPlantsHeat
