/* Used to view one card for use only */
import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, UserContext, StateBoardContext } from '../../../../game'
import { ACTIONS_PLAYER } from '../../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import { getNewCardsDrawIds, hasTag, withTimePlayed } from '../../../../../utils/misc'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../../data/animations'
import { RESOURCES, getResIcon } from '../../../../../data/resources'
import { TAGS } from '../../../../../data/tags'
import Card from '../../card/Card'
import DecreaseCost from '../modalsComponents/decreaseCost/DecreaseCost'
import BtnAction from '../../buttons/BtnAction'
import { LOG_TYPES, funcSetLogItemsBefore, funcSetLogItemsSingleActions } from '../../../../../data/log/log'
import { getImmEffectIcon } from '../../../../../data/immEffects/immEffectsIcons'
import { SoundContext } from '../../../../../App'
import { EFFECTS } from '../../../../../data/effects/effectIcons'

const ModalCardWithAction = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, requirementsMet, ANIMATION_SPEED, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const [toBuyTitan, setToBuyTitan] = useState(getInitToBuyTitan())
   const [toBuySteel, setToBuySteel] = useState(getInitToBuySteel())
   const [toBuyHeat, setToBuyHeat] = useState(getInitToBuyHeat())
   const [toBuyMln, setToBuyMln] = useState(getInitToBuyMln())
   const [disabled, setDisabled] = useState(getDisabled())

   const btnActionPosition = { bottom: '0', left: '43.5%', transform: 'translate(-50%, 100%)' }

   function getInitToBuyTitan() {
      if (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE)) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln

         if (diff > 0) {
            if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) {
               if (statePlayer.valueTitan - statePlayer.valueSteel === 1 || statePlayer.resources.steel > 1) {
                  return Math.min(Math.floor(diff / statePlayer.valueTitan), statePlayer.resources.titan)
               } else {
                  return Math.min(Math.ceil(diff / statePlayer.valueTitan), statePlayer.resources.titan)
               }
            } else {
               return Math.min(Math.ceil(diff / statePlayer.valueTitan), statePlayer.resources.titan)
            }
         } else {
            return 0
         }
      } else {
         return 0
      }
   }
   function getInitToBuySteel() {
      if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln - toBuyTitan * statePlayer.valueTitan

         if (diff > 0) {
            if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0) {
               if (statePlayer.valueSteel === 2 || statePlayer.resources.heat > 1) {
                  return Math.min(Math.floor(diff / statePlayer.valueSteel), statePlayer.resources.steel)
               } else {
                  return Math.min(Math.ceil(diff / statePlayer.valueSteel), statePlayer.resources.steel)
               }
            } else {
               return Math.min(Math.ceil(diff / statePlayer.valueSteel), statePlayer.resources.steel)
            }
         } else {
            return 0
         }
      } else {
         return 0
      }
   }
   function getInitToBuyHeat() {
      if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln - toBuyTitan * statePlayer.valueTitan - toBuySteel * statePlayer.valueSteel
         if (diff > 0) {
            return Math.min(diff, statePlayer.resources.heat)
         } else {
            return 0
         }
      } else {
         return 0
      }
   }
   function getInitToBuyMln() {
      const diff = Math.max(0, modals.modalCard.currentCost - toBuySteel * statePlayer.valueSteel - toBuyTitan * statePlayer.valueTitan - toBuyHeat)
      return diff
   }

   function getDisabled() {
      // When viewing Game State, disable button
      if (stateGame.phaseViewGameState) return true
      if (stateGame.phasePlaceTile) return true
      // When resources to use the card are not enough, disable button
      if (Math.min(toBuyMln, statePlayer.resources.mln) + toBuySteel * statePlayer.valueSteel + toBuyTitan * statePlayer.valueTitan + toBuyHeat < modals.modalCard.currentCost)
         return true
      // When requirements are not met, disable button
      if (!requirementsMet(modals.modalCard)) return true

      return false
   }

   const onYesFunc = async () => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcSetLogItemsBefore(setLogItems, statePlayer, stateGame, stateBoard, setItemsExpanded)

      // ANIMATIONS
      let animResPaidTypes = []
      if (toBuyMln) animResPaidTypes.push([RESOURCES.MLN, toBuyMln])
      if (toBuySteel) animResPaidTypes.push([RESOURCES.STEEL, toBuySteel])
      if (toBuyTitan) animResPaidTypes.push([RESOURCES.TITAN, toBuyTitan])
      if (toBuyHeat) animResPaidTypes.push([RESOURCES.HEAT, toBuyHeat])
      // Close all modals
      setModals((prev) => ({
         ...prev,
         confirmation: false,
         cardWithAction: false,
         cards: false,
         cardPlayed: true,
      }))

      // For Research, Invention Contest, Lagrange Observatory and Technology Demonstration
      // (which are the only cards, for which Olympus Conference effect is implemented
      // directly in the Immediate Effects), before showing animations and doing actual actions,
      // draw random ids first
      let initDrawCardsIds
      if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
         switch (modals.modalCard.id) {
            case 90:
               initDrawCardsIds = await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, user?.token)
               break
            case 192:
               if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science > 0) {
                  initDrawCardsIds = await getNewCardsDrawIds(4, statePlayer, dispatchPlayer, type, id, user?.token)
               }
               break
            case 196:
               if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science > 0) {
                  initDrawCardsIds = await getNewCardsDrawIds(2, statePlayer, dispatchPlayer, type, id, user?.token)
               }
               break
            case 204:
               if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science > 0) {
                  initDrawCardsIds = await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, user?.token)
               }
               break
            default:
               break
         }
      }
      // ----------------------------------------------------------------------------------------

      startAnimation(setModals)
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setAnimation(ANIMATIONS.RESOURCES_OUT, animResPaidTypes[i][0], animResPaidTypes[i][1], setModals, sound)
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease Corporation Resources
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -toBuySteel })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -toBuyTitan })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         if (toBuyMln) funcSetLogItemsSingleActions(`Paid ${toBuyMln} MC`, getResIcon(RESOURCES.MLN), -toBuyMln, setLogItems)
         if (toBuySteel) funcSetLogItemsSingleActions(`Paid ${toBuySteel} MC`, getResIcon(RESOURCES.STEEL), -toBuySteel, setLogItems)
         if (toBuyTitan) funcSetLogItemsSingleActions(`Paid ${toBuyTitan} MC`, getResIcon(RESOURCES.TITAN), -toBuyTitan, setLogItems)
         if (toBuyHeat) funcSetLogItemsSingleActions(`Paid ${toBuyHeat} MC`, getResIcon(RESOURCES.HEAT), -toBuyHeat, setLogItems)
         // Remove this card from Cards In Hand
         let newCardsInHand = statePlayer.cardsInHand.filter((card) => card.id !== modals.modalCard.id)
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCardsInHand })
         // Add this card to Cards Played
         let newCardsPlayed = [...statePlayer.cardsPlayed, ...withTimePlayed([modals.modalCard])]
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCardsPlayed })
         // Set special design effect to false (if applicable)
         if (statePlayer.specialDesignEffect) {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
            dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
            funcSetLogItemsSingleActions('SPECIAL DESIGN effect ended', null, null, setLogItems)
         }

         // ============== IMMEDIATE EFFECTS AND EFFECTS ==============
         // Add Card immediate actions to the subActions list
         let actions = getImmEffects(modals.modalCard.id, initDrawCardsIds)
         // Add Effects to call that are included in the cardsPlayed effects (and corporation effects) list to the subActions list
         modals.modalCard.effectsToCall.forEach((effect) => {
            if (statePlayer.cardsPlayed.some((card) => card.effect === effect) || statePlayer.corporation.effects.some((corpEffect) => corpEffect === effect))
               actions = [...actions, ...getEffect(effect)]
         })
         // ===========================================================

         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })

         performSubActions(
            actions,
            {
               type: LOG_TYPES.IMMEDIATE_EFFECT,
               text: modals.modalCard.name,
            },
            getImmEffectIcon(modals.modalCard.id)
         )
         // =======================================================
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return (
      <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
         {/* CARD */}
         <Card card={modals.modalCard} isBig={true} />
         {/* CARD BUTTON */}
         {!modals.draft && (
            <>
               <BtnAction
                  text="USE"
                  mln={toBuyMln}
                  textConfirmation={`Do you want to play: ${modals.modalCard.name}`}
                  onYesFunc={onYesFunc}
                  disabled={disabled}
                  position={btnActionPosition}
               />
            </>
         )}
         {/* CARD DECREASE COST SECTION */}
         {((statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) ||
            (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE)) ||
            (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat)) &&
            modals.cardWithAction &&
            !modals.draft && (
               <DecreaseCost
                  toBuyMln={toBuyMln}
                  setToBuyMln={setToBuyMln}
                  toBuySteel={toBuySteel}
                  setToBuySteel={setToBuySteel}
                  toBuyTitan={toBuyTitan}
                  setToBuyTitan={setToBuyTitan}
                  toBuyHeat={toBuyHeat}
                  setToBuyHeat={setToBuyHeat}
                  setDisabled={setDisabled}
               />
            )}
      </div>
   )
}

export default ModalCardWithAction
