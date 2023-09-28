import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../../../game'
import { ACTIONS_GAME } from '../../../../../../../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../../../../../../../stateActions/actionsPlayer'
import { getActionIdsWithCost } from '../../../../../../../utils/misc'
import BtnAction from '../../../../buttons/BtnAction'
import { CORP_NAMES } from '../../../../../../../data/corpNames'
import { LOG_TYPES, funcCreateLogItem } from '../../../../../../../data/log/log'
import { ACTION_ICONS, getActionIcon } from '../../../../../../../data/cardActions/actionIcons'

const ModalOtherDataActionsItem = ({ item, setCardSnap, actionClicked, setActionClicked, toBuyMln, toBuySteel, toBuyTitan, toBuyHeat, changeCosts }) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getCardActions, performSubActions, actionRequirementsMet, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const isUnmi = item.name === CORP_NAMES.UNMI
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
      let itemIdOrUnmi = isUnmi ? item.name : item.id
      let toBuyResources = actionClicked === itemIdOrUnmi ? [toBuyMln, toBuySteel, toBuyTitan, toBuyHeat] : changeCosts(itemIdOrUnmi)
      // Set which action card id has been clicked
      setActionClicked(() => itemIdOrUnmi)
      // Actions with resources to pay - first click
      if (
         (itemIdOrUnmi === 12 && statePlayer.resources.titan > 0) || // Water Import From Europa
         (itemIdOrUnmi === 187 && statePlayer.resources.steel > 0) || // Aquifer Pumping
         (getActionIdsWithCost().includes(itemIdOrUnmi) && statePlayer.canPayWithHeat && statePlayer.resources.heat > 0)
      ) {
         if (actionClicked === null || actionClicked !== itemIdOrUnmi) {
            return
         }
      }
      // Other actions
      if (!getActionIdsWithCost().includes(itemIdOrUnmi)) setActionClicked(null)
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: 'Do you want to use this action?',
            onYes: () => performAction(toBuyResources),
            onNo: () => {
               setModals((prev) => ({ ...prev, confirmation: false }))
               setActionClicked(null)
            },
         },
         confirmation: true,
      }))
   }

   const performAction = (toBuyResources) => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(
         setLogItems,
         statePlayer,
         stateGame,
         { type: LOG_TYPES.CARD_ACTION, title: item.name, titleIcon: isUnmi ? ACTION_ICONS.ACTION_UNMI : item.id },
         setItemsExpanded
      )
      let itemIdOrUnmi = isUnmi ? item.name : item.id
      // Set action_used to true
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_ACTION_USED,
         payload: { cardId: itemIdOrUnmi, actionUsed: true },
      })
      let subActions
      subActions = getCardActions(itemIdOrUnmi, toBuyResources)
      setModals((prev) => ({ ...prev, confirmation: false, other: false, cardPlayed: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return (
      <div className="modal-other-data-item" onMouseOver={() => handleMouseOverItem(item)} onMouseLeave={() => setCardSnap(null)}>
         {/* ICON */}
         <div className="action">
            <img
               style={{ opacity: isAvailable ? 1 : 0.5 }}
               src={isUnmi ? getActionIcon(ACTION_ICONS.ACTION_UNMI) : getActionIcon(item.iconNames.action)}
               alt={isUnmi ? 'UNMI_action' : item.iconNames.action}
            />
         </div>
         {/* CONFIRM BUTTON */}
         <BtnAction text="USE" onYesFunc={handleClickAction} disabled={!isAvailable} position={btnActionPosition} />
      </div>
   )
}

export default ModalOtherDataActionsItem
