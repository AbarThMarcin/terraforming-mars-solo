import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../../Game'
import { ACTION_ICONS, getActionIcon } from '../../../../../../../data/cardActions'
import { ACTIONS_GAME } from '../../../../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../../../../util/actionsPlayer'

const ModalOtherDataActionsItem = ({
   item,
   setCardSnap,
   actionClicked,
   setActionClicked,
   toBuyMln,
   toBuySteel,
   toBuyTitan,
   toBuyHeat,
   changeCosts,
}) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { dispatchGame, getCardActions, performSubActions, actionRequirementsMet } =
      useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const isUnmi = item.name === 'UNMI'
   const isAvailable = getAvailability()

   function getAvailability() {
      if (isUnmi) {
         return actionRequirementsMet(item)
      } else {
         if ((item.id === 12 || item.id === 187) && actionClicked) {
            return actionRequirementsMet(item) && toBuyMln <= statePlayer.resources.mln
         } else {
            return actionRequirementsMet(item)
         }
      }
   }

   const handleMouseOverItem = (item) => {
      if (!isUnmi) setCardSnap(item)
   }

   const handleClickAction = () => {
      if (!isAvailable) return
      // Actions with resources to pay
      if (!isUnmi) {
         if (item.id === 12 || item.id === 187) {
            if (actionClicked === null || actionClicked !== item.id) {
               changeCosts(item.id)
               return
            }
         }
      }
      // Other actions
      if (item.id !== 12 && item.id !== 187) setActionClicked(null)
      setModals((prevModals) => ({
         ...prevModals,
         modalConf: {
            text: 'Do you want to use this action?',
            onYes: () => handleUseAction(),
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      }))
   }

   const handleUseAction = () => {
      if (isUnmi) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_ACTION_USED,
            payload: { cardId: item.name, actionUsed: true },
         })
      } else {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_ACTION_USED,
            payload: { cardId: item.id, actionUsed: true },
         })
      }
      let subActions
      if (isUnmi) {
         subActions = getCardActions(item.name)
      } else {
         subActions = getCardActions(item.id)
      }
      setModals({ ...modals, confirmation: false, other: false })
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return (
      <div
         className="modal-other-data-item"
         onMouseOver={() => handleMouseOverItem(item)}
         onMouseLeave={() => setCardSnap(null)}
      >
         <div className="action">
            <img
               src={
                  isUnmi
                     ? getActionIcon(ACTION_ICONS.ACTION_UNMI)
                     : getActionIcon(item.iconNames.action)
               }
               alt={isUnmi ? 'UNMI_action' : item.iconNames.action}
            />
         </div>
         {actionClicked === item.id && <div>{toBuyMln} </div>}
         <button
            className={`btn ${isAvailable ? 'pointer' : 'disabled'}`}
            onClick={handleClickAction}
         >
            USE
         </button>
      </div>
   )
}

export default ModalOtherDataActionsItem
