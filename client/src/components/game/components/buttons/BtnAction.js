import { useContext } from 'react'
import { ActionsContext, ModalsContext, UserContext } from '../../../game'
import mlnIcon from '../../../../assets/images/resources/res_mln.svg'
import { INIT_ACTIONS } from '../../../../initStates/initActions'
import { SoundContext } from '../../../../App'
import { MATCH_TYPES } from '../../../../data/app'

const BtnAction = ({ text, mln, textConfirmation, onYesFunc, disabled, position, onMouseDownFunc, allowDespiteReplay = false }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { setActions } = useContext(ActionsContext)
   const { type } = useContext(UserContext)
   const { sound } = useContext(SoundContext)

   const handleClickActionBtn = () => {
      // If Button is disabled
      if (disabled) return
      // If replay mode but not corps NEXT button
      if (type === MATCH_TYPES.REPLAY && !allowDespiteReplay) return
      // If Button is CANCEL in sellCards phase
      if (text === 'CANCEL' && modals.sellCards) {
         sound.btnGeneralClick.play()
         setModals((prev) => ({ ...prev, sellCards: false }))
         setActions(INIT_ACTIONS)
         return
      }
      // If Button is NO in confirmation phase
      if (text === 'NO' && modals.confirmation) {
         sound.btnGeneralClick.play()
         setModals((prev) => ({ ...prev, confirmation: false }))
         return
      }
      // If Button requires confirmation
      if (textConfirmation) {
         sound.btnGeneralClick.play()
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
