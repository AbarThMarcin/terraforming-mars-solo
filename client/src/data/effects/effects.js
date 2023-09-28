import { ACTIONS_GAME } from '../../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../../stateActions/actionsPlayer'
import { ANIMATIONS } from '../animations'
import { RESOURCES, getResIcon } from '../resources'
import { SP } from '../StandardProjects'
import { OPTION_ICONS } from '../selectOneOptions'
import { TAGS } from '../tags'
import { canCardHaveAnimals, canCardHaveMicrobes } from '../../utils/misc'
import { EFFECTS } from './effectIcons'
import { CORP_NAMES } from '../corpNames'
import { funcSetLogItemsSingleActions } from '../log/log'

// ============================= LIST OF CORPORATION IMMEDIATE EFFECTS =============================
export const performImmediateCorpEffect = (corp, dispatchPlayer, dispatchGame) => {
   switch (corp.name) {
      case CORP_NAMES.ECOLINE:
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 7 })
         break
      case CORP_NAMES.HELION:
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: true })
         break
      case CORP_NAMES.INVENTRIX:
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: 2 })
         break
      case CORP_NAMES.PHOBOLOG:
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_VALUE_TITAN, payload: 1 })
         break
      case CORP_NAMES.THORGATE:
         dispatchGame({ type: ACTIONS_GAME.SET_POWERPLANT_COST, payload: 8 })
         // The 'Power cards cost 3M less' effect is called in the modifiedCards function
         break
      case CORP_NAMES.TERACTOR:
         // This effect is called in the modifiedCards function
         break
      default:
         break
   }
}

// ================================== LIST OF ALL CARD EFFECTS ====================================
// This includes all card and corporation effects in game EXCEPT immediate effects from corporations
export const funcGetEffect = (effectName, statePlayer, dispatchPlayer, dispatchGame, modals, setModals, setLogItems) => {
   let effect = []
   switch (effectName) {
      // ======================== CORPORATION EFFECTS ========================
      case EFFECTS.EFFECT_CREDICOR:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 4,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 4 })
                  funcSetLogItemsSingleActions('Received 4 MC from CREDICOR effect', RESOURCES.MLN, 4, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_INTERPLANETARY:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 2,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 })
                  funcSetLogItemsSingleActions('Received 2 MC from INTERPLANETARY CINEMATICS effect', RESOURCES.MLN, 2, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_SATURN_SYSTEMS:
         effect = [
            {
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: 1,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
                  funcSetLogItemsSingleActions(
                     'MC production increased by 1 from SATURN SYSTEMS effect',
                     [getResIcon(RESOURCES.PROD_BG), RESOURCES.MLN],
                     1,
                     setLogItems
                  )
               },
            },
         ]
         break
      case EFFECTS.EFFECT_THARSIS_CITY:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
                  funcSetLogItemsSingleActions('Received 3 MC from THARSIS REPUBLIC effect', RESOURCES.MLN, 3, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_THARSIS_CITY_ONPLANET:
         effect = [
            {
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: 1,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
                  funcSetLogItemsSingleActions(
                     'MC production increased by 1 from THARSIS REPUBLIC effect',
                     [getResIcon(RESOURCES.PROD_BG), RESOURCES.MLN],
                     1,
                     setLogItems
                  )
               },
            },
         ]
         break
      // ========================== CARD EFFECTS ==========================
      case EFFECTS.EFFECT_ARCTIC_ALGAE:
         // Arctic Algae effect implemented directly in the immediate effects
         // (for 1 ocean, 2 oceans and artificial lake card)
         break
      case EFFECTS.EFFECT_OPTIMAL_AEROBRAKING:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
                  funcSetLogItemsSingleActions('Received 3 MC from OPTIMAL AEROBRAKING effect', RESOURCES.MLN, 3, setLogItems)
               },
            },
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.HEAT,
               value: 3,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: 3 })
                  funcSetLogItemsSingleActions('Received 3 heat from OPTIMAL AEROBRAKING effect', RESOURCES.HEAT, 3, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_ROVER_CONSTRUCTION:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 2,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 })
                  funcSetLogItemsSingleActions('Received 2 MC from ROVER CONSTRUCTION effect', RESOURCES.MLN, 2, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_MARS_UNIVERSITY:
         // Immediate effect implemented in Game component (useEffect) and immEffects module
         break
      case EFFECTS.EFFECT_VIRAL_ENHANCERS:
         let getPlantEffect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant from VIRAL ENHANCERS effect', RESOURCES.PLANT, 1, setLogItems)
            },
         }
         modals.modalCard.tags.forEach((tag) => {
            switch (tag) {
               case TAGS.PLANT:
                  if (canCardHaveAnimals(modals.modalCard.id)) {
                     effect.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        type: null,
                        value: null,
                        func: () => {
                           dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
                           setModals((prev) => ({
                              ...prev,
                              modalSelectOne: {
                                 card: statePlayer.cardsPlayed.find((card) => card.id === 74),
                                 options: [OPTION_ICONS.CARD74_OPTION1, OPTION_ICONS.CARD74_OPTION3],
                              },
                              selectOne: true,
                           }))
                        },
                     })
                  } else {
                     effect.push(getPlantEffect)
                  }
                  break
               case TAGS.MICROBE:
                  if (canCardHaveMicrobes(modals.modalCard.id)) {
                     effect.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        type: null,
                        value: null,
                        func: () => {
                           dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
                           setModals((prev) => ({
                              ...prev,
                              modalSelectOne: {
                                 card: statePlayer.cardsPlayed.find((card) => card.id === 74),
                                 options: [OPTION_ICONS.CARD74_OPTION1, OPTION_ICONS.CARD74_OPTION2],
                              },
                              selectOne: true,
                           }))
                        },
                     })
                  } else {
                     effect.push(getPlantEffect)
                  }
                  break
               case TAGS.ANIMAL:
                  if (canCardHaveAnimals(modals.modalCard.id)) {
                     effect.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        type: null,
                        value: null,
                        func: () => {
                           dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
                           setModals((prev) => ({
                              ...prev,
                              modalSelectOne: {
                                 card: statePlayer.cardsPlayed.find((card) => card.id === 74),
                                 options: [OPTION_ICONS.CARD74_OPTION1, OPTION_ICONS.CARD74_OPTION3],
                              },
                              selectOne: true,
                           }))
                        },
                     })
                  } else {
                     effect.push(getPlantEffect)
                  }
                  break
               default:
                  break
            }
         })
         break
      case EFFECTS.EFFECT_MEDIA_GROUP:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
                  funcSetLogItemsSingleActions('Received 3 MC from MEDIA GROUP effect', RESOURCES.MLN, 3, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_ECOLOGICAL_ZONE:
         modals.modalCard.tags.forEach((tag) => {
            switch (tag) {
               case TAGS.PLANT:
               case TAGS.ANIMAL:
                  effect.push({
                     name: ANIMATIONS.RESOURCES_IN,
                     type: RESOURCES.ANIMAL,
                     value: 1,
                     func: () => {
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.ADD_BIO_RES,
                           payload: { cardId: 128, resource: RESOURCES.ANIMAL, amount: 1 },
                        })
                        funcSetLogItemsSingleActions('Received 1 animal to ECOLOGICAL ZONE card from its effect', RESOURCES.ANIMAL, 1, setLogItems)
                     },
                  })
                  break
               default:
                  break
            }
         })
         break
      case EFFECTS.EFFECT_DECOMPOSERS:
         modals.modalCard.tags.forEach((tag) => {
            switch (tag) {
               case TAGS.PLANT:
               case TAGS.MICROBE:
               case TAGS.ANIMAL:
                  effect.push({
                     name: ANIMATIONS.RESOURCES_IN,
                     type: RESOURCES.MICROBE,
                     value: 1,
                     func: () => {
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.ADD_BIO_RES,
                           payload: { cardId: 131, resource: RESOURCES.MICROBE, amount: 1 },
                        })
                        funcSetLogItemsSingleActions('Received 1 microbe to DECOMPOSERS card from its effect', RESOURCES.MICROBE, 1, setLogItems)
                     },
                  })
                  break
               default:
                  break
            }
         })
         break
      case EFFECTS.EFFECT_HERBIVORES:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.ANIMAL,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: { cardId: 147, resource: RESOURCES.ANIMAL, amount: 1 },
                  })
                  funcSetLogItemsSingleActions('Received 1 animal to HERBIVORES card from its effect', RESOURCES.ANIMAL, 1, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_STANDARD_TECHNOLOGY:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 })
                  funcSetLogItemsSingleActions('Received 3 MC from STANDARD TECHNOLOGY effect', RESOURCES.MLN, 3, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_PETS:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.ANIMAL,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: { cardId: 172, resource: RESOURCES.ANIMAL, amount: 1 },
                  })
                  funcSetLogItemsSingleActions('Received 1 animal to PETS card from its effect', RESOURCES.ANIMAL, 1, setLogItems)
               },
            },
         ]
         break
      case EFFECTS.EFFECT_OLYMPUS_CONFERENCE:
         // Immediate effect implemented in Game component (useEffect) and immEffects module
         break
      case EFFECTS.EFFECT_IMMIGRANT_CITY:
         effect = [
            {
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: 1,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
                  funcSetLogItemsSingleActions(
                     'MC production increased by 1 from IMMIGRANT CITY effect',
                     [getResIcon(RESOURCES.PROD_BG), RESOURCES.MLN],
                     1,
                     setLogItems
                  )
               },
            },
         ]
         break
      default:
         break
   }
   return effect
}

export const getSPeffectsToCall = (SpOrConvertPlants) => {
   switch (SpOrConvertPlants) {
      case SP.AQUIFER:
         return [EFFECTS.EFFECT_STANDARD_TECHNOLOGY]
      case SP.GREENERY:
         return [EFFECTS.EFFECT_CREDICOR, EFFECTS.EFFECT_HERBIVORES, EFFECTS.EFFECT_STANDARD_TECHNOLOGY]
      case SP.CITY:
         return [
            EFFECTS.EFFECT_CREDICOR,
            EFFECTS.EFFECT_ROVER_CONSTRUCTION,
            EFFECTS.EFFECT_IMMIGRANT_CITY,
            EFFECTS.EFFECT_THARSIS_CITY,
            EFFECTS.EFFECT_THARSIS_CITY_ONPLANET,
            EFFECTS.EFFECT_PETS,
            EFFECTS.EFFECT_STANDARD_TECHNOLOGY,
         ]
      default:
         return []
   }
}
