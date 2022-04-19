import { useState, useContext } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext } from '../../Game'
import { ACTIONS_GAME } from '../../util/dispatchGame'
import { ACTIONS_PLAYER } from '../../util/dispatchPlayer'
import { EFFECTS } from '../../data/effects'
import { hasTag } from '../../util/misc'
import Card from '../card/Card'
import CardBtn from '../card/CardBtn'
import CardDecreaseCost from '../card/CardDecreaseCost'
import CardMlnToBuy from '../card/CardMlnToBuy'

const ModalCardWithAction = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { stateGame, dispatchGame, checkRequirements } = useContext(StateGameContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const [toBuyTitan, setToBuyTitan] = useState(getInitToBuyTitan())
   const [toBuySteel, setToBuySteel] = useState(getInitToBuySteel())
   const [toBuyMln, setToBuyMln] = useState(getInitToBuyMln())
   const [disabled, setDisabled] = useState(getDisabled())

   function getInitToBuyMln() {
      return Math.max(
         0,
         modals.modalCard.currentCost -
            toBuySteel * statePlayer.valueSteel -
            toBuyTitan * statePlayer.valueTitan
      )
   }
   function getInitToBuySteel() {
      if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building')) {
         if (
            modals.modalCard.currentCost -
               statePlayer.resources.mln -
               toBuyTitan * statePlayer.valueTitan >
            0
         ) {
            return Math.min(
               Math.ceil(
                  (modals.modalCard.currentCost -
                     statePlayer.resources.mln -
                     toBuyTitan * statePlayer.valueTitan) /
                     statePlayer.valueSteel
               ),
               statePlayer.resources.steel
            )
         } else {
            return 0
         }
      } else {
         return 0
      }
   }
   function getInitToBuyTitan() {
      if (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, 'space')) {
         if (modals.modalCard.currentCost - statePlayer.resources.mln > 0) {
            if (statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building')) {
               return Math.min(
                  Math.floor(
                     (modals.modalCard.currentCost - statePlayer.resources.mln) /
                        statePlayer.valueTitan
                  ),
                  statePlayer.resources.titan
               )
            } else {
               return Math.min(
                  Math.ceil(
                     (modals.modalCard.currentCost - statePlayer.resources.mln) /
                        statePlayer.valueTitan
                  ),
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
            toBuyTitan * statePlayer.valueTitan <
            modals.modalCard.currentCost || !checkRequirements(modals.modalCard)
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
      setModals({ ...modals, confirmation: false, cardWithAction: false, cards: false })
      // Decrease Corporation Resources
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln })
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -toBuySteel })
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: -toBuyTitan })
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
      callCardAction(modals.modalCard.id)
      // Call Effects
      modals.modalCard.effectsToCall.forEach((effect) => {
         if (statePlayer.effects.some((stateEffect) => stateEffect.name === effect))
            callEffect(effect)
      })
      // Add tags to the corporation
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_TAGS,
         payload: [...statePlayer.tags, ...modals.modalCard.tags],
      })
      // Add VPs to the corporation
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_VP,
         payload: [...statePlayer.vp, ...modals.modalCard],
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
   }

   /* ================================ LIST OF ALL CARDS' ACTIONS =================================
   This includes actions for ALL (non-corporate) cards in the game.
   */
   function callCardAction(id) {
      switch (id) {
         case 126:
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_POWER, payload: -1 })
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 })
            break
         default:
            break
      }
   }

   /* ==================================== LIST OF ALL EFFECTS ====================================
   This includes all effects in game EXCEPT immediate effects from corporations, listed in the
   ModalCorps component => callImmediateEffect function.
   */
   function callEffect(effect) {
      switch (effect) {
         case EFFECTS.CREDICOR_GAIN_4_RES_MLN:
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 4 })
            break
         default:
            break
      }
   }

   return (
      <>
         <div
            className={`modal-card-container full-size ${modals.confirmation && 'hidden'}`}
            onClick={() => setModals({ ...modals, cardWithAction: false, modalCard: null })}
         >
            <div className="modal-card center">
               <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
                  <Card card={modals.modalCard} />
                  <CardBtn btnText="USE" handleClick={showConfirmation} disabled={disabled} />
                  <CardMlnToBuy toBuyMln={toBuyMln} disabled={disabled} />
                  {((statePlayer.resources.steel > 0 && hasTag(modals.modalCard, 'building')) ||
                     (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, 'space'))) &&
                     modals.cardWithAction && (
                        <CardDecreaseCost
                           toBuyMln={toBuyMln}
                           setToBuyMln={setToBuyMln}
                           toBuySteel={toBuySteel}
                           setToBuySteel={setToBuySteel}
                           toBuyTitan={toBuyTitan}
                           setToBuyTitan={setToBuyTitan}
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
