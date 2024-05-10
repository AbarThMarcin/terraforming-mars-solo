import { useContext } from 'react'
import { ActionsContext, ModalsContext, StateGameContext, StatePlayerContext } from '../components/game'
import { LOG_TYPES, funcCreateLogItem, funcUpdateLogItemAction } from '../data/log'
import { getActionIdsWithCost, getCardActionCost } from '../utils/cards'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { ACTION_ICONS } from '../data/cardActions/actionIcons'
import { CORP_NAMES } from '../data/corpNames'
import { SoundContext } from '../App'
import { RESOURCES } from '../data/resources'

export const useActionCardAction = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getCardActions, actionRequirementsMet, performSubActions, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const { actions, setActions } = useContext(ActionsContext)

   const handleClickArrow = (resource, operation) => {
      sound.btnGeneralClick.play()
      const cost = getCardActionCost(actions.id)
      let resMln = actions.mln
      let resSteel = actions.steel
      let resTitan = actions.titan
      let resHeat = actions.heat
      if (operation === 'increment') {
         resource === RESOURCES.STEEL ? resSteel++ : resource === RESOURCES.TITAN ? resTitan++ : resHeat++
      } else if (operation === 'decrement') {
         resource === RESOURCES.STEEL ? resSteel-- : resource === RESOURCES.TITAN ? resTitan-- : resHeat--
      }
      resMln = Math.max(0, cost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resHeat)
      if (resMln === 0 && resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan + resHeat > cost && resHeat > 0)
         resHeat = Math.max(cost - (resSteel * statePlayer.valueSteel + resTitan * statePlayer.valueTitan), 0)

      setActions((prev) => ({ ...prev, mln: resMln, steel: resSteel, titan: resTitan, heat: resHeat }))
   }

   const handleClickAction = (item) => {
      const isAvailable = getAvailability(item)
      if (!isAvailable) return
      sound.btnGeneralClick.play()
      let itemIdOrUnmi = item.name === CORP_NAMES.UNMI ? item.name : item.id
      // Set which action card id has been clicked
      setActions((prev) => ({ ...prev, id: itemIdOrUnmi }))
      let costs
      // If first click, initialize costs and return. Otherwise assign to costs the current values of costs
      if (
         (itemIdOrUnmi === 12 && statePlayer.resources.titan > 0) || // Water Import From Europa
         (itemIdOrUnmi === 187 && statePlayer.resources.steel > 0) || // Aquifer Pumping
         (getActionIdsWithCost().includes(itemIdOrUnmi) && statePlayer.canPayWithHeat && statePlayer.resources.heat > 0)
      ) {
         if (actions.id === null || actions.id !== itemIdOrUnmi) {
            // Set actions to init costs.
            // We don't need to assign result of changeCosts to anything. we need to assign ti a viarbale only in replay mode, using
            // second argument of changeCosts function that does not allow to setActions. It will only return initial costs.
            changeCosts(itemIdOrUnmi)
            // And do not go to the confirmation popup
            return
         }
      }
      // Other actions
      if (!getActionIdsWithCost().includes(itemIdOrUnmi)) setActions((prev) => ({ ...prev, id: null }))
      if (actions.steel || actions.titan || actions.heat) {
         costs = [actions.mln, actions.steel, actions.titan, actions.heat]
      } else {
         costs = changeCosts(itemIdOrUnmi, false)
      }
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: 'Do you want to use this action?',
            onYes: () => onYesFunc(item, costs),
            onNo: () => {
               setModals((prev) => ({ ...prev, confirmation: false }))
               setActions((prev) => ({ ...prev, id: null }))
            },
         },
         confirmation: true,
      }))
   }

   const changeCosts = (itemIdOrUnmi, setCosts = true) => {
      let resMln = 0
      let resSteel = 0
      let resTitan = 0
      let resHeat = 0
      let diff
      let cost = getCardActionCost(itemIdOrUnmi)

      if (statePlayer.resources.titan > 0 && itemIdOrUnmi === 12) {
         diff = cost - statePlayer.resources.mln
         if (diff > 0) resTitan = Math.min(Math.ceil(diff / statePlayer.valueTitan), statePlayer.resources.titan)
      }
      if (statePlayer.resources.steel > 0 && itemIdOrUnmi === 187) {
         diff = cost - statePlayer.resources.mln - resTitan * statePlayer.valueTitan
         if (diff > 0) resSteel = Math.min(Math.ceil(diff / statePlayer.valueSteel), statePlayer.resources.steel)
      }
      diff = cost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan
      resMln = Math.min(diff, statePlayer.resources.mln)
      resHeat = Math.max(0, cost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resMln)

      if (setCosts) setActions((prev) => ({ ...prev, mln: resMln, steel: resSteel, titan: resTitan, heat: resHeat }))

      return [resMln, resSteel, resTitan, resHeat]
   }

   function getAvailability(item) {
      if (item.name === CORP_NAMES.UNMI) {
         return actionRequirementsMet(item)
      } else {
         if (getActionIdsWithCost().includes(item.id) && actions.id === item.id) {
            return actionRequirementsMet(item) && actions.mln <= statePlayer.resources.mln
         } else {
            return actionRequirementsMet(item)
         }
      }
   }

   const onYesFunc = (item, costs) => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      const itemIdOrUnmi = item.name === CORP_NAMES.UNMI ? item.name : item.id
      funcCreateLogItem(
         setLogItems,
         statePlayer,
         stateGame,
         { type: LOG_TYPES.CARD_ACTION, title: item.name, titleIcon: item.name === CORP_NAMES.UNMI ? ACTION_ICONS.ACTION_UNMI : itemIdOrUnmi },
         setItemsExpanded
      )
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `cardAction[id: ${itemIdOrUnmi}]`)
      if (getActionIdsWithCost().includes(itemIdOrUnmi)) {
         if (costs[0]) funcUpdateLogItemAction(setLogItems, `paidMln: ${costs[0]}`)
         if (costs[1]) funcUpdateLogItemAction(setLogItems, `paidSteel: ${costs[1]}`)
         if (costs[2]) funcUpdateLogItemAction(setLogItems, `paidTitan: ${costs[2]}`)
         if (costs[3]) funcUpdateLogItemAction(setLogItems, `paidHeat: ${costs[3]}`)
      }

      // Set action_used to true
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_ACTION_USED, payload: { cardId: itemIdOrUnmi, actionUsed: true } })

      // Perform proper action
      let subActions
      subActions = getCardActions(itemIdOrUnmi, [costs[0], costs[1], costs[2], costs[3]])
      setModals((prev) => ({ ...prev, confirmation: false, other: false, cardPlayed: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return { handleClickArrow, handleClickAction, changeCosts, getAvailability, onYesFunc }
}
