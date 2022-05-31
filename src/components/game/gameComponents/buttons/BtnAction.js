import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const BtnAction = ({ text, mln, textConfirmation, onYesFunc, disabled, position }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickActionBtn = () => {
      // If Button is disabled
      if (disabled) return
      // If Button is CANCEL in sellCards phase
      if (text === 'CANCEL' && modals.sellCards) {
         setModals((prevModals) => ({ ...prevModals, sellCards: false }))
         return
      }
      // If button text is one of the following, perform onYesFunc immediately
      if (
         text === 'YES' ||
         text === 'CONFIRM' ||
         text === 'NEXT' ||
         text === 'DISCARD' ||
         text === 'ACTION' ||
         text === 'CANCEL'
      ) {
         onYesFunc()
         return
      }
      if (text === 'NO') {
         setModals((prevModals) => ({ ...prevModals, confirmation: false }))
         return
      }
      // If Button requires confirmation
      setModals({
         ...modals,
         modalConf: {
            text: textConfirmation,
            onYes: onYesFunc,
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      // Button
      <div
         className={`
            ${text === 'CANCEL' || text === 'NO' ? 'btn-cancel' : 'btn-action'}
            ${disabled ? 'disabled' : 'pointer'}
         `}
         onClick={handleClickActionBtn}
         style={position !== undefined ? position : {}}
      >
         {text}
         {/* Mln Icon */}
         {(text === 'SELL' || text === 'USE' || text === 'DONE') && (
            <div className="btn-action-mlnicon" onClick={(e) => e.stopPropagation()}>
               {mln}
            </div>
         )}
      </div>
   )
}

export default BtnAction
