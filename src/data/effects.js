import { ACTIONS_GAME } from '../util/actionsGame'
import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import { SP } from './StandardProjects'
// Corporation effects icons
import credicor from '../assets/images/effects/credicor.png'
import ecoline from '../assets/images/effects/ecoline.png'
import helion from '../assets/images/effects/helion.png'
import interplanetary from '../assets/images/effects/interplanetary.png'
import inventrix from '../assets/images/effects/inventrix.png'
import miningGuild from '../assets/images/effects/miningGuild.png'
import phobolog from '../assets/images/effects/phobolog.png'
import saturnSystems from '../assets/images/effects/saturnSystems.png'
import teractor from '../assets/images/effects/teractor.png'
import tharsis from '../assets/images/effects/tharsis.png'
import thorgate from '../assets/images/effects/thorgate.png'
// Card effects icons
import mediaGroup from '../assets/images/effects/mediaGroup.png'
import herbivores from '../assets/images/effects/herbivores.png'
import roverConstruction from '../assets/images/effects/roverConstruction.png'
import immigrantCity from '../assets/images/effects/immigrantCity.png'
import arcticAlgae from '../assets/images/effects/arcticAlgae.png'
import pets from '../assets/images/effects/pets.png'
import standardTechnology from '../assets/images/effects/standardTechnology.png'

export const getEffectIcon = (effect) => {
   switch (effect) {
      // Corporation effect icons
      case EFFECTS.EFFECT_CREDICOR:
         return credicor
      case EFFECTS.EFFECT_ECOLINE:
         return ecoline
      case EFFECTS.EFFECT_HELION:
         return helion
      case EFFECTS.EFFECT_INTERPLANETARY:
         return interplanetary
      case EFFECTS.EFFECT_INVENTRIX:
         return inventrix
      case EFFECTS.EFFECT_MINING_GUILD:
         return miningGuild
      case EFFECTS.EFFECT_PHOBOLOG:
         return phobolog
      case EFFECTS.EFFECT_SATURN_SYSTEMS:
         return saturnSystems
      case EFFECTS.EFFECT_TERACTOR:
         return teractor
      case EFFECTS.EFFECT_THARSIS_CITY:
         return tharsis
      case EFFECTS.EFFECT_THARSIS_CITY_ONPLANET:
         return tharsis
      case EFFECTS.EFFECT_THORGATE:
         return thorgate
      case EFFECTS.EFFECT_MEDIA_GROUP:
         return mediaGroup
      case EFFECTS.EFFECT_HERBIVORES:
         return herbivores
      case EFFECTS.EFFECT_ROVER_CONSTRUCTION:
         return roverConstruction
      case EFFECTS.EFFECT_IMMIGRANT_CITY:
         return immigrantCity
      case EFFECTS.EFFECT_ARCTIC_ALGAE:
         return arcticAlgae
      case EFFECTS.EFFECT_PETS:
         return pets
      case EFFECTS.EFFECT_STANDARD_TECHNOLOGY:
         return standardTechnology
      default:
         return
   }
}

export const EFFECTS = {
   // Corporation Effects
   EFFECT_CREDICOR: 'Gain 4M after playing card with 20+ mln base cost.',
   EFFECT_ECOLINE: 'Pay 7 plants, instead of 8, to place 1 greenery.',
   EFFECT_HELION: 'You can pay with heat instead of mln.',
   EFFECT_INTERPLANETARY: 'Gain 2M after playing event card.',
   EFFECT_INVENTRIX: 'Treat global parameters requirements as they are -2 or +2.',
   EFFECT_MINING_GUILD: 'Gain 1 steel prod after placing a tile on a steel/titan bonus field.',
   EFFECT_PHOBOLOG: 'Titan value is increased by 1.',
   EFFECT_SATURN_SYSTEMS: 'Gain 1 mln production after playing a card with jovian.',
   EFFECT_TERACTOR: 'Card with earth tag costs 3M less.',
   EFFECT_THARSIS_CITY: 'Gain 3M after placing a city',
   EFFECT_THARSIS_CITY_ONPLANET: 'Gain 1M prod after placing a city on tharsis planet',
   EFFECT_THORGATE: 'Start with 1 energy prod. Gain 3M after paying for standard project.',
   // Cost deduction card effects
   EFFECT_EARTH_OFFICE: 'Earth cards cost 3M less (earth office)',
   EFFECT_SPACE_STATION: 'Space cards cost 2M less (space station)',
   EFFECT_SHUTTLES: 'Space cards cost 2M less (shuttles)',
   EFFECT_MASS_CONVERTER: 'Space cards cost 2M less (mass converter)',
   EFFECT_QUANTUM_EXTRACTOR: 'Space cards cost 2M less (quantum extractor)',
   EFFECT_ANTIGRAVITY_TECHNOLOGY: 'Cards cost 2M less (anti-gravity technology)',
   EFFECT_EARTH_CATAPULT: 'Cards cost 2M less (earth catapult)',
   EFFECT_RESEARCH_OUTPOST: 'Cards cost 1M less (research outpost)',
   // Card Effects
   EFFECT_MEDIA_GROUP: 'Gain 3M after playing an event card',
   EFFECT_ARCTIC_ALGAE: 'Gain 2 plants after placing an ocean',
   EFFECT_HERBIVORES: 'Gain 1 animal after placing a greenery',
   EFFECT_ROVER_CONSTRUCTION: 'Gain 2M after placing a city',
   EFFECT_IMMIGRANT_CITY: 'Increase 1 mln production after placing a city',
   EFFECT_PETS: 'Add 1 animal to this card when a city is placed',
   EFFECT_STANDARD_TECHNOLOGY: 'Gain 3M after standard project (excluding sell patents)',
}

// ============================= LIST OF CORPORATION IMMEDIATE EFFECTS =============================
export const performImmediateCorpEffect = (corp, dispatchPlayer, dispatchGame) => {
   switch (corp.name) {
      case 'Ecoline':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 7 })
         break
      case 'Helion':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: true })
         break
      case 'Inventrix':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_PARAMETERS_REQUIREMENTS, payload: 2 })
         break
      case 'Phobolog':
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_TITAN, payload: 4 })
         break
      case 'Thorgate':
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 })
         dispatchGame({ type: ACTIONS_GAME.SET_POWERPLANT_COST, payload: 8 })
         // The 'Power cards cost 3M less' effect is called in the modifiedCards function
         break
      case 'Teractor':
         // This effect is called in the modifiedCards function
         break
      default:
         break
   }
}

// ================================== LIST OF ALL CARD EFFECTS ====================================
// This includes all card and corporation effects in game EXCEPT immediate effects from corporations
export const funcGetEffect = (effectName, dispatchPlayer) => {
   let effect = {}
   switch (effectName) {
      // ======================== CORPORATION EFFECTS ========================
      case EFFECTS.EFFECT_CREDICOR:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 4 }),
         }
         break
      case EFFECTS.EFFECT_INTERPLANETARY:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 }),
         }
         break
      case EFFECTS.EFFECT_MINING_GUILD:
         effect = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         }
         break
      case EFFECTS.EFFECT_SATURN_SYSTEMS:
         effect = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         }
         break
      case EFFECTS.EFFECT_THARSIS_CITY:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
         }
         break
      case EFFECTS.EFFECT_THARSIS_CITY_ONPLANET:
         effect = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         }
         break
      // ========================== CARD EFFECTS ==========================
      case EFFECTS.EFFECT_MEDIA_GROUP:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
         }
         break
      case EFFECTS.EFFECT_ARCTIC_ALGAE:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
         }
         break
      case EFFECTS.EFFECT_HERBIVORES:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: 147, resource: RESOURCES.ANIMAL, amount: 1 },
               }),
         }
         break
      case EFFECTS.EFFECT_ROVER_CONSTRUCTION:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 2 }),
         }
         break
      case EFFECTS.EFFECT_IMMIGRANT_CITY:
         effect = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         }
         break
      case EFFECTS.EFFECT_PETS:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: 172, resource: RESOURCES.ANIMAL, amount: 1 },
               }),
         }
         break
      case EFFECTS.EFFECT_STANDARD_TECHNOLOGY:
         effect = {
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 3 }),
         }
         break
      default:
         break
   }
   return effect
}

export const getSPeffectsToCall = (SpOrConvertPlants) => {
   switch (SpOrConvertPlants) {
      case SP.POWER_PLANT:
         return [EFFECTS.EFFECT_STANDARD_TECHNOLOGY]
      case SP.ASTEROID:
         return [EFFECTS.EFFECT_STANDARD_TECHNOLOGY]
      case SP.AQUIFER:
         return [
            EFFECTS.EFFECT_ARCTIC_ALGAE,
            EFFECTS.EFFECT_MINING_GUILD,
            EFFECTS.EFFECT_STANDARD_TECHNOLOGY,
         ]
      case SP.GREENERY:
         return [
            EFFECTS.EFFECT_MINING_GUILD,
            EFFECTS.EFFECT_HERBIVORES,
            EFFECTS.EFFECT_STANDARD_TECHNOLOGY,
         ]
      case SP.CITY:
         return [
            EFFECTS.EFFECT_MINING_GUILD,
            EFFECTS.EFFECT_ROVER_CONSTRUCTION,
            EFFECTS.EFFECT_IMMIGRANT_CITY,
            EFFECTS.EFFECT_THARSIS_CITY,
            EFFECTS.EFFECT_THARSIS_CITY_ONPLANET,
            EFFECTS.EFFECT_PETS,
            EFFECTS.EFFECT_STANDARD_TECHNOLOGY,
         ]
      case SP.CONVERT_PLANTS:
         return [EFFECTS.EFFECT_MINING_GUILD, EFFECTS.EFFECT_HERBIVORES]
      case SP.AQUIFER_BONUS:
         return [EFFECTS.EFFECT_ARCTIC_ALGAE, EFFECTS.EFFECT_MINING_GUILD]
      default:
         return []
   }
}
