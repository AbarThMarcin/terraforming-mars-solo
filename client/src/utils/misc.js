import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { CARDS } from '../data/cards'
import { CORP_NAMES } from '../data/corpNames'
import { TAGS } from '../data/tags'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { getActionIdsWithCost, getCardActionCost, hasTag } from './cards'

export function getAllResourcesInMln(card, statePlayer) {
   let resources = statePlayer.resources.mln
   if (hasTag(card, TAGS.BUILDING)) resources += statePlayer.resources.steel * statePlayer.valueSteel
   if (hasTag(card, TAGS.SPACE)) resources += statePlayer.resources.titan * statePlayer.valueTitan
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}
export function getAllResourcesInMlnOnlyHeat(statePlayer) {
   let resources = statePlayer.resources.mln
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}

export function funcPerformSubActions(subActions, ANIMATION_SPEED, setModals, stateGame, dispatchGame, setTrigger, sound, noTrigger = false, dataForReplay, setCurrentLogItem) {
   // Remove undefined subactions
   subActions = subActions.filter((subAction) => subAction.name !== undefined)

   // iLast is the index od subAction that points to first USER_INTERACTION subaction.
   // If no USER_INTERACTIONS found, it points to last subaction
   let iLast = subActions.length - 1
   for (let i = 0; i <= iLast; i++) {
      if (subActions[i].name === ANIMATIONS.USER_INTERACTION) {
         iLast = i
         break
      }
   }
   // If no subactions was sent to this function, end animation and trigger further changes (if applicable)
   // Sending to this function empty array of subactions is to just trigger the further changes (VP, save to server, etc)
   if (iLast === -1) {
      endAnimation(setModals)
      if (!noTrigger) {
         setTrigger((prevValue) => !prevValue)
      } else {
         turnReplayActionOff(stateGame, dispatchGame, dataForReplay, setCurrentLogItem)
      }
   }

   let longAnimCount = 0
   let shortAnimCount = 0
   // Loop through all subactions
   for (let i = 0; i <= iLast; i++) {
      // ============= Start animation and perform subactions
      if (subActions[i].name !== ANIMATIONS.USER_INTERACTION) {
         // Subaction with normal animation
         setTimeout(() => {
            endAnimation(setModals)
            startAnimation(setModals)
            setAnimation(subActions[i].name, subActions[i].type, subActions[i].value, setModals, sound)
         }, longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2))
         setTimeout(
            () => subActions[i].func(),
            subActions[i].name !== ANIMATIONS.SHORT_ANIMATION
               ? (longAnimCount + 1) * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
               : longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
         )
      } else {
         // Subaction with user interaction
         setTimeout(() => subActions[i].func(), longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2))
      }
      // ============= End animation and remove performed actions from stateGame.actionsLeft
      if (i === iLast) {
         setTimeout(
            () => {
               endAnimation(setModals)
               dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions.slice(iLast + 1) })
               if (subActions[i].name !== ANIMATIONS.USER_INTERACTION) {
                  if (!noTrigger) setTrigger((prevValue) => !prevValue)
               }
               if (noTrigger) {
                  turnReplayActionOff(stateGame, dispatchGame, dataForReplay, setCurrentLogItem)
               }
            },
            subActions[i].name !== ANIMATIONS.USER_INTERACTION
               ? subActions[i].name !== ANIMATIONS.SHORT_ANIMATION
                  ? (longAnimCount + 1) * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
                  : longAnimCount * ANIMATION_SPEED + (shortAnimCount + 1) * (ANIMATION_SPEED / 2)
               : longAnimCount * ANIMATION_SPEED + shortAnimCount * (ANIMATION_SPEED / 2)
         )
      }
      // ============= Increment animation speed counter
      if (subActions[i].name !== ANIMATIONS.SHORT_ANIMATION) {
         longAnimCount++
      } else if (subActions[i].name === ANIMATIONS.SHORT_ANIMATION) {
         shortAnimCount++
      }
   }
}

export function getActions(statePlayer, actionRequirementsMet) {
   const cards = statePlayer.cardsPlayed.filter((card) =>
      CARDS.filter((c) => c.iconNames.action !== null)
         .map((c) => c.id)
         .includes(card.id)
   )
   let count = cards.filter((card) => {
      let reqsMet = false
      let enoughToBuy = true
      if (actionRequirementsMet(card)) reqsMet = true
      if (getActionIdsWithCost().includes(card.id)) {
         const cost = getCardActionCost(card.id)
         let resources = statePlayer.resources.mln
         if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
         if (card.id === 187) resources += statePlayer.resources.steel * statePlayer.valueSteel
         if (card.id === 12) resources += statePlayer.resources.titan * statePlayer.valueTitan
         enoughToBuy = resources >= cost
      }
      return reqsMet && enoughToBuy
   }).length
   if (statePlayer.corporation?.name === CORP_NAMES.UNMI) {
      count = actionRequirementsMet(statePlayer.corporation) ? count + 1 : count
   }
   return [count, cards]
}

export function turnReplayActionOff(stateGame, dispatchGame, dataForReplay, setCurrentLogItem) {
   // When no replay mode is on
   if (!dataForReplay) return
   // Preventing running this function when game index starts
   if (stateGame.replayActionId) {
      dispatchGame({ type: ACTIONS_GAME.SET_REPLAY_ACTION_ID, payload: null })
      setCurrentLogItem((prev) => {
         if (prev === dataForReplay.logItems.length - 1 || dataForReplay.logItems[prev + 1].action) {
            return prev + 1
         } else {
            return prev + 2
         }
      })
   }
}
