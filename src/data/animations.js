import { INIT_ANIMATION_DATA } from "../initStates/initModals"

export const ANIMATIONS = {
   NAMES: {
      RESOURCES_IN: 'Resources In',
      RESOURCES_OUT: 'Resources Out',
      PRODUCTION_IN: 'Production In',
      PRODUCTION_OUT: 'Production Out',
   },
   TYPES: {
      MLN: 'Mln',
      STEEL: 'Steel',
      TITAN: 'Titan',
      PLANTS: 'Plants',
      POWER: 'Power',
      HEAT: 'Heat',
   },
}

export function setAnimation(subActions, i, setModals) {
   switch (subActions[i].name) {
      case ANIMATIONS.NAMES.RESOURCES_IN:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               resourcesIn: {
                  type: subActions[i].type,
                  value: subActions[i].value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.NAMES.RESOURCES_OUT:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               resourcesOut: {
                  type: subActions[i].type,
                  value: subActions[i].value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.NAMES.PRODUCTION_IN:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               productionIn: {
                  type: subActions[i].type,
                  value: subActions[i].value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.NAMES.PRODUCTION_OUT:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               productionOut: {
                  type: subActions[i].type,
                  value: subActions[i].value,
               },
            },
            animation: true,
         }))
         break
      default:
         break
   }
}
