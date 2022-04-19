import { useContext } from 'react'
import { StatePlayerContext, ModalsContext } from '../../../Game'

const Action = ({ icon, name, cost, action, textConf }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickBtn = () => {
      if (statePlayer.resources.mln < cost) return
      setModals({
         ...modals,
         modalConfData: {
            text: textConf,
            onYes: onYesFunc,
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   const onYesFunc = () => {
      setModals({ ...modals, confirmation: false, standardProjects: false })
      console.log('executing standard project')
   }

   return (
      <div className={`action ${statePlayer.resources.mln < cost && 'disabled'}`}>
         <div className="action-element action-icon">{icon.url}</div>
         <div className="action-element action-name">{name}</div>
         <div className="action-element action-cost">{cost}</div>
         <div className="action-element action-btn" onClick={handleClickBtn}>
            BTN
         </div>
      </div>
   )
}

export default Action
