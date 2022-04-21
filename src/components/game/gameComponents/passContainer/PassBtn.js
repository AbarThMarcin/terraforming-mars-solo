import { useContext } from "react"
import { ModalsContext } from "../../Game"

const PassBtn = ({ onYesFunc }) => {
   const { modals, setModals } = useContext(ModalsContext)
   
   const handleClickPassBtn = () => {
      setModals({
         ...modals,
         modalConfData: {
            text: "Do you want to pass?\nIf you do so, you won't be able to play until the next generation.",
            onYes: onYesFunc,
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      <div className="pass-btn pointer" onClick={handleClickPassBtn}>
         Pass
      </div>
   )
}

export default PassBtn
