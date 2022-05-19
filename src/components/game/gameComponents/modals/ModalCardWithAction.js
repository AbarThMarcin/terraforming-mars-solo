/* Used to view one card for use only */
import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import { hasTag } from '../../../../util/misc'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import { TAGS } from '../../../../data/tags'
import Card from '../Card'
import CardBtn from './modalsComponents/CardBtn'
import CardDecreaseCost from './modalsComponents/CardDecreaseCost'

const ModalCardWithAction = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const {
      stateGame,
      dispatchGame,
      getImmEffects,
      getEffect,
      performSubActions,
      requirementsMet,
      ANIMATION_SPEED,
   } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [toBuyTitan, setToBuyTitan] = useState(getInitToBuyTitan())
   const [toBuySteel, setToBuySteel] = useState(getInitToBuySteel())
   const [toBuyMln, setToBuyMln] = useState(getInitToBuyMln())
   const [toBuyHeat, setToBuyHeat] = useState(getInitToBuyHeat())
   const [disabled, setDisabled] = useState(getDisabled())

   function getInitToBuyHeat() {
      return Math.max(
         0,
         modals.modalCard.currentCost -
            toBuySteel * statePlayer.valueSteel -
            toBuyTitan * statePlayer.valueTitan -
            toBuyMln
      )
   }

   function getInitToBuyMln() {
      const diff = Math.max(
         0,
         modals.modalCard.currentCost -
            toBuySteel * statePlayer.valueSteel -
            toBuyTitan * statePlayer.valueTitan
      )
      return Math.min(diff, statePlayer.resources.mln)
   }
   function getInitToBuySteel() {
      if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) {
         const diff =
            modals.modalCard.currentCost -
            statePlayer.resources.mln -
            toBuyTitan * statePlayer.valueTitan

         if (diff > 0) {
            return Math.min(Math.ceil(diff / statePlayer.valueSteel), statePlayer.resources.steel)
         } else {
            return 0
         }
      } else {
         return 0
      }
   }
   function getInitToBuyTitan() {
      if (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE)) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln

         if (diff > 0) {
            if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) {
               return Math.min(
                  Math.floor(diff / statePlayer.valueTitan),
                  statePlayer.resources.titan
               )
            } else {
               return Math.min(
                  Math.ceil(diff / statePlayer.valueTitan),
                  statePlayer.resources.titan
               )
            }
         } else {
            return 0
         }
      } else {
         return 0
      }
   }

   function getDisabled() {
      return (
         Math.min(toBuyMln, statePlayer.resources.mln) +
            toBuySteel * statePlayer.valueSteel +
            toBuyTitan * statePlayer.valueTitan +
            toBuyHeat <
            modals.modalCard.currentCost ||
         !requirementsMet(modals.modalCard) ||
         stateGame.phaseViewGameState ||
         stateGame.phasePlaceTile
      )
   }

   const showConfirmation = () => {
      if (!disabled) {
         setModals((prevModals) => ({
            ...prevModals,
            modalConf: {
               text: `Do you want to play: ${modals.modalCard.name}`,
               onYes: handleUseAction,
               onNo: () => setModals({ ...modals, confirmation: false }),
            },
            confirmation: true,
         }))
      }
   }

   const handleUseAction = () => {
      // ANIMATIONS
      let animResPaidTypes = []
      if (toBuyMln) animResPaidTypes.push([RESOURCES.MLN, toBuyMln])
      if (toBuySteel) animResPaidTypes.push([RESOURCES.STEEL, toBuySteel])
      if (toBuyTitan) animResPaidTypes.push([RESOURCES.TITAN, toBuyTitan])
      if (toBuyHeat) animResPaidTypes.push([RESOURCES.HEAT, toBuyHeat])
      // Close all modals
      setModals((prevModals) => ({
         ...prevModals,
         confirmation: false,
         cardWithAction: false,
         cards: false,
      }))
      startAnimation(setModals)
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setAnimation(
               ANIMATIONS.RESOURCES_OUT,
               animResPaidTypes[i][0],
               animResPaidTypes[i][1],
               setModals
            )
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease Corporation Resources
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -toBuySteel })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -toBuyTitan })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         // Remove this card from Cards In Hand
         let newCardsInHand = statePlayer.cardsInHand.filter(
            (card) => card.id !== modals.modalCard.id
         )
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCardsInHand })
         // Add this card to Cards Played
         let newCardsPlayed = [...statePlayer.cardsPlayed, modals.modalCard]
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCardsPlayed })
         // Set special design effect to false (if applicable)
         if (statePlayer.specialDesignEffect) {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
            dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
         }
         // ================== IMM_EFFECTS AND EFFECTS ================
         // Add Card immediate actions to the subActions list
         let actions = getImmEffects(modals.modalCard.id)
         // Add Effects to call that are included in the cardsPlayed effects (and corporation effects) list to the subActions list
         modals.modalCard.effectsToCall.forEach((effect) => {
            if (
               statePlayer.cardsPlayed.some((card) => card.effect === effect) ||
               statePlayer.corporation.effects.some((corpEffect) => corpEffect === effect)
            )
               actions = [...actions, ...getEffect(effect)]
         })
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
         // =======================================================
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return (
      <div
         className={`modal-background ${modals.confirmation && 'display-none'}`}
         onClick={() => setModals({ ...modals, cardWithAction: false, modalCard: null })}
      >
         <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
            {/* CARD */}
            <Card card={modals.modalCard} isBig={true} />
            {/* CARD BUTTON */}
            {!modals.draft && (
               <>
                  <CardBtn initBtnText="USE" handleClick={showConfirmation} disabled={disabled} />
                  <div className="card-to-buy-mln">{toBuyMln}</div>
               </>
            )}
            {/* CARD DECREASE COST SECTION */}
            {((statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) ||
               (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE)) ||
               (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat)) &&
               modals.cardWithAction &&
               !modals.draft && (
                  <CardDecreaseCost
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
      </div>
   )
}

export default ModalCardWithAction
