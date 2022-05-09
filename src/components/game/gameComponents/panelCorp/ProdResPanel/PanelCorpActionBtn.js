import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../Game'

const PanelCorpActionBtn = ({ textConfirmation, action, bg }) => {
   const { modals, setModals } = useContext(ModalsContext)
   const { stateGame } = useContext(StateGameContext)

   const handleClickCorpAction = () => {
      if (stateGame.phasePlaceTile) return
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
         className={`panel-corp-action-btn ${!stateGame.phasePlaceTile && 'pointer'}`}
         alt=""
         onClick={handleClickCorpAction}
      />
   )
}

export default PanelCorpActionBtn
