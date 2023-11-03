import { useContext } from "react"
import { ActionsContext, ModalsContext, StateGameContext, StatePlayerContext } from "../components/game"
import { ANIMATIONS } from "../data/animations"
import { RESOURCES } from "../data/resources"
import { ACTIONS_PLAYER } from "../stateActions/actionsPlayer"
import { LOG_ICONS, LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLogItemAction } from "../data/log"
import { SP } from "../data/StandardProjects"
import { INIT_ACTIONS } from "../initStates/initActions"
import { SoundContext } from "../App"

export const useSubactionSellPatents = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { actions, setActions } = useContext(ActionsContext)
   const { sound } = useContext(SoundContext)

   const handleClickBtnSelect = (cardId) => {
      sound.btnSelectClick.play()
      if (!actions.ids.includes(cardId)) {
         setActions((prev) => ({ ...prev, ids: [...prev.ids, cardId], mln: prev.mln + 1 }))
      } else {
         setActions((prev) => ({ ...prev, ids: prev.ids.filter((id) => id !== cardId), mln: prev.mln - 1 }))
      }
   }

   const onYesFunc = () => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.SP_ACTION, title: SP.SELL_PATENT, titleIcon: LOG_ICONS.SELL_PATENT }, setItemsExpanded)
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `spSellPatent[ids: ${actions.ids.join(', ')}]`)

      let subActions = []
      // Dismount confirmation, sellCards and standardProjects modals
      setModals((prev) => ({
         ...prev,
         confirmation: false,
         sellCards: false,
         standardProjects: false,
         cardPlayed: false,
      }))
      // Add removal of selected cards to the subActions
      subActions.push({
         name: ANIMATIONS.CARD_OUT,
         type: RESOURCES.CARD,
         value: actions.mln,
         func: () => {
            dispatchPlayer({
               type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
               payload: statePlayer.cardsInHand.filter((c) => !actions.ids.includes(c.id)),
            })
            funcSetLogItemsSingleActions(actions.mln === 1 ? 'Sold 1 card' : `Sold ${actions.mln} cards`, RESOURCES.CARD, -actions.mln, setLogItems)
         },
      })
      // Add mln addition to the subAction
      subActions.push({
         name: ANIMATIONS.RESOURCES_IN,
         type: RESOURCES.MLN,
         value: actions.mln,
         func: () => {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: actions.mln })
            funcSetLogItemsSingleActions(`Received ${actions.mln} MC`, RESOURCES.MLN, actions.mln, setLogItems)
         },
      })
      // Perform subActions
      performSubActions(subActions)

      setActions(INIT_ACTIONS)
   }

   return { handleClickBtnSelect, onYesFunc }
}
