import { hasTag } from '../util/misc'

export const areRequirementsMet = (card, statePlayer, stateGame) => {
   let isAvailable = true
   // Check cost vs resources first
   if (getAllResources(card, statePlayer) < card.currentCost) {
      isAvailable = false
      return isAvailable
   }
   // Check other requirements
   card.requirements.forEach(({ type, value, other }) => {
      // Global parameters requirements
      if (type === 'oxygen') {
         if (
            other === 'max' &&
            stateGame.globalParameters.oxygen - Math.abs(statePlayer.globParamReqModifier) > value
         )
            isAvailable = false
         if (
            other === 'min' &&
            stateGame.globalParameters.oxygen + Math.abs(statePlayer.globParamReqModifier) < value
         )
            isAvailable = false
      }
      if (type === 'temperature') {
         if (
            other === 'max' &&
            stateGame.globalParameters.temperature - Math.abs(statePlayer.globParamReqModifier) >
               value
         )
            isAvailable = false
         if (
            other === 'min' &&
            stateGame.globalParameters.temperature + Math.abs(statePlayer.globParamReqModifier) <
               value
         )
            isAvailable = false
      }
      if (type === 'oceans') {
         if (
            other === 'max' &&
            stateGame.globalParameters.oceans - Math.abs(statePlayer.globParamReqModifier) > value
         )
            isAvailable = false
         if (
            other === 'min' &&
            stateGame.globalParameters.oceans + Math.abs(statePlayer.globParamReqModifier) < value
         )
            isAvailable = false
      }
   })
   return isAvailable
}

function getAllResources(card, statePlayer) {
   let resources = statePlayer.resources.mln
   if (hasTag(card, 'building')) resources += statePlayer.resources.steel * statePlayer.valueSteel
   if (hasTag(card, 'space')) resources += statePlayer.resources.titan * statePlayer.valueTitan
   if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
   return resources
}
