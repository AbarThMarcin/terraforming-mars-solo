import { useContext } from "react"
import { ModalsContext, StateGameContext } from "../components/game"
import { ACTIONS_GAME } from "../stateActions/actionsGame"
import { OPTION_ICONS } from "../data/selectOneOptions"
import { funcUpdateLogItemAction } from "../data/log"
import { SoundContext } from "../App"

export const useSubactionSelectOption = ({ energyAmount, heatAmount, selectedOption }) => {
   const { stateGame, dispatchGame, getOptionsActions, performSubActions, setLogItems } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const onConfirmPowerInfra = () => {
      sound.btnGeneralClick.play()
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `option: ${energyAmount}`)

      let subActions = getOptionsActions(OPTION_ICONS.CARD194_OPTION1, energyAmount, 0)
      setModals((prev) => ({ ...prev, selectOne: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   const onConfirmInsulation = () => {
      sound.btnGeneralClick.play()
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `option: ${heatAmount}`)

      let subActions = getOptionsActions(OPTION_ICONS.CARD152_OPTION1, 0, heatAmount)
      setModals((prev) => ({ ...prev, selectOne: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   const onConfirmSelectOption = () => {
      sound.btnGeneralClick.play()
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `option: ${selectedOption}`)

      let subActions = [...getOptionsActions(selectedOption), ...stateGame.actionsLeft]
      setModals((prev) => ({ ...prev, selectOne: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
      performSubActions(subActions)
   }

   return { onConfirmPowerInfra, onConfirmInsulation, onConfirmSelectOption}
}
