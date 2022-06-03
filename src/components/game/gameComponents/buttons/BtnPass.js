import { useContext } from 'react'
import { ModalsContext } from '../../Game'

const BtnPass = ({ onYesFunc }) => {
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickPassBtn = () => {
      setModals({
         ...modals,
         modalConf: {
            text: "Do you want to pass?\nIf you do so, you won't be able to play until the next generation.",
            onYes: onYesFunc,
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      <div className="btn-pass pointer" onClick={handleClickPassBtn}>
         <span>PASS</span>
      </div>
   )
}

export default BtnPass
