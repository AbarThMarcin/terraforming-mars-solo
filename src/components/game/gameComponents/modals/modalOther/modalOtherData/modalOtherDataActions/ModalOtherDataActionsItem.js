import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../../Game'
import { ACTION_ICONS, getActionIcon } from '../../../../../../../data/cardActions'
import { ACTIONS_GAME } from '../../../../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../../../../util/actionsPlayer'
import { getActionIdsWithCost } from '../../../../../../../util/misc'
import BtnAction from '../../../../buttons/BtnAction'

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
   
   const btnActionPosition = { right: '-3%', transform: 'scale(0.65)' }

   function getAvailability() {
      if (isUnmi) {
         return actionRequirementsMet(item)
      } else {
         if (getActionIdsWithCost().includes(item.id) && actionClicked === item.id) {
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
      // Change all resources to buy
      let toBuyResources =
         actionClicked === item.id
            ? [toBuyMln, toBuySteel, toBuyTitan, toBuyHeat]
            : changeCosts(item.id)
      // Set which action card id has been clicked
      setActionClicked(() => item.id)
      // Actions with resources to pay - first click
      if (!isUnmi) {
         if (
            (item.id === 12 && statePlayer.resources.titan > 0) ||
            (item.id === 187 && statePlayer.resources.steel > 0) ||
            (getActionIdsWithCost().includes(item.id) &&
               statePlayer.canPayWithHeat &&
               statePlayer.resources.heat > 0)
         ) {
            if (actionClicked === null || actionClicked !== item.id) {
               return
            }
         }
      }
      // Other actions
      if (!getActionIdsWithCost().includes(item.id)) setActionClicked(null)
      setModals((prevModals) => ({
         ...prevModals,
         modalConf: {
            text: 'Do you want to use this action?',
            onYes: () => handleUseAction(toBuyResources),
            onNo: () => {
               setModals({ ...modals, confirmation: false })
               setActionClicked(null)
            },
         },
         confirmation: true,
      }))
   }

   const handleUseAction = (toBuyResources) => {
      // Set action_used to true
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_ACTION_USED,
         payload: { cardId: isUnmi ? item.name : item.id, actionUsed: true },
      })
      let subActions
      subActions = getCardActions(isUnmi ? item.name : item.id, toBuyResources)
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
         {/* CONFIRM BUTTON */}
         <BtnAction
            text="ACTION"
            textConfirmation={`Do you want to play: ${item.name}`}
            onYesFunc={handleClickAction}
            disabled={!isAvailable}
            position={btnActionPosition}
         />
      </div>
   )
}

export default ModalOtherDataActionsItem
