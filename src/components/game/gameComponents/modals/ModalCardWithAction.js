/* Used to view one card for use only */
import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import { performEffect } from '../../../../data/effects'
import { hasTag } from '../../../../util/misc'
import Card from '../Card'
import CardBtn from './modalsComponents/CardBtn'
import CardDecreaseCost from './modalsComponents/CardDecreaseCost'
import { INIT_ANIMATION_DATA } from '../../../../initStates/initModals'

const ModalCardWithAction = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { stateGame, performAction, requirementsMet, ANIMATION_SPEED } =
      useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
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
      const diff =
         modals.modalCard.currentCost -
         toBuySteel * statePlayer.valueSteel -
         toBuyTitan * statePlayer.valueTitan

      return Math.min(diff, statePlayer.resources.mln)
   }
   function getInitToBuySteel() {
      if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building')) {
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
      if (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, 'space')) {
         const diff = modals.modalCard.currentCost - statePlayer.resources.mln

         if (diff > 0) {
            if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building')) {
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
         setModals({
            ...modals,
            modalConfData: {
               text: `Do you want to play: ${modals.modalCard.name}`,
               onYes: handleUseAction,
               onNo: () => setModals({ ...modals, confirmation: false }),
            },
            confirmation: true,
         })
      }
   }

   const handleUseAction = () => {
      // ------------------------ ANIMATIONS ------------------------
      let animResPaidTypes = []
      if (toBuyMln) animResPaidTypes.push(['mln', toBuyMln])
      if (toBuySteel) animResPaidTypes.push(['steel', toBuySteel])
      if (toBuyTitan) animResPaidTypes.push(['titan', toBuyTitan])
      if (toBuyHeat) animResPaidTypes.push(['heat', toBuyHeat])
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setModals({
               ...modals,
               confirmation: false,
               cardWithAction: false,
               cards: false,
               animationData: {
                  ...modals.animationData,
                  resourcesOut: {
                     type: animResPaidTypes[i][0],
                     value: animResPaidTypes[i][1],
                  },
               },
               animation: true,
            })
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         setModals({
            ...modals,
            confirmation: false,
            cardWithAction: false,
            cards: false,
            animationData: INIT_ANIMATION_DATA,
            animation: false,
         })
         // Decrease Corporation Resources
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -toBuySteel })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -toBuyTitan })
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         // Remove this card from Cards In Hand
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: statePlayer.cardsInHand.filter((card) => card.id !== modals.modalCard.id),
         })
         // Add this card to Cards Played
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: [...statePlayer.cardsPlayed, modals.modalCard],
         })
         // Call Card Action
         performAction(modals.modalCard.id)
         // Call Card Effects
         modals.modalCard.effectsToCall.forEach((effect) => {
            if (statePlayer.effects.some((stateEffect) => stateEffect.name === effect))
               performEffect(effect, dispatchPlayer)
         })
         // Add tags to the corporation
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_TAGS,
            payload: [...statePlayer.tags, ...modals.modalCard.tags],
         })
         // Add VPs to the corporation
         if (modals.modalCard.vp !== 0)
            dispatchPlayer({
               type: ACTIONS_PLAYER.SET_VP,
               payload: [...statePlayer.vp, modals.modalCard],
            })
         // Add Actions to the corporation
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_ACTIONS,
            payload: [...statePlayer.actions, ...modals.modalCard.actions],
         })
         // Add Effects to the corporation
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_EFFECTS,
            payload: [...statePlayer.effects, ...modals.modalCard.effectsToAdd],
         })
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return (
      <>
         <div
            className={`modal-card-container full-size ${modals.confirmation && 'display-none'}`}
            onClick={() => setModals({ ...modals, cardWithAction: false, modalCard: null })}
         >
            <div className="modal-card center">
               <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
                  <Card card={modals.modalCard} />
                  <CardBtn btnText="USE" handleClick={showConfirmation} disabled={disabled} />
                  <div className={`card-to-buy-mln ${disabled && 'disabled'}`}>{toBuyMln}</div>
                  {((statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building')) ||
                     (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, 'space')) ||
                     (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat)) &&
                     modals.cardWithAction && (
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
         </div>
      </>
   )
}

export default ModalCardWithAction
