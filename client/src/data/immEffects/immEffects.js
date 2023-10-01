import { ACTIONS_PLAYER } from '../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../stateActions/actionsGame'
import { ANIMATIONS } from '../animations'
import { TILES } from '../board'
import { ACTIONS_BOARD } from '../../stateActions/actionsBoard'
import { RESOURCES } from '../resources'
import { getOptions } from '../selectOneOptions'
import {
   getCards,
   getCardsWithDecreasedCost,
   hasTag,
   getCardsWithPossibleAnimals,
   getCardsWithPossibleFighters,
   getCardsWithPossibleMicrobes,
   getCardsWithPossibleScience,
   getNewCardsDrawIds,
   getCardsWithTimeAdded,
   getCardsWithTimePlayed
} from '../../utils/cards'
import { TAGS } from '../tags'
import { CORP_NAMES } from '../corpNames'
import { EFFECTS } from '../effects/effectIcons'
import { LOG_ICONS, funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter } from '../log/log'

export const IMM_EFFECTS = {
   POWER_PLANT: 'Increase energy production 1 step',
   TEMPERATURE: 'Increase temperature by 2 degrees',
   TEMPERATURE4: 'Increase temperature by 4 degrees',
   TEMPERATURE6: 'Increase temperature by 6 degrees',
   AQUIFER: 'Place an ocean',
   AQUIFER2: 'Place two oceans',
   GREENERY: 'Place greenery',
   GREENERY_WO_OX: 'Place greenery w/o oxygen',
   OXYGEN: 'Increase oxygen by 1%',
   OXYGEN2: 'Increase oxygen by 2%',
   CITY: 'Place a city',
   TR: 'Increase TR level',
   TR2: 'Increase TR level by 2',
   MINING_GUILD: 'Increase steel production by 1',
}

export const funcGetImmEffects = (
   actionOrCardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   stateBoard,
   dispatchBoard,
   modals,
   setModals,
   type,
   id,
   token,
   getImmEffects,
   sound,
   initDrawCardsIds,
   setLogItems
) => {
   let subActions = []
   let dataCards = []
   let value = 0
   let newCardsDrawIds = []
   let cardsInHand = statePlayer.cardsInHand
   let cardsPlayed = statePlayer.cardsPlayed
   let cardsSeen = statePlayer.cardsSeen
   switch (actionOrCardId) {
      // ============================= SP POWER PLANT ============================
      // cards with ONLY this action: Solar Power, Wave Power, Power Plant, Power Supply Consortium,
      // Windmills, Heat Trappers, Energy Tapping
      case IMM_EFFECTS.POWER_PLANT:
      case 113:
      case 139:
      case 141:
      case 160:
      case 168:
      case 178:
      case 201:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 })
               funcSetLogItemsSingleActions(`Energy production increased by 1`, [RESOURCES.PROD_BG, RESOURCES.ENERGY], 1, setLogItems)
            },
         })
         break
      // =================== INCREASE TEMPERATURE BY 2 DEGREES ===================
      case IMM_EFFECTS.TEMPERATURE:
         if (stateGame.globalParameters.temperature < 8) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
                  funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, null, setLogItems)
               },
            })
            // Bonus heat production
            if (stateGame.globalParameters.temperature === -26 || stateGame.globalParameters.temperature === -22) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                     funcSetLogItemsSingleActions('Heat production increased by 1 from temperature bonus', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1, setLogItems)
                  },
               })
               // Bonus ocean
            } else if (stateGame.globalParameters.temperature === -2) {
               subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
            }
         }
         break
      // =================== INCREASE TEMPERATURE BY 4 DEGREES ===================
      case IMM_EFFECTS.TEMPERATURE4:
         if (stateGame.globalParameters.temperature < 8) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  if (stateGame.globalParameters.temperature < 6) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                     funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat production
            if (
               (stateGame.globalParameters.temperature >= -28 && stateGame.globalParameters.temperature <= -26) ||
               (stateGame.globalParameters.temperature >= -24 && stateGame.globalParameters.temperature <= -22)
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                     funcSetLogItemsSingleActions('Heat production increased by 1 from temperature bonus', RESOURCES.HEAT, 1, setLogItems)
                  },
               })
               // Bonus ocean
            } else if (stateGame.globalParameters.temperature >= -4 && stateGame.globalParameters.temperature <= -2) {
               subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
            }
         }
         break
      // =================== INCREASE TEMPERATURE BY 6 DEGREES ===================
      case IMM_EFFECTS.TEMPERATURE6:
         if (stateGame.globalParameters.temperature < 8) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  if (stateGame.globalParameters.temperature < 6) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                     funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  }
                  if (stateGame.globalParameters.temperature < 4) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                     funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat productions
            if (stateGame.globalParameters.temperature >= -30 && stateGame.globalParameters.temperature <= -26) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                     funcSetLogItemsSingleActions('Heat production increased by 1 from temperature bonus', RESOURCES.HEAT, 1, setLogItems)
                  },
               })
            }
            if (stateGame.globalParameters.temperature >= -26 && stateGame.globalParameters.temperature <= -22) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                     funcSetLogItemsSingleActions('Heat production increased by 1 from temperature bonus', RESOURCES.HEAT, 1, setLogItems)
                  },
               })
               // Bonus ocean
            }
            if (stateGame.globalParameters.temperature >= -6 && stateGame.globalParameters.temperature <= -2) {
               subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
            }
         }
         break
      // =============================== PLACE OCEAN TILE ============================
      // cards with ONLY this action: Subterranean Reservoir, Ice Cap Melting, Flooding,
      // Permafrost Extraction
      case IMM_EFFECTS.AQUIFER:
      case 127:
      case 181:
      case 188:
      case 191:
         if (stateGame.globalParameters.oceans < 9) {
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
                  dispatchGame({
                     type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                     payload: TILES.OCEAN,
                  })
                  dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.OCEAN })
               },
            })
            // Increase oceans meter
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Add 2 plants if Arctic Algae effect is ON
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE)) {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.PLANT,
                  value: 2,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
                     funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
                  },
               })
            }
         }
         break
      // ============================== PLACE GREENERY TILE ==========================
      // card with ONLY this action: Plantation
      case IMM_EFFECTS.GREENERY:
      case 193:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.GREENERY,
               })
               dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.GREENERY })
            },
         })
         // Increase oxygen
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN)]
         break
      // ======================== PLACE GREENERY TILE WITHOUT OXYGEN =================
      case IMM_EFFECTS.GREENERY_WO_OX:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.GREENERY,
               })
               dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.GREENERY })
            },
         })
         break
      // ================================= INCREASE OXYGEN BY 1% ===========================
      case IMM_EFFECTS.OXYGEN:
         if (stateGame.globalParameters.oxygen < 14 && !stateGame.phaseAfterGen14) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
                  funcSetLogItemsSingleActions('Oxygen raised by 1 percent', LOG_ICONS.OXYGEN, 1, setLogItems)
               },
            })
         }
         // Bonus temperature
         if (stateGame.globalParameters.oxygen === 7 && stateGame.globalParameters.temperature < 8) {
            subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         }
         break
      // ================================= INCREASE OXYGEN BY 2% ===========================
      case IMM_EFFECTS.OXYGEN2:
         if (stateGame.globalParameters.oxygen < 14 && !stateGame.phaseAfterGen14) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  funcSetLogItemsSingleActions('Oxygen raised by 1 percent', LOG_ICONS.OXYGEN, 1, setLogItems)
                  if (stateGame.globalParameters.oxygen < 13) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                     funcSetLogItemsSingleActions('Oxygen raised by 1 percent', LOG_ICONS.OXYGEN, 1, setLogItems)
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         // Bonus temperature
         if (stateGame.globalParameters.oxygen >= 6 && stateGame.globalParameters.oxygen <= 7 && stateGame.globalParameters.temperature < 8 && !stateGame.phaseAfterGen14) {
            subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         }
         break
      // ================================= PLACE CITY TILE ===========================
      case IMM_EFFECTS.CITY:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({ type: ACTIONS_BOARD.SET_AVAILABLE, payload: TILES.CITY })
            },
         })
         break
      // ================================ INCREASE TR BY 1 ===========================
      case IMM_EFFECTS.TR:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions('TR raised by 1', RESOURCES.TR, 1, setLogItems)
            },
         })
         break
      // ================================ INCREASE TR BY 2 ===========================
      // cards with only this action: Release Of Inert Gases, Bribed Committee
      case IMM_EFFECTS.TR2:
      case 36:
      case 112:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 2 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions('TR raised by 2', RESOURCES.TR, 2, setLogItems)
            },
         })
         break
      // ========================== Mining Guild immediate effect ====================
      // cards with ONLY this action: Mine, Great Escarpment Consortium
      case IMM_EFFECTS.MINING_GUILD:
      case 56:
      case 61:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               funcSetLogItemsSingleActions('Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1, setLogItems)
            },
         })
         break
      // ============================= CARD IMMEDIATE EFFECTS ========================
      // Asteroid Mining Consortium
      case 2:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         })
         break
      // Deep Well Heating
      case 3:
         subActions = getImmEffects(IMM_EFFECTS.POWER_PLANT)
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Cloud Seeding
      case 4:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
               funcSetLogItemsSingleActions('MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         break
      // Search For Life, Inventors' Guild, Water Import From Europa, Development Center, Equatorial Magnetizer, Predators, Security Fleet,
      // Regolith Eaters, GHG Producing Bacteria, Ants, Tardigrades, Fish, Small Animals, Birds, Space Mirrors, Physics Complex, IronWorks,
      // Steelworks, Ore Processor, Symbiotic Fungus, Extreme-Cold Fungus, Caretaker Contract, Water Splitting Plant, Aquifer Pumping,
      // Power Infrastructure, Underground Detonations
      case 5:
      case 6:
      case 12:
      case 14:
      case 15:
      case 24:
      case 28:
      case 33:
      case 34:
      case 35:
      case 49:
      case 52:
      case 54:
      case 72:
      case 76:
      case 95:
      case 101:
      case 103:
      case 104:
      case 133:
      case 134:
      case 154:
      case 177:
      case 187:
      case 194:
      case 202:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Capital
      case 8:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
               funcSetLogItemsSingleActions('Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 5 })
               funcSetLogItemsSingleActions('MC production increased by 5', [RESOURCES.PROD_BG, RESOURCES.MLN], 5, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_CITY_CAPITAL,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_CITY_CAPITAL,
               })
            },
         })
         break
      // Asteroid
      case 9:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 titanium', RESOURCES.TITAN, 2, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Comet
      case 10:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         // subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         // The reason why we dont use above line instead of below lines is that
         // if we play this card at -2 degrees and 8 oceans, after placing ocean,
         // the TEMPERATURE still thinks its 8 oceans and we are able to place 10th ocean.
         if (stateGame.globalParameters.temperature < 8) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
                  funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, null, setLogItems)
               },
            })
            // Bonus heat production
            if (stateGame.globalParameters.temperature === -26 || stateGame.globalParameters.temperature === -22) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                     funcSetLogItemsSingleActions('Heat production increased by 1 from temperature bonus', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1, setLogItems)
                  },
               })
               // Bonus ocean
            } else if (stateGame.globalParameters.temperature === -2 && stateGame.globalParameters.oceans <= 7) {
               subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
            }
         }
         break
      // Big Asteroid
      case 11:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 4 })
               funcSetLogItemsSingleActions('Received 4 titanium', RESOURCES.TITAN, 4, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE4)]
         break
      // Space Elevator
      case 13:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
               funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Domed Crater
      case 16:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
               funcSetLogItemsSingleActions('MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
               funcSetLogItemsSingleActions('Received 3 plants', RESOURCES.PLANT, 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.CITY,
               })
            },
         })
         break
      // Noctis City
      case 17:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
               funcSetLogItemsSingleActions('MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_CITY_NOCTIS,
               })
            },
         })
         break
      // Methane From Titan
      case 18:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
               funcSetLogItemsSingleActions('Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         break
      // Imported Hydrogen
      case 19:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: cardsInHand.find((card) => card.id === actionOrCardId),
                     options: getOptions(actionOrCardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Research Outpost
      case 20:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_RESEARCH_OUTPOST,
               })
            },
         })
         break
      // Phobos Space Haven
      case 21:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_CITY_PHOBOS,
               })
            },
         })
         break
      // Black Polar Dust
      case 22:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
               funcSetLogItemsSingleActions('MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
               funcSetLogItemsSingleActions('Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Arctic Algae
      case 23:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant', RESOURCES.PLANT, 1, setLogItems)
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Space Station
      case 25:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_SPACE_STATION
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_SPACE_STATION
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Eos Chasma National Park
      case 26:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
               funcSetLogItemsSingleActions('Received 3 plants', RESOURCES.PLANT, 3, setLogItems)
            },
         })
         dataCards = getCardsWithPossibleAnimals(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prev) => ({
                     ...prev,
                     modalResource: {
                        cardId: dataCards[0].id,
                        amount: 1,
                        data: dataCards,
                        resType: RESOURCES.ANIMAL,
                     },
                     resource: true,
                  }))
               },
            })
         break
      // Cupola City, Corporate Stronghold
      case 29:
      case 182:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
               funcSetLogItemsSingleActions('MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.CITY,
               })
            },
         })
         break
      // Lunar Beam
      case 30:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
               funcSetLogItemsSingleActions('MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
               funcSetLogItemsSingleActions('Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
               funcSetLogItemsSingleActions('Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2, setLogItems)
            },
         })
         break
      // Optimal Aerobraking
      case 31:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Underground City
      case 32:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
               funcSetLogItemsSingleActions('Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 })
               funcSetLogItemsSingleActions('Steel production increased by 2', [RESOURCES.PROD_BG, RESOURCES.STEEL], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.CITY,
               })
            },
         })
         break
      // Nitrogen-Rich Asteroid
      case 37:
         if (
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.PLANT) ? total + 1 : total), 0) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.PLANT ? total + 1 : total), 0) <
            3
         ) {
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: 1,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
                  funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
               },
            })
         } else {
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: 4,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 4 })
                  funcSetLogItemsSingleActions('Plant production increased by 4', [RESOURCES.PROD_BG, RESOURCES.PLANT], 4, setLogItems)
               },
            })
         }
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TR2)]
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Rover Construction
      case 38:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Deimos Down
      case 39:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 4 })
               funcSetLogItemsSingleActions('Received 4 steel', RESOURCES.STEEL, 4, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE6)]
         break
      // Asteroid Mining
      case 40:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 2 })
               funcSetLogItemsSingleActions('Titanium production increased by 2', [RESOURCES.PROD_BG, RESOURCES.TITAN], 2, setLogItems)
            },
         })
         break
      // Food Factory
      case 41:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: -1 })
               funcSetLogItemsSingleActions('Plant production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 })
               funcSetLogItemsSingleActions('MC production increased by 4', [RESOURCES.PROD_BG, RESOURCES.MLN], 4, setLogItems)
            },
         })
         break
      // Archaebacteria, Adapted Lichen, Lichen
      case 42:
      case 48:
      case 159:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         break
      // Carbonate Processing
      case 43:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
               funcSetLogItemsSingleActions('Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3, setLogItems)
            },
         })
         break
      // Natural Preserve
      case 44:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               funcSetLogItemsSingleActions('MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_NATURAL_PRESERVE,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_NATURAL_PRESERVE,
               })
            },
         })
         break
      // Nuclear Power
      case 45:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
               funcSetLogItemsSingleActions('MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
               funcSetLogItemsSingleActions('Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3, setLogItems)
            },
         })
         break
      // Lightning Harvest
      case 46:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               funcSetLogItemsSingleActions('MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.POWER_PLANT)]
         break
      // Algae
      case 47:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant', RESOURCES.PLANT, 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         break
      // Miranda Resort
      case 51:
         value =
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.EARTH) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 0) +
            statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.EARTH ? total + 1 : total), 0)
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
                  funcSetLogItemsSingleActions(`MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value, setLogItems)
               },
            })
         break
      // Lake Marineris
      case 53:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         if (stateGame.globalParameters.oceans <= 7) subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Kelp Farming
      case 55:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 })
               funcSetLogItemsSingleActions('Plant production increased by 3', [RESOURCES.PROD_BG, RESOURCES.PLANT], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
            },
         })
         break
      // Vesta Shipyard
      case 57:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         })
         break
      // Beam From A Thorium Asteroid
      case 58:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
               funcSetLogItemsSingleActions('Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
               funcSetLogItemsSingleActions('Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3, setLogItems)
            },
         })
         break
      // Mangrove
      case 59:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.GREENERY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_MOHOLE_AREA,
               }) // Same spots availability as mohole area or protected valley
            },
         })
         // Increase oxygen
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN)]
         break
      // Trees
      case 60:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 })
               funcSetLogItemsSingleActions('Plant production increased by 3', [RESOURCES.PROD_BG, RESOURCES.PLANT], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant', RESOURCES.PLANT, 1, setLogItems)
            },
         })
         break
      // Mineral Deposit
      case 62:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 5,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 5 })
               funcSetLogItemsSingleActions('Received 5 steel', RESOURCES.STEEL, 5, setLogItems)
            },
         })
         break
      // Mining Expedition
      case 63:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 steel', RESOURCES.STEEL, 2, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN)]
         break
      // Mining Area
      case 64:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_MINING_AREA,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_MINING_AREA,
               })
            },
         })
         // Steel / titan production addition implemented directly in the Field component
         break
      // Building Industries
      case 65:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 })
               funcSetLogItemsSingleActions('Steel production increased by 2', [RESOURCES.PROD_BG, RESOURCES.STEEL], 2, setLogItems)
            },
         })
         break
      // Mining Rights
      case 67:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_MINING_RIGHTS,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_MINING_RIGHTS,
               })
            },
         })
         // Steel / titan production addition implemented directly in the Field component
         break
      // Sponsors
      case 68:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         break
      // Electro Catapult
      case 69:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
               funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Earth Catapult
      case 70:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_EARTH_CATAPULT
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_EARTH_CATAPULT
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Advanced Alloys
      case 71:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_VALUE_STEEL, payload: 1 })
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_VALUE_TITAN, payload: 1 })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Mars University
      case 73:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Viral Enhancers
      case 74:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant from VIRAL ENHANCERS effect', RESOURCES.PLANT, 1, setLogItems)
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Towing A Comet
      case 75:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN)]
         break
      // Solar Wind Power
      case 77:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 titanium', RESOURCES.TITAN, 2, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.POWER_PLANT)]
         break
      // Ice Asteroid
      case 78:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         if (stateGame.globalParameters.oceans <= 7) subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Quantum Extractor
      case 79:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 4 })
               funcSetLogItemsSingleActions('Energy production increased by 4', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 4, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_QUANTUM_EXTRACTOR
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_QUANTUM_EXTRACTOR
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Giant Ice Asteroid
      case 80:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         if (stateGame.globalParameters.oceans <= 7) subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         if (stateGame.globalParameters.temperature < 8) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  if (stateGame.globalParameters.temperature < 6) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                     funcSetLogItemsSingleActions('Temperature raised by 2 degrees', LOG_ICONS.TEMPERATURE, 1, setLogItems)
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat production
            if (
               (stateGame.globalParameters.temperature >= -28 && stateGame.globalParameters.temperature <= -26) ||
               (stateGame.globalParameters.temperature >= -24 && stateGame.globalParameters.temperature <= -22)
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
                     funcSetLogItemsSingleActions('Heat production increased by 1 from temperature bonus', RESOURCES.HEAT, 1, setLogItems)
                  },
               })
               // Bonus ocean
            } else if (stateGame.globalParameters.temperature >= -4 && stateGame.globalParameters.temperature <= -2 && stateGame.globalParameters.oceans <= 6) {
               subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
            }
         }
         break
      // Ganymede Colony
      case 81:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_CITY_GANYMEDE,
               })
            },
         })
         break
      // Callisto Penal Mines
      case 82:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
               funcSetLogItemsSingleActions('MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3, setLogItems)
            },
         })
         break
      // Giant Space Mirror
      case 83:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
               funcSetLogItemsSingleActions('Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3, setLogItems)
            },
         })
         break
      // Commercial District
      case 85:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 })
               funcSetLogItemsSingleActions('MC production increased by 4', [RESOURCES.PROD_BG, RESOURCES.MLN], 4, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_COMMERCIAL_DISTRICT,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_COMMERCIAL_DISTRICT,
               })
            },
         })
         break
      // Robotic Workforce
      case 86:
         dataCards = statePlayer.cardsPlayed.filter((card) => hasTag(card, TAGS.BUILDING))
         dataCards = dataCards.filter((card) => {
            let isAnyProduction = false
            let prodReqMet = true
            if (card.id === 64 || card.id === 67) return true // If Mining rights or Mining Area, always include those productions
            let immEffects = getImmEffects(card.id)
            immEffects.forEach((immEffect) => {
               if (immEffect.name === ANIMATIONS.PRODUCTION_IN) {
                  isAnyProduction = true
               } else if (immEffect.name === ANIMATIONS.PRODUCTION_OUT) {
                  isAnyProduction = true
                  if (immEffect.type === RESOURCES.MLN && statePlayer.production.mln - immEffect.value < -5) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (immEffect.type === RESOURCES.STEEL && statePlayer.production.steel < immEffect.value) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (immEffect.type === RESOURCES.TITAN && statePlayer.production.steel < immEffect.value) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (immEffect.type === RESOURCES.PLANT && statePlayer.production.plant < immEffect.value) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (immEffect.type === RESOURCES.ENERGY && statePlayer.production.energy < immEffect.value) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (immEffect.type === RESOURCES.HEAT && statePlayer.production.heat < immEffect.value) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  }
               }
            })
            return isAnyProduction && prodReqMet
         })
         let immProdEffects = []
         if (statePlayer.corporation.name === CORP_NAMES.MINING_GUILD) {
            immProdEffects = getImmEffects(IMM_EFFECTS.MINING_GUILD)
         } else {
            if (dataCards[0].id === 64) {
               immProdEffects = [modals.modalProduction.miningArea]
            } else if (dataCards[0].id === 67) {
               immProdEffects = [modals.modalProduction.miningRights]
            } else {
               immProdEffects = getImmEffects(dataCards[0].id).filter(
                  (immProdEffect) => immProdEffect.name === ANIMATIONS.PRODUCTION_IN || immProdEffect.name === ANIMATIONS.PRODUCTION_OUT
               )
            }
         }
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalProduction: {
                     ...prev.modalProduction,
                     cardIdOrCorpName: statePlayer.corporation.name === CORP_NAMES.MINING_GUILD ? CORP_NAMES.MINING_GUILD : dataCards[0].id,
                     data: dataCards,
                     immProdEffects: immProdEffects,
                  },
                  production: true,
               }))
            },
         })
         break
      // Grass
      case 87:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 })
               funcSetLogItemsSingleActions('Received 3 plants', RESOURCES.PLANT, 3, setLogItems)
            },
         })
         break
      // Heather
      case 88:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant', RESOURCES.PLANT, 1, setLogItems)
            },
         })
         break
      // Peroxide Power
      case 89:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
               funcSetLogItemsSingleActions('MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
               funcSetLogItemsSingleActions('Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2, setLogItems)
            },
         })
         break
      // Research
      case 90:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: async () => {
               newCardsDrawIds = initDrawCardsIds?.slice(0, 2) || (await getNewCardsDrawIds(2, statePlayer, dispatchPlayer, type, id, token))
               cardsInHand = [
                  ...cardsInHand.filter((card) => card.id !== actionOrCardId),
                  ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer),
               ]
               cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
               const newCardsDrawNames = getCards(newCardsDrawIds).map((c) => c.name)
               funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
               cardsPlayed = [...cardsPlayed, ...getCardsWithTimePlayed([modals.modalCard])]
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand, cardsPlayed }, stateGame)
            },
         })
         // Call Olympus Conference effect
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
            subActions.push({
               name: ANIMATIONS.CARD_IN,
               type: RESOURCES.CARD,
               value: 1,
               func: async () => {
                  newCardsDrawIds = initDrawCardsIds?.slice(2) || (await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, newCardsDrawIds))
                  cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
                  cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                     payload: cardsInHand,
                  })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
                  funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1, setLogItems)
               },
            })
         }
         // Call Mars University
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY)) {
            if (cardsInHand.filter((card) => card.id !== modals.modalCard.id).length > 0)
               modals.modalCard.tags.forEach((tag) => {
                  if (tag === TAGS.SCIENCE)
                     subActions.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        type: null,
                        value: null,
                        func: () => {
                           dispatchGame({
                              type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY,
                              payload: true,
                           })
                           setModals((prev) => ({ ...prev, marsUniversity: true }))
                        },
                     })
               })
         }
         break
      // Gene Repair
      case 91:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         break
      // IO Mining Industries
      case 92:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 2 })
               funcSetLogItemsSingleActions('Titanium production increased by 2', [RESOURCES.PROD_BG, RESOURCES.TITAN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         break
      // Bushes
      case 93:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
            },
         })
         break
      // Mass Converter
      case 94:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 6,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 6 })
               funcSetLogItemsSingleActions('Energy production increased by 6', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 6, setLogItems)
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_MASS_CONVERTER
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_MASS_CONVERTER
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Greenhouses
      case 96:
         value = stateBoard.reduce(
            (total, field) => (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL ? total + 1 : total),
            0
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.PLANT,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value })
                  funcSetLogItemsSingleActions(value === 1 ? 'Received 1 plant' : `Received ${value} plants`, RESOURCES.PLANT, value, setLogItems)
               },
            })
         break
      // Nuclear Zone
      case 97:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_NUCLEAR_ZONE,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_NUCLEAR_ZONE,
               })
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE4)]
         break
      // Tropical Resort
      case 98:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: -2 })
               funcSetLogItemsSingleActions('Heat production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
               funcSetLogItemsSingleActions('MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3, setLogItems)
            },
         })
         break
      // Fueled Generators
      case 100:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
               funcSetLogItemsSingleActions('MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.POWER_PLANT)]
         break
      // Power Grid
      case 102:
         value =
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.POWER) ? total + 1 : total), 1) +
            statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.POWER ? total + 1 : total), 0)
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: value,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value })
               funcSetLogItemsSingleActions(`Energy production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.ENERGY], value, setLogItems)
            },
         })
         break
      // Earth Office
      case 105:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_EARTH_OFFICE
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_EARTH_OFFICE
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Acquired Company
      case 106:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 })
               funcSetLogItemsSingleActions('MC production increased by 3', [RESOURCES.PROD_BG, RESOURCES.MLN], 3, setLogItems)
            },
         })
         break
      // Media Archives
      case 107:
         value = statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.EVENT) ? total + 1 : total), 0)
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value })
                  funcSetLogItemsSingleActions(`Received ${value} MC`, RESOURCES.MLN, value, setLogItems)
               },
            })
         break
      // Open City
      case 108:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 })
               funcSetLogItemsSingleActions('MC production increased by 4', [RESOURCES.PROD_BG, RESOURCES.MLN], 4, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.CITY,
               })
            },
         })
         break
      // Media Group
      case 109:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Business Network
      case 110:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
               funcSetLogItemsSingleActions('MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1, setLogItems)
               funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Business Contacts
      case 111:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: async () => {
               newCardsDrawIds = await getNewCardsDrawIds(4, statePlayer, dispatchPlayer, type, id, token)
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_BUSINESS_CONTACTS, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalBusCont: { cards: newCardsDrawIds, selectCount: 2 },
                  businessContacts: true,
               }))
            },
         })
         break
      // Artificial Photosynthesis, Hired Raiders
      case 115:
      case 124:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: cardsInHand.find((card) => card.id === actionOrCardId),
                     options: getOptions(actionOrCardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Artificial Lake
      case 116:
         if (stateGame.globalParameters.oceans < 9) {
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
                  dispatchGame({
                     type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                     payload: TILES.OCEAN,
                  })
                  dispatchBoard({
                     type: ACTIONS_BOARD.SET_AVAILABLE,
                     payload: TILES.SPECIAL_RESTRICTED_AREA,
                  }) // Same spots availability as, i.e. restricted area (any field)
               },
            })
            // Increase oceans meter
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  sound.raiseParameter.play()
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Add 2 plants if Arctic Algae effect is ON
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE)) {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.PLANT,
                  value: 2,
                  func: () => {
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
                     funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
                  },
               })
            }
         }
         break
      // Geothermal Power, Great Dam, Biomass Combustors
      case 117:
      case 136:
      case 183:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 })
               funcSetLogItemsSingleActions('Energy production increased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 2, setLogItems)
            },
         })
         break
      // Farming
      case 118:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
            },
         })
         break
      // Urbanized Area
      case 120:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_URBANIZED_AREA,
               })
            },
         })
         break
      // Moss
      case 122:
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -1 })
               funcSetLogItemsSingleActions('Paid 1 plant', RESOURCES.PLANT, -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         break
      // Industrial Center
      case 123:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_INDUSTRIAL_CENTER,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_INDUSTRIAL_CENTER,
               })
            },
         })
         break
      // Hackers
      case 125:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         break
      // GHG Factories
      case 126:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 })
               funcSetLogItemsSingleActions('Heat production increased by 4', [RESOURCES.PROD_BG, RESOURCES.HEAT], 4, setLogItems)
            },
         })
         break
      // Ecological Zone
      case 128:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_ECOLOGICAL_ZONE,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_ECOLOGICAL_ZONE,
               })
            },
         })
         for (let i = 0; i < 2; i++) {
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.ANIMAL,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: { cardId: actionOrCardId, resource: RESOURCES.ANIMAL, amount: 1 },
                  })
                  funcSetLogItemsSingleActions('Received 1 animal to ECOLOGICAL ZONE card from its effect', RESOURCES.ANIMAL, 1, setLogItems)
               },
            })
         }
         break
      // Zeppelins
      case 129:
         value = stateBoard.reduce(
            (total, field) =>
               (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
               field.name !== 'PHOBOS SPACE HAVEN' &&
               field.name !== 'GANYMEDE COLONY'
                  ? total + 1
                  : total,
            0
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
                  funcSetLogItemsSingleActions(`MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value, setLogItems)
               },
            })
         break
      // Worms
      case 130:
         value = Math.floor(statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.MICROBE) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 1) / 2)
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value })
                  funcSetLogItemsSingleActions(`Plant production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.PLANT], value, setLogItems)
               },
            })
         break
      // Decomposers
      case 131:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.MICROBE, amount: 1 },
               })
               funcSetLogItemsSingleActions('Received 1 microbe to DECOMPOSERS card from its effect', RESOURCES.MICROBE, 1, setLogItems)
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Fusion Power
      case 132:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
               funcSetLogItemsSingleActions('Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3, setLogItems)
            },
         })
         break
      // Cartel
      case 137:
         value =
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.EARTH) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 1) +
            statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.EARTH ? total + 1 : total), 0)
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
               funcSetLogItemsSingleActions(`MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value, setLogItems)
            },
         })
         break
      // Strip Mine
      case 138:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
               funcSetLogItemsSingleActions('Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 })
               funcSetLogItemsSingleActions('Steel production increased by 2', [RESOURCES.PROD_BG, RESOURCES.STEEL], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN2)]
         break
      // Lava Flows
      case 140:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_LAVA_FLOWS,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_LAVA_FLOWS,
               })
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE4)]
         break
      // Mohole Area
      case 142:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_MOHOLE_AREA,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_MOHOLE_AREA,
               })
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 })
               funcSetLogItemsSingleActions('Heat production increased by 4', [RESOURCES.PROD_BG, RESOURCES.HEAT], 4, setLogItems)
            },
         })
         break
      // Large Convoy
      case 143:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: async () => {
               newCardsDrawIds = await getNewCardsDrawIds(2, statePlayer, dispatchPlayer, type, id, token)
               cardsInHand = [
                  ...cardsInHand.filter((card) => card.id !== actionOrCardId),
                  ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer),
               ]
               cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
               const newCardsDrawNames = getCards(newCardsDrawIds).map((c) => c.name)
               funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
               cardsPlayed = [...cardsPlayed, ...getCardsWithTimePlayed([modals.modalCard])]
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand, cardsPlayed }, stateGame)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: getCards([143])[0],
                     options: getOptions(actionOrCardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Titanium Mine
      case 144:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         })
         break
      // Tectonic Stress Power
      case 145:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 })
               funcSetLogItemsSingleActions('Energy production increased by 3', [RESOURCES.PROD_BG, RESOURCES.ENERGY], 3, setLogItems)
            },
         })
         break
      // Nitrophilic Moss
      case 146:
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -2 })
               funcSetLogItemsSingleActions('Paid 2 plants', RESOURCES.PLANT, -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         break
      // Herbivores
      case 147:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.ANIMAL, amount: 1 },
               })
               funcSetLogItemsSingleActions('Received 1 animal to HERBIVORES card', RESOURCES.ANIMAL, 1, setLogItems)
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Insects
      case 148:
         value =
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.PLANT) ? total + 1 : total), 0) +
            statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.PLANT ? total + 1 : total), 0)
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value })
                  funcSetLogItemsSingleActions(`Plant production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.PLANT], value, setLogItems)
               },
            })
         break
      // CEO's Favorite Project
      case 149:
         dataCards = [
            ...getCardsWithPossibleMicrobes(statePlayer),
            ...getCardsWithPossibleAnimals(statePlayer),
            ...getCardsWithPossibleScience(statePlayer),
            ...getCardsWithPossibleFighters(statePlayer),
         ]
         dataCards = dataCards.filter((card) => card.units.microbe > 0 || card.units.animal > 0 || card.units.science > 0 || card.units.fighter > 0)
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalResource: {
                     cardId: dataCards[0].id,
                     amount: 1,
                     data: dataCards,
                     resType: null,
                  },
                  resource: true,
               }))
            },
         })
         break
      // Anti-Gravity Technology
      case 150:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Investment Loan
      case 151:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 })
               funcSetLogItemsSingleActions('MC production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 10,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 10 })
               funcSetLogItemsSingleActions('Received 10 MC', RESOURCES.MLN, 10, setLogItems)
            },
         })
         break
      // Insulation
      case 152:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: cardsInHand.find((card) => card.id === actionOrCardId),
                     options: null,
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Adaptation Technology
      case 153:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: 2 })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Designed Microorganisms
      case 155:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         break
      // Standard Technology
      case 156:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Nitrite Reducing Bacteria
      case 157:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: 3,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.MICROBE, amount: 3 },
               })
               funcSetLogItemsSingleActions('Received 3 microbes to NITRITE REDUCING BACTERIA card', RESOURCES.MICROBE, 3, setLogItems)
               funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Industrial Microbes
      case 158:
         subActions = getImmEffects(IMM_EFFECTS.POWER_PLANT)
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               funcSetLogItemsSingleActions('Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1, setLogItems)
            },
         })
         break
      // Convoy From Europa
      case 161:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: async () => {
               newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token)
               cardsInHand = [
                  ...cardsInHand.filter((card) => card.id !== actionOrCardId),
                  ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer),
               ]
               cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
               funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name})`, RESOURCES.CARD, 1, setLogItems)
               cardsPlayed = [...cardsPlayed, ...getCardsWithTimePlayed([modals.modalCard])]
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand, cardsPlayed }, stateGame)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Imported GHG
      case 162:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
               funcSetLogItemsSingleActions('Heat production increased by 1', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: 3 })
               funcSetLogItemsSingleActions('Received 3 heat', RESOURCES.HEAT, 3, setLogItems)
            },
         })
         break
      // Imported Nitrogen
      case 163:
         subActions = getImmEffects(IMM_EFFECTS.TR)
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 4 })
               funcSetLogItemsSingleActions('Received 4 plants', RESOURCES.PLANT, 4, setLogItems)
            },
         })
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prev) => ({
                     ...prev,
                     modalResource: {
                        cardId: dataCards[0].id,
                        amount: 3,
                        data: dataCards,
                        resType: RESOURCES.MICROBE,
                     },
                     resource: true,
                  }))
               },
            })
         let newDataCards = getCardsWithPossibleAnimals(statePlayer)
         if (newDataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prev) => ({
                     ...prev,
                     modalResource: {
                        cardId: newDataCards[0].id,
                        amount: 2,
                        data: newDataCards,
                        resType: RESOURCES.ANIMAL,
                     },
                     resource: true,
                  }))
               },
            })
         break
      // Micro-Mills
      case 164:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 })
               funcSetLogItemsSingleActions('Heat production increased by 1', [RESOURCES.PROD_BG, RESOURCES.HEAT], 1, setLogItems)
            },
         })
         break
      // Magnetic Field Generators
      case 165:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -4 })
               funcSetLogItemsSingleActions('Energy production decreased by 4', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -4, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Plant production increased by 2', [RESOURCES.PROD_BG, RESOURCES.PLANT], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 3 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions('TR raised by 3', RESOURCES.TR, 3, setLogItems)
            },
         })
         break
      // Shuttles
      case 166:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = getCardsWithDecreasedCost(
                  cardsInHand.filter((card) => card.id !== actionOrCardId),
                  statePlayer,
                  EFFECTS.EFFECT_SHUTTLES
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = getCardsWithDecreasedCost(
                  [...statePlayer.cardsPlayed, ...getCardsWithTimePlayed([cardsInHand.find((card) => card.id === actionOrCardId)])],
                  statePlayer,
                  EFFECTS.EFFECT_SHUTTLES
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Import of Advanced GHG
      case 167:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 })
               funcSetLogItemsSingleActions('Heat production increased by 2', [RESOURCES.PROD_BG, RESOURCES.HEAT], 2, setLogItems)
            },
         })
         break
      // Tundra Farming
      case 169:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Received 1 plant', RESOURCES.PLANT, 1, setLogItems)
            },
         })
         break
      // Aerobraked Ammonia Asteroid
      case 170:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 })
               funcSetLogItemsSingleActions('Heat production increased by 3', [RESOURCES.PROD_BG, RESOURCES.HEAT], 3, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prev) => ({
                     ...prev,
                     modalResource: {
                        cardId: dataCards[0].id,
                        amount: 2,
                        data: dataCards,
                        resType: RESOURCES.MICROBE,
                     },
                     resource: true,
                  }))
               },
            })
         break
      // Magnetic Field Dome
      case 171:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 })
               funcSetLogItemsSingleActions('Energy production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TR)]
         break
      // Pets
      case 172:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.ANIMAL, amount: 1 },
               })
               funcSetLogItemsSingleActions('Received 1 animal to PETS card', RESOURCES.ANIMAL, 1, setLogItems)
               funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      // Protected Valley
      case 174:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.GREENERY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_MOHOLE_AREA,
               }) // Same spots availability as, i.e. mohole area
            },
         })
         // Increase oxygen
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.OXYGEN)]
         break
      // Satellites
      case 175:
         value =
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.SPACE) && !hasTag(card, TAGS.EVENT) ? total + 1 : total), 1) +
            statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.SPACE ? total + 1 : total), 0)
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
               funcSetLogItemsSingleActions(`MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value, setLogItems)
            },
         })
         break
      // Noctis Farming
      case 176:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               funcSetLogItemsSingleActions('MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 })
               funcSetLogItemsSingleActions('Received 2 plants', RESOURCES.PLANT, 2, setLogItems)
            },
         })
         break
      // Soil Factory
      case 179:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 })
               funcSetLogItemsSingleActions('Plant production increased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], 1, setLogItems)
            },
         })
         break
      // Fuel Factory
      case 180:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               funcSetLogItemsSingleActions('MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1, setLogItems)
            },
         })
         break
      // Livestock
      case 184:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: -1 })
               funcSetLogItemsSingleActions('Plant production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.PLANT], -1, setLogItems)
               funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 })
               funcSetLogItemsSingleActions('MC production increased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], 2, setLogItems)
            },
         })
         break
      // Olympus Conference
      case 185:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems),
         })
         break
      // Rad-Suits
      case 186:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               funcSetLogItemsSingleActions('MC production increased by 1', [RESOURCES.PROD_BG, RESOURCES.MLN], 1, setLogItems)
            },
         })
         break
      // Energy Saving
      case 189:
         value = stateBoard.reduce(
            (total, field) =>
               (field.object === TILES.CITY || field.object === TILES.CITY_NEUTRAL || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
               field.name !== 'PHOBOS SPACE HAVEN' &&
               field.name !== 'GANYMEDE COLONY'
                  ? total + 1
                  : total,
            0
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.ENERGY,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value })
                  funcSetLogItemsSingleActions(`Energy production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.ENERGY], value, setLogItems)
               },
            })
         break
      // Local Heat Trapping
      case 190:
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.HEAT,
            value: 5,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -5 })
               funcSetLogItemsSingleActions('Paid 5 heat', RESOURCES.HEAT, -5, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalSelectOne: {
                     card: cardsInHand.find((card) => card.id === actionOrCardId),
                     options: getOptions(actionOrCardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Invention Contest
      case 192:
         // Call Olympus Conference effect FIRST
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
            if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science === 0) {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 },
                     })
                     funcSetLogItemsSingleActions('Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1, setLogItems)
                  },
               })
            } else {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 },
                     })
                     funcSetLogItemsSingleActions('Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1, setLogItems)
                  },
               })
               subActions.push({
                  name: ANIMATIONS.CARD_IN,
                  type: RESOURCES.CARD,
                  value: 1,
                  func: async () => {
                     newCardsDrawIds = initDrawCardsIds?.slice(0, 1) || (await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token))
                     cardsInHand = [
                        ...cardsInHand.filter((card) => card.id !== actionOrCardId),
                        ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer),
                     ]
                     cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: cardsInHand,
                     })
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                        payload: cardsSeen,
                     })
                     funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1, setLogItems)
                  },
               })
            }
         }
         // Proper Action
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: async () => {
               newCardsDrawIds =
                  initDrawCardsIds?.slice(1) ||
                  (await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, token, newCardsDrawIds.length > 0 ? newCardsDrawIds : undefined))
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_BUSINESS_CONTACTS, payload: true })
               setModals((prev) => ({
                  ...prev,
                  modalBusCont: { cards: newCardsDrawIds, selectCount: 1 },
                  businessContacts: true,
               }))
            },
         })
         // Call Mars University
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY)) {
            if (cardsInHand.filter((card) => card.id !== modals.modalCard.id).length > 0) {
               modals.modalCard.tags.forEach((tag) => {
                  if (tag === TAGS.SCIENCE) {
                     subActions.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        value: null,
                        func: () => {
                           dispatchGame({
                              type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY,
                              payload: true,
                           })
                           setModals((prev) => ({ ...prev, marsUniversity: true }))
                        },
                     })
                  }
               })
            }
         }
         break
      // Indentured Workers
      case 195:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.APPLY_INDENTURED_WORKERS_EFFECT })
               funcSetLogItemsSingleActions('INDENTURED WORKERS effect started', null, null, setLogItems)
            },
         })
         break
      // Lagrange Observatory
      case 196:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: async () => {
               newCardsDrawIds = initDrawCardsIds?.slice(0, 1) || (await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token))
               cardsInHand = [
                  ...cardsInHand.filter((card) => card.id !== actionOrCardId),
                  ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer),
               ]
               cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
               funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name})`, RESOURCES.CARD, 1, setLogItems)
               cardsPlayed = [...cardsPlayed, ...getCardsWithTimePlayed([modals.modalCard])]
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand, cardsPlayed }, stateGame)
            },
         })
         // Call Olympus Conference effect
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
            if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science === 0) {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 },
                     })
                     funcSetLogItemsSingleActions('Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1, setLogItems)
                  },
               })
            } else {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 },
                     })
                     funcSetLogItemsSingleActions('Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1, setLogItems)
                  },
               })
               subActions.push({
                  name: ANIMATIONS.CARD_IN,
                  type: RESOURCES.CARD,
                  value: 1,
                  func: async () => {
                     newCardsDrawIds = initDrawCardsIds?.slice(1) || (await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, newCardsDrawIds))
                     cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
                     cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: cardsInHand,
                     })
                     dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
                     funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1, setLogItems)
                  },
               })
            }
         }
         // Call Mars University
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY)) {
            if (cardsInHand.filter((card) => card.id !== modals.modalCard.id).length > 0)
               modals.modalCard.tags.forEach((tag) => {
                  if (tag === TAGS.SCIENCE)
                     subActions.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        type: null,
                        value: null,
                        func: () => {
                           dispatchGame({
                              type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY,
                              payload: true,
                           })
                           setModals((prev) => ({ ...prev, marsUniversity: true }))
                        },
                     })
               })
         }
         break
      // Terraforming Ganymede
      case 197:
         value =
            statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.JOVIAN) ? total + 1 : total), 1) +
            statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.JOVIAN ? total + 1 : total), 0)
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               sound.getTR.play()
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: value })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               funcSetLogItemsSingleActions(`TR raised by ${value}`, RESOURCES.TR, value, setLogItems)
            },
         })
         break
      // Immigration Shuttles
      case 198:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 5 })
               funcSetLogItemsSingleActions('MC production increased by 5', [RESOURCES.PROD_BG, RESOURCES.MLN], 5, setLogItems)
            },
         })
         break
      // Restricted Area
      case 199:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.SPECIAL_RESTRICTED_AREA,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.SPECIAL_RESTRICTED_AREA,
               })
            },
         })
         break
      // Immigrant City
      case 200:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 2,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 })
               funcSetLogItemsSingleActions('MC production decreased by 2', [RESOURCES.PROD_BG, RESOURCES.MLN], -2, setLogItems)
            },
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: true })
               dispatchGame({
                  type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA,
                  payload: TILES.CITY,
               })
               dispatchBoard({
                  type: ACTIONS_BOARD.SET_AVAILABLE,
                  payload: TILES.CITY,
               })
            },
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 })
               funcSetLogItemsSingleActions('MC production increased by 1 from IMMIGRANT CITY effect', [RESOURCES.PROD_BG, RESOURCES.MLN], 1, setLogItems)
            },
         })
         break
      // Soletta
      case 203:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 7,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 7 })
               funcSetLogItemsSingleActions('Heat production increased by 7', [RESOURCES.PROD_BG, RESOURCES.HEAT], 7, setLogItems)
            },
         })
         break
      // Technology Demonstration
      case 204:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: async () => {
               newCardsDrawIds = initDrawCardsIds?.slice(0, 2) || (await getNewCardsDrawIds(2, statePlayer, dispatchPlayer, type, id, token))
               cardsInHand = [
                  ...cardsInHand.filter((card) => card.id !== actionOrCardId),
                  ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer),
               ]
               cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cardsInHand })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
               const newCardsDrawNames = getCards(newCardsDrawIds).map((c) => c.name)
               funcSetLogItemsSingleActions(`Drew 2 cards (${newCardsDrawNames[0]} and ${newCardsDrawNames[1]})`, RESOURCES.CARD, 2, setLogItems)
               cardsPlayed = [...cardsPlayed, ...getCardsWithTimePlayed([modals.modalCard])]
               funcUpdateLastLogItemAfter(setLogItems, { ...statePlayer, cardsInHand, cardsPlayed }, stateGame)
            },
         })
         // Call Olympus Conference effect
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_OLYMPUS_CONFERENCE)) {
            if (statePlayer.cardsPlayed.find((card) => card.id === 185).units.science === 0) {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_IN,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: 1 },
                     })
                     funcSetLogItemsSingleActions('Received 1 science to OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, 1, setLogItems)
                  },
               })
            } else {
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.SCIENCE,
                  value: 1,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.ADD_BIO_RES,
                        payload: { cardId: 185, resource: RESOURCES.SCIENCE, amount: -1 },
                     })
                     funcSetLogItemsSingleActions('Removed 1 science from OLYMPUS CONFERENCE card', RESOURCES.SCIENCE, -1, setLogItems)
                  },
               })
               subActions.push({
                  name: ANIMATIONS.CARD_IN,
                  type: RESOURCES.CARD,
                  value: 1,
                  func: async () => {
                     newCardsDrawIds = initDrawCardsIds?.slice(2) || (await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, token, newCardsDrawIds))
                     cardsInHand = [...cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
                     cardsSeen = [...cardsSeen, ...getCards(newCardsDrawIds)]
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: cardsInHand,
                     })
                     dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: cardsSeen })
                     funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from OLYMPUS CONFERENCE effect`, RESOURCES.CARD, 1, setLogItems)
                  },
               })
            }
         }

         // Call Mars University
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_MARS_UNIVERSITY)) {
            if (cardsInHand.filter((card) => card.id !== modals.modalCard.id).length > 0)
               modals.modalCard.tags.forEach((tag) => {
                  if (tag === TAGS.SCIENCE)
                     subActions.push({
                        name: ANIMATIONS.USER_INTERACTION,
                        type: null,
                        value: null,
                        func: () => {
                           dispatchGame({
                              type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY,
                              payload: true,
                           })
                           setModals((prev) => ({ ...prev, marsUniversity: true }))
                        },
                     })
               })
         }
         break
      // Rad-Chem Factory
      case 205:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TR2)]
         break
      // Special Design
      case 206:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: 2 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: true })
               funcSetLogItemsSingleActions('SPECIAL DESIGN effect started', null, null, setLogItems)
            },
         })
         break
      // Medical Lab
      case 207:
         value = Math.floor(
            (statePlayer.cardsPlayed.reduce((total, card) => (hasTag(card, TAGS.BUILDING) ? total + 1 : total), 1) +
               statePlayer.corporation.tags.reduce((total, tag) => (tag === TAGS.BUILDING ? total + 1 : total), 0)) /
               2
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value })
                  funcSetLogItemsSingleActions(`MC production increased by ${value}`, [RESOURCES.PROD_BG, RESOURCES.MLN], value, setLogItems)
               },
            })
         break
      // AI Central
      case 208:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 })
               funcSetLogItemsSingleActions('Energy production decreased by 1', [RESOURCES.PROD_BG, RESOURCES.ENERGY], -1, setLogItems)
               funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
            },
         })
         break
      default:
         break
   }
   return subActions
}
