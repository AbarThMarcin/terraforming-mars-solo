import { useContext } from 'react'
import { ModalsContext, StateGameContext } from '../components/game'
import { funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { CORP_NAMES } from '../data/corpNames'
import { IMM_EFFECTS } from '../data/immEffects/immEffects'
import { ANIMATIONS } from '../data/animations'
import { SoundContext } from '../App'
import { getCards } from '../utils/cards'

export const useSubactionProduction = () => {
   const { dispatchGame, performSubActions, setLogItems, getImmEffects } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleClickProdCard = (itemIdOrCorpName) => {
      sound.btnSelectClick.play()
      let immProdEffects = []
      // Assign Mining Guild production immediate effect
      if (itemIdOrCorpName === CORP_NAMES.MINING_GUILD) {
         immProdEffects = getImmEffects(IMM_EFFECTS.MINING_GUILD)
         // Assign Mining Area production subAction
      } else if (itemIdOrCorpName === 64) {
         immProdEffects = [modals.modalProduction.miningArea]
         // Assign Mining Rights production subAction
      } else if (itemIdOrCorpName === 67) {
         immProdEffects = [modals.modalProduction.miningRights]
         // Assign Any other card's production subAction
      } else {
         immProdEffects = getImmEffects(itemIdOrCorpName).filter(
            (immProdEffect) => immProdEffect.name === ANIMATIONS.PRODUCTION_IN || immProdEffect.name === ANIMATIONS.PRODUCTION_OUT
         )
      }
      setModals((prev) => ({
         ...prev,
         modalProduction: {
            ...prev.modalProduction,
            cardIdOrCorpName: itemIdOrCorpName,
            immProdEffects: immProdEffects,
         },
      }))
   }

   const handleClickConfirmBtn = () => {
      sound.btnGeneralClick.play()
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `targetId: ${modals.modalProduction.cardIdOrCorpName}`)

      // Turn addRemoveRes phase on
      setModals((prev) => ({ ...prev, production: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: false })
      // Perform subactions
      performSubActions(modals.modalProduction.immProdEffects)
      const v = modals.modalProduction.cardIdOrCorpName
      funcSetLogItemsSingleActions(`Copy of ${v === CORP_NAMES.MINING_GUILD ? CORP_NAMES.MINING_GUILD : getCards(v).name}:`, null, null, setLogItems)
   }

   return { handleClickProdCard, handleClickConfirmBtn }
}
