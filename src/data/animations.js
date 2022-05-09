import { INIT_ANIMATION_DATA } from '../initStates/initModals'
import { RESOURCES } from './resources'

export const ANIMATIONS = {
   // Animations
   RESOURCES_IN: 'Resources In',
   RESOURCES_OUT: 'Resources Out',
   PRODUCTION_IN: 'Production In',
   PRODUCTION_OUT: 'Production Out',
   CARD_IN: 'Card In',
   CARD_OUT: 'Card Out',
   // User Interaction
   USER_INTERACTION: 'User Interaction',
   // Short animation for global parameters (only css transition)
   SHORT_ANIMATION: 'Short Animation',
}

export function getAnimNameBasedOnBonus(bonus) {
   switch (bonus) {
      case RESOURCES.STEEL:
      case RESOURCES.TITAN:
      case RESOURCES.PLANT:
         return ANIMATIONS.RESOURCES_IN
      case RESOURCES.CARD:
         return ANIMATIONS.CARD_IN
      default:
         return
   }
}

export function startAnimation(setModals) {
   setModals((prevModals) => ({
      ...prevModals,
      animation: true,
   }))
}
export function endAnimation(setModals) {
   setModals((prevModals) => ({
      ...prevModals,
      animationData: INIT_ANIMATION_DATA,
      animation: false,
   }))
}

export function setAnimation(name, type, value, setModals) {
   switch (name) {
      case ANIMATIONS.RESOURCES_IN:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               resourcesIn: {
                  type: type,
                  value: value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.RESOURCES_OUT:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               resourcesOut: {
                  type: type,
                  value: value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.PRODUCTION_IN:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               productionIn: {
                  type: type,
                  value: value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.PRODUCTION_OUT:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               productionOut: {
                  type: type,
                  value: value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.CARD_IN:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               cardIn: {
                  type: type,
                  value: value,
               },
            },
            animation: true,
         }))
         break
      case ANIMATIONS.CARD_OUT:
         setModals((prevModals) => ({
            ...prevModals,
            animationData: {
               ...INIT_ANIMATION_DATA,
               cardOut: {
                  type: type,
                  value: value,
               },
            },
            animation: true,
         }))
         break
      default:
         break
   }
}
