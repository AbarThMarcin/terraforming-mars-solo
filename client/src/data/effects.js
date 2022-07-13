import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import { SP } from './StandardProjects'
import { OPTION_ICONS } from './selectOneOptions'
import { TAGS } from './tags'
import { canCardHaveAnimals, canCardHaveMicrobes } from '../utils/misc'
// Corporation effects icons
import effect_credicor from '../assets/images/effects/effect_credicor.svg'
import effect_ecoline from '../assets/images/effects/effect_ecoline.svg'
import effect_helion from '../assets/images/effects/effect_helion.svg'
import effect_interplanetary from '../assets/images/effects/effect_interplanetary.svg'
import effect_globReqsPlusMinus2 from '../assets/images/effects/effect_globReqsPlusMinus2.svg'
import effect_miningGuild from '../assets/images/effects/effect_miningGuild.svg'
import effect_phobolog from '../assets/images/effects/effect_phobolog.svg'
import effect_saturnSystems from '../assets/images/effects/effect_saturnSystems.svg'
import effect_earthMinus3 from '../assets/images/effects/effect_earthMinus3.svg'
import effect_tharsis from '../assets/images/effects/effect_tharsis.svg'
import effect_thorgate from '../assets/images/effects/effect_thorgate.svg'
// Cost deduction card effects
import effect_researchOutpost from '../assets/images/effects/effect_researchOutpost.svg'
import effect_spaceMinus2 from '../assets/images/effects/effect_spaceMinus2.svg'
import effect_mlnMinus2 from '../assets/images/effects/effect_mlnMinus2.svg'
// Card effects icons
import effect_arcticAlgae from '../assets/images/effects/effect_arcticAlgae.svg'
import effect_optimalAerobraking from '../assets/images/effects/effect_optimalAerobraking.svg'
import effect_roverConstruction from '../assets/images/effects/effect_roverConstruction.svg'
import effect_advancedAlloys from '../assets/images/effects/effect_advancedAlloys.svg'
import effect_marsUniversity from '../assets/images/effects/effect_marsUniversity.svg'
import effect_viralEnhancers from '../assets/images/effects/effect_viralEnhancers.svg'
import effect_mediaGroup from '../assets/images/effects/effect_mediaGroup.svg'
import effect_ecologicalZone from '../assets/images/effects/effect_ecologicalZone.svg'
import effect_decomposers from '../assets/images/effects/effect_decomposers.svg'
import effect_herbivores from '../assets/images/effects/effect_herbivores.svg'
import effect_standardTechnology from '../assets/images/effects/effect_standardTechnology.svg'
import effect_pets from '../assets/images/effects/effect_pets.svg'
import effect_olympusConference from '../assets/images/effects/effect_olympusConference.svg'
import effect_immigrantCity from '../assets/images/effects/effect_immigrantCity.svg'
import { CORP_NAMES } from './corpNames'

export const EFFECTS = {
   // Corporation Effects
   EFFECT_CREDICOR: 'Effect Credicor',
   EFFECT_ECOLINE: 'Effect Ecoline',
   EFFECT_HELION: 'Effect Helion',
   EFFECT_INTERPLANETARY: 'Effect Interplanetary Cinematics',
   EFFECT_INVENTRIX: 'Effect Inventrix',
   EFFECT_MINING_GUILD: 'Effect Mining Guild', // Implemented directly in the Field component.
   EFFECT_PHOBOLOG: 'Effect Phobolog',
   EFFECT_SATURN_SYSTEMS: 'Effect Saturn Systems',
   EFFECT_TERACTOR: 'Effect Teractor',
   EFFECT_THARSIS_CITY: 'Effect Tharsis 1',
   EFFECT_THARSIS_CITY_ONPLANET: 'Effect Tharsis 2',
   EFFECT_THORGATE: 'Effect Thorgate',
   // Cost deduction card effects, treated as immediate effect (not listed in funcGetEffect).
   EFFECT_RESEARCH_OUTPOST: 'Effect Research Outpost',
   EFFECT_SPACE_STATION: 'Effect Space Station',
   EFFECT_EARTH_CATAPULT: 'Effect Earth Catapult',
   EFFECT_QUANTUM_EXTRACTOR: 'Effect Quantum Extractor',
   EFFECT_MASS_CONVERTER: 'Effect Mass Converter',
   EFFECT_EARTH_OFFICE: 'Effect Earth Office',
   EFFECT_ANTIGRAVITY_TECHNOLOGY: 'Effect Anti-gravity Technology',
   EFFECT_SHUTTLES: 'Effect Shuttles',
   // Card Effects
   EFFECT_ARCTIC_ALGAE: 'Effect Arctic Algae',
   EFFECT_OPTIMAL_AEROBRAKING: 'Effect Optimal Aerobraking',
   EFFECT_ROVER_CONSTRUCTION: 'Effect Rover Construction',
   EFFECT_ADVANCED_ALLOYS: 'Effect Advanced Alloys', // Treated as immediate effect (not listed in funcGetEffect)
   EFFECT_MARS_UNIVERSITY: 'Effect Mars University',
   EFFECT_VIRAL_ENHANCERS: 'Effect Viral Enhancers',
   EFFECT_MEDIA_GROUP: 'Effect Media Group',
   EFFECT_ECOLOGICAL_ZONE: 'Effect Ecological Zone',
   EFFECT_DECOMPOSERS: 'Effect Decomposers',
   EFFECT_HERBIVORES: 'Effect Herbivores',
   EFFECT_ADAPTATION_TECHNOLOGY: 'Effect Adaptation Technology', // Treated as immediate effect (not listed in funcGetEffect)
   EFFECT_STANDARD_TECHNOLOGY: 'Effect Standard Technology',
   EFFECT_PETS: 'Effect Pets',
   EFFECT_OLYMPUS_CONFERENCE: 'Effect Olympus Conference',
   EFFECT_IMMIGRANT_CITY: 'Effect Immigrant City',
}

export const getEffectIcon = (effect) => {
   switch (effect) {
      // Corporation effect icons
      case EFFECTS.EFFECT_CREDICOR:
         return effect_credicor
      case EFFECTS.EFFECT_ECOLINE:
         return effect_ecoline
      case EFFECTS.EFFECT_HELION:
         return effect_helion
      case EFFECTS.EFFECT_INTERPLANETARY:
         return effect_interplanetary
      case EFFECTS.EFFECT_INVENTRIX:
         return effect_globReqsPlusMinus2
      case EFFECTS.EFFECT_MINING_GUILD:
         return effect_miningGuild
      case EFFECTS.EFFECT_PHOBOLOG:
         return effect_phobolog
      case EFFECTS.EFFECT_SATURN_SYSTEMS:
         return effect_saturnSystems
      case EFFECTS.EFFECT_TERACTOR:
         return effect_earthMinus3
      case EFFECTS.EFFECT_THARSIS_CITY:
         return effect_tharsis
      case EFFECTS.EFFECT_THARSIS_CITY_ONPLANET:
         return effect_tharsis
      case EFFECTS.EFFECT_THORGATE:
         return effect_thorgate
      // Cost deduction card effects
      case EFFECTS.EFFECT_RESEARCH_OUTPOST:
         return effect_researchOutpost
      case EFFECTS.EFFECT_SPACE_STATION:
         return effect_spaceMinus2
      case EFFECTS.EFFECT_EARTH_CATAPULT:
         return effect_mlnMinus2
      case EFFECTS.EFFECT_QUANTUM_EXTRACTOR:
         return effect_spaceMinus2
      case EFFECTS.EFFECT_MASS_CONVERTER:
         return effect_spaceMinus2
      case EFFECTS.EFFECT_EARTH_OFFICE:
         return effect_earthMinus3
      case EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY:
         return effect_mlnMinus2
      case EFFECTS.EFFECT_SHUTTLES:
         return effect_spaceMinus2
      // Card Effect Icons
      case EFFECTS.EFFECT_ARCTIC_ALGAE:
         return effect_arcticAlgae
      case EFFECTS.EFFECT_OPTIMAL_AEROBRAKING:
         return effect_optimalAerobraking
      case EFFECTS.EFFECT_ROVER_CONSTRUCTION:
         return effect_roverConstruction
      case EFFECTS.EFFECT_ADVANCED_ALLOYS:
         return effect_advancedAlloys
      case EFFECTS.EFFECT_MARS_UNIVERSITY:
         return effect_marsUniversity
      case EFFECTS.EFFECT_VIRAL_ENHANCERS:
         return effect_viralEnhancers
      case EFFECTS.EFFECT_MEDIA_GROUP:
         return effect_mediaGroup
      case EFFECTS.EFFECT_ECOLOGICAL_ZONE:
         return effect_ecologicalZone
      case EFFECTS.EFFECT_DECOMPOSERS:
         return effect_decomposers
      case EFFECTS.EFFECT_HERBIVORES:
         return effect_herbivores
      case EFFECTS.EFFECT_ADAPTATION_TECHNOLOGY:
         return effect_globReqsPlusMinus2
      case EFFECTS.EFFECT_STANDARD_TECHNOLOGY:
         return effect_standardTechnology
      case EFFECTS.EFFECT_OLYMPUS_CONFERENCE:
         return effect_olympusConference
      case EFFECTS.EFFECT_PETS:
         return effect_pets
      case EFFECTS.EFFECT_IMMIGRANT_CITY:
         return effect_immigrantCity
      default:
         return
   }
}

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
export const funcGetEffect = (
   effectName,
   statePlayer,
   dispatchPlayer,
   dispatchGame,
   modals,
   setModals
) => {
   let effect = []
   switch (effectName) {
      // ======================== CORPORATION EFFECTS ========================
      case EFFECTS.EFFECT_CREDICOR:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 4,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 4 }),
            },
         ]
         break
      case EFFECTS.EFFECT_INTERPLANETARY:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 2,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 }),
            },
         ]
         break
      case EFFECTS.EFFECT_SATURN_SYSTEMS:
         effect = [
            {
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: 1,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
            },
         ]
         break
      case EFFECTS.EFFECT_THARSIS_CITY:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
            },
         ]
         break
      case EFFECTS.EFFECT_THARSIS_CITY_ONPLANET:
         effect = [
            {
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: 1,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
            },
         ]
         break
      // ========================== CARD EFFECTS ==========================
      case EFFECTS.EFFECT_ARCTIC_ALGAE:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.PLANT,
               value: 2,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
            },
         ]
         break
      case EFFECTS.EFFECT_OPTIMAL_AEROBRAKING:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
            },
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.HEAT,
               value: 3,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: 3 }),
            },
         ]
         break
      case EFFECTS.EFFECT_ROVER_CONSTRUCTION:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 2,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 }),
            },
         ]
         break
      case EFFECTS.EFFECT_MARS_UNIVERSITY:
         // Immediate effect implemented in Game component (useEffect)
         break
      case EFFECTS.EFFECT_VIRAL_ENHANCERS:
         let getPlantEffect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 }),
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
                           setModals((prevModals) => ({
                              ...prevModals,
                              modalSelectOne: {
                                 card: statePlayer.cardsPlayed.find((card) => card.id === 74),
                                 options: [
                                    OPTION_ICONS.CARD74_OPTION1,
                                    OPTION_ICONS.CARD74_OPTION3,
                                 ],
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
                           setModals((prevModals) => ({
                              ...prevModals,
                              modalSelectOne: {
                                 card: statePlayer.cardsPlayed.find((card) => card.id === 74),
                                 options: [
                                    OPTION_ICONS.CARD74_OPTION1,
                                    OPTION_ICONS.CARD74_OPTION2,
                                 ],
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
                           setModals((prevModals) => ({
                              ...prevModals,
                              modalSelectOne: {
                                 card: statePlayer.cardsPlayed.find((card) => card.id === 74),
                                 options: [
                                    OPTION_ICONS.CARD74_OPTION1,
                                    OPTION_ICONS.CARD74_OPTION3,
                                 ],
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
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
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
                     func: () =>
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.ADD_BIO_RES,
                           payload: { cardId: 128, resource: RESOURCES.ANIMAL, amount: 1 },
                        }),
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
                     func: () =>
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.ADD_BIO_RES,
                           payload: { cardId: 131, resource: RESOURCES.MICROBE, amount: 1 },
                        }),
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
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: { cardId: 147, resource: RESOURCES.ANIMAL, amount: 1 },
                  }),
            },
         ]
         break
      case EFFECTS.EFFECT_STANDARD_TECHNOLOGY:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: 3,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
            },
         ]
         break
      case EFFECTS.EFFECT_PETS:
         effect = [
            {
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.ANIMAL,
               value: 1,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: { cardId: 172, resource: RESOURCES.ANIMAL, amount: 1 },
                  }),
            },
         ]
         break
      case EFFECTS.EFFECT_OLYMPUS_CONFERENCE:
         // Immediate effect implemented in Game component (useEffect)
         break
      case EFFECTS.EFFECT_IMMIGRANT_CITY:
         effect = [
            {
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: 1,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
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
         return [EFFECTS.EFFECT_ARCTIC_ALGAE, EFFECTS.EFFECT_STANDARD_TECHNOLOGY]
      case SP.GREENERY:
         return [
            EFFECTS.EFFECT_CREDICOR,
            EFFECTS.EFFECT_HERBIVORES,
            EFFECTS.EFFECT_STANDARD_TECHNOLOGY,
         ]
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
