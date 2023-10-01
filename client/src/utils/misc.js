import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../data/animations'
import { TAGS } from '../data/tags'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { hasTag } from './cards'

export function getAllResourcesInMln(card, statePlayer) {
   let resources = statePlayer.resources.mln
   if (hasTag(card, TAGS.BUILDING)) resources += statePlayer.resources.steel * statePlayer.valueSteel
   if (hasTag(card, TAGS.SPACE)) resources += statePlayer.resources.titan * statePlayer.valueTitan
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}
export function getAllResourcesInMlnForSP(statePlayer) {
   let resources = statePlayer.resources.mln
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}

export function funcPerformSubActions(subActions, ANIMATION_SPEED, setModals, dispatchGame, setTrigger, sound, noTrigger = false) {
   subActions = subActions.filter((subAction) => subAction.name !== undefined)

   let iLast = subActions.length - 1
   for (let i = 0; i <= iLast; i++) {
      if (subActions[i].name === ANIMATIONS.USER_INTERACTION) {
         iLast = i
         break
      }
   }
   if (iLast === -1) {
      endAnimation(setModals)
      if (!noTrigger) setTrigger((prevValue) => !prevValue)
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
               dispatchGame({
                  type: ACTIONS_GAME.SET_ACTIONSLEFT,
                  payload: subActions.slice(iLast + 1),
               })
               if (subActions[i].name !== ANIMATIONS.USER_INTERACTION) {
                  if (!noTrigger) setTrigger((prevValue) => !prevValue)
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