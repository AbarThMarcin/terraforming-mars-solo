import { useContext } from 'react'
import BtnPass from '../buttons/BtnPass'
import PassCorpSnap from './PassCorpSnap'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import AnimProdRes from '../animations/AnimProdRes'
import { modifiedCards } from '../../../../util/misc'

const PassContainer = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame } = useContext(StateGameContext)

   const onYesFunc = () => {
      // Close confirmation window
      setModals({ ...modals, confirmation: false })
      // Move production amounts to resources (+ TR to mln resource AND energy res to heat res)
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_MLN,
         payload: statePlayer.production.mln + stateGame.tr,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
         payload: statePlayer.production.steel,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
         payload: statePlayer.production.titan,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_PLANT,
         payload: statePlayer.production.plant,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
         payload: statePlayer.production.heat + statePlayer.resources.energy,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_RES_ENERGY,
         payload: statePlayer.production.energy - statePlayer.resources.energy,
      })
      // Set actionUsed = false for all cards played and trRaised (for UNMI only) = false
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_ACTION_USED, payload: { actionUsed: false } })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: false })
      // Set special design and indentured workers effects to false
      if (statePlayer.specialDesignEffect) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
      }
      if (statePlayer.indenturedWorkersEffect) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: modifiedCards(statePlayer.cardsInHand, statePlayer, null, false),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: modifiedCards(statePlayer.cardsPlayed, statePlayer, null, false),
         })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
      }
      // Move to next generation
      dispatchGame({ type: ACTIONS_GAME.INCREMENT_GEN })
      // Turn Phase Draft on
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
      setModals({ ...modals, draft: true })
   }

   return (
      <>
         <div className="pass-container">
            {!stateGame.phaseDraft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState && <BtnPass onYesFunc={onYesFunc} />}
            <PassCorpSnap />
            {modals.animation && (
               <>
                  {modals.animationData.productionIn.type !== null && (
                     <AnimProdRes type="prod-in" />
                  )}
                  {modals.animationData.productionOut.type !== null && (
                     <AnimProdRes type="prod-out" />
                  )}
                  {modals.animationData.resourcesIn.type !== null && <AnimProdRes type="res-in" />}
                  {modals.animationData.resourcesOut.type !== null && (
                     <AnimProdRes type="res-out" />
                  )}
               </>
            )}
         </div>
      </>
   )
}

export default PassContainer
