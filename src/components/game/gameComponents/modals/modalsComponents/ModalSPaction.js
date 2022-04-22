import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'

const ModalSPaction = ({
   icon,
   name,
   cost,
   textConfirmation,
   actionClicked,
   setActionClicked,
   changeSPcosts,
   handleUseSP,
}) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickBtn = () => {
      // No action if cost is higher than resources
      if (statePlayer.resources.mln < cost) return
      // If clicked SELL PATENT
      if (name === 'SELL PATENT') {
         setModals({...modals, sellCards: true})
         return
      }
      // For Helion only: first click turns 'Decrease Cost with heat' minimodal,
      // second click turns confirmation modal
      if (statePlayer.canPayWithHeat && name !== 'SELL PATENT') {
         if (actionClicked === null || actionClicked !== name) {
            setActionClicked(name)
            changeSPcosts(undefined, name)
            return
         }
      }
      setModals({
         ...modals,
         modalConfData: {
            text: textConfirmation,
            onYes: () => handleUseSP(name),
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   return (
      <div className={`action ${statePlayer.resources.mln < cost && 'disabled'}`}>
         <div className="action-element action-icon">{icon.url}</div>
         <div className="action-element action-name">{name}</div>
         <div className="action-element action-cost">{cost}</div>
         <div
            className={`action-element action-btn ${
               statePlayer.resources.mln >= cost && 'pointer'
            }`}
            onClick={handleClickBtn}
         >
            BTN
         </div>
      </div>
   )
}

export default ModalSPaction
