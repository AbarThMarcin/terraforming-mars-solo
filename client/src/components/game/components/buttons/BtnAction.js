import { useContext } from 'react'
import { ModalsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import mlnIcon from '../../../../assets/images/resources/res_mln.svg'

const BtnAction = ({
   text,
   mln,
   textConfirmation,
   onYesFunc,
   disabled,
   position,
   onMouseDownFunc,
}) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleClickActionBtn = () => {
      // If Button is disabled
      if (disabled) return
      sound.btnGeneralClick.play()
      // If Button is CANCEL in sellCards phase
      if (text === 'CANCEL' && modals.sellCards) {
         setModals((prev) => ({ ...prev, sellCards: false }))
         return
      }
      // If Button is NO in confirmation phase
      if (text === 'NO' && modals.confirmation) {
         setModals((prev) => ({ ...prev, confirmation: false }))
         return
      }
      // If Button requires confirmation
      if (textConfirmation) {
         setModals((prev) => ({
            ...prev,
            modalConf: {
               text: textConfirmation,
               onYes: onYesFunc,
               onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
            },
            confirmation: true,
         }))
      } else {
         onYesFunc()
         return
      }
   }

   return (
      // Button
      <div
         className={`
            ${text === 'CANCEL' || text === 'NO' ? 'btn-cancel' : 'btn-action'}
            ${disabled ? 'disabled' : 'pointer'}
         `}
         style={position !== undefined ? position : {}}
         onClick={handleClickActionBtn}
         onMouseDown={onMouseDownFunc}
      >
         {text}
         {/* Mln Icon */}
         {mln !== undefined && (
            <div className="btn-action-mlnicon" onClick={(e) => e.stopPropagation()}>
               <img src={mlnIcon} alt="mln_icon" />
               <span className="center">{mln}</span>
            </div>
         )}
      </div>
   )
}

export default BtnAction
