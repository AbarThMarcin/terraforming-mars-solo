import { ACTIONS_PLAYER } from '../../util/actionsPlayer'
import { ACTIONS_GAME } from '../../util/actionsGame'
import { ANIMATIONS } from '../animations'
import { TILES } from '../board'
import { ACTIONS_BOARD } from '../../util/actionsBoard'
import { RESOURCES } from '../resources'
import { getOptions } from '../selectOneOptions'
import {
   getCardsWithPossibleAnimals,
   getCardsWithPossibleFighters,
   getCardsWithPossibleMicrobes,
   getCardsWithPossibleScience,
   hasTag,
   modifiedCards,
   modifiedCardsEffect,
} from '../../util/misc'
import { TAGS } from '../tags'
import { CORP_NAMES } from '../corpNames'
import { EFFECTS } from '../effects'

export const IMM_EFFECTS = {
   POWER_PLANT: 'Increase energy production 1 step',
   TEMPERATURE: 'Increase temperature by 2 degrees',
   TEMPERATURE4: 'Increase temperature by 4 degrees',
   TEMPERATURE6: 'Increase temperature by 6 degrees',
   AQUIFER: 'Place an ocean',
   AQUIFER2: 'Place two oceans',
   GREENERY: 'Place greenery',
   OXYGEN: 'Increase oxygen by 1%',
   OXYGEN2: 'Increase oxygen by 2%',
   CITY: 'Place a city',
   TR: 'Increase TR level',
   MINING_GUILD: 'Increase steel production by 1',
}

export const funcGetImmEffects = (
   actionOrCardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   getImmEffects,
   stateBoard,
   dispatchBoard,
   modals,
   setModals,
   cards,
   setCards,
   requirementsMet
) => {
   let subActions = []
   let dataCards = []
   let value = 0
   switch (actionOrCardId) {
      // ============================= SP POWER PLANT ============================
      // cards: Solar Power, Wave Power, Power Plant, Power Supply Consortium, Windmills,
      // Heat Trappers, Energy Tapping
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 }),
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
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat production
            if (
               stateGame.globalParameters.temperature === -26 ||
               stateGame.globalParameters.temperature === -22
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
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
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  if (stateGame.globalParameters.temperature < 6) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat production
            if (
               (stateGame.globalParameters.temperature >= -28 &&
                  stateGame.globalParameters.temperature <= -26) ||
               (stateGame.globalParameters.temperature >= -24 &&
                  stateGame.globalParameters.temperature <= -22)
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
               })
               // Bonus ocean
            } else if (
               stateGame.globalParameters.temperature >= -4 &&
               stateGame.globalParameters.temperature <= -2
            ) {
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
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  if (stateGame.globalParameters.temperature < 6) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  }
                  if (stateGame.globalParameters.temperature < 4) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
            // Bonus heat productions
            if (
               stateGame.globalParameters.temperature >= -30 &&
               stateGame.globalParameters.temperature <= -26
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
               })
            }
            if (
               stateGame.globalParameters.temperature >= -26 &&
               stateGame.globalParameters.temperature <= -22
            ) {
               subActions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.HEAT,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
               })
               // Bonus ocean
            }
            if (
               stateGame.globalParameters.temperature >= -6 &&
               stateGame.globalParameters.temperature <= -2
            ) {
               subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
            }
         }
         break
      // =============================== PLACE OCEAN TILE ============================
      // cards: Subterranean Reservoir, Ice Cap Melting, Flooding, Permafrost Extraction
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
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         break
      // =============================== PLACE TWO OCEAN TILES ============================
      case IMM_EFFECTS.AQUIFER2:
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
            if (stateGame.globalParameters.oceans < 8) {
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
            }
            // Increase oceans meter
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  if (stateGame.globalParameters.oceans < 8) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         break
      // ============================== PLACE GREENERY TILE ==========================
      // card: Plantation
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
      // ================================= INCREASE OXYGEN BY 1% ===========================
      case IMM_EFFECTS.OXYGEN:
         if (stateGame.globalParameters.oxygen < 14) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         // Bonus temperature
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature < 8
         ) {
            subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         }
         break
      // ================================= INCREASE OXYGEN BY 2% ===========================
      case IMM_EFFECTS.OXYGEN2:
         if (stateGame.globalParameters.oxygen < 14) {
            subActions.push({
               name: ANIMATIONS.SHORT_ANIMATION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  if (stateGame.globalParameters.oxygen < 13) {
                     dispatchGame({ type: ACTIONS_GAME.INCREMENT_OXYGEN })
                     dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  }
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
         }
         // Bonus temperature
         if (
            stateGame.globalParameters.oxygen >= 6 &&
            stateGame.globalParameters.oxygen <= 7 &&
            stateGame.globalParameters.temperature < 8
         ) {
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
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            },
         })
         break
      // ========================== Mining Guild immediate effect ====================
      case IMM_EFFECTS.MINING_GUILD:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         })
         break
      // ============================= CARD IMMEDIATE EFFECTS ========================
      // Asteroid Mining Consortium
      case 2:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         break
      // Capital
      case 8:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 5 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 2 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Comet
      case 10:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Big Asteroid
      case 11:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 4 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE4)]
         break
      // Space Elevator
      case 13:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
         })
         break
      // Domed Crater
      case 16:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
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
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Arctic Algae
      case 23:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         break
      // Space Station
      case 25:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_SPACE_STATION
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_SPACE_STATION
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Eos Chasma National Park
      case 26:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 }),
         })
         dataCards = getCardsWithPossibleAnimals(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prevModals) => ({
                     ...prevModals,
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 }),
         })
         break
      // Underground City
      case 32:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 }),
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
      // Release Of Inert Gases
      case 36:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 2 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            },
         })
         break
      // Nitrogen-Rich Asteroid
      case 37:
         if (
            statePlayer.cardsPlayed.reduce(
               (total, card) => (hasTag(card, TAGS.PLANT) ? total + 1 : total),
               0
            ) +
               statePlayer.corporation.tags.reduce(
                  (total, tag) => (tag === TAGS.PLANT ? total + 1 : total),
                  0
               ) <
            3
         ) {
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: 1,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
            })
         } else {
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: 4,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 4 }),
            })
         }
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 2 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE)]
         break
      // Deimos Down
      case 39:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 4 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE6)]
         break
      // Asteroid Mining
      case 40:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 2 }),
         })
         break
      // Food Factory
      case 41:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 }),
         })
         break
      // Archaebacteria
      case 42:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         break
      // Carbonate Processing
      case 43:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 }),
         })
         break
      // Natural Preserve
      case 44:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 }),
         })
         break
      // Lightning Harvest
      case 46:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.POWER_PLANT)]
         break
      // Algae
      case 47:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         break
      // Adapted Lichen
      case 48:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         break
      // Miranda Resort
      case 51:
         value =
            statePlayer.cardsPlayed.reduce(
               (total, card) =>
                  hasTag(card, TAGS.EARTH) && !hasTag(card, TAGS.EVENT) ? total + 1 : total,
               0
            ) +
            statePlayer.corporation.tags.reduce(
               (total, tag) => (tag === TAGS.EARTH ? total + 1 : total),
               0
            )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value }),
            })
         break
      // Lake Marineris
      case 53:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Kelp Farming
      case 55:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
         })
         break
      // Mine
      case 56:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         })
         break
      // Vesta Shipyard
      case 57:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
         })
         break
      // Beam From A Thorium Asteroid
      case 58:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 3 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 }),
         })
         break
      // Great Escarpment Consortium
      case 61:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         })
         break
      // Mineral Deposit
      case 62:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 5,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 5 }),
         })
         break
      // Mining Expedition
      case 63:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         break
      // Electro Catapult
      case 69:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         break
      // Earth Catapult
      case 70:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_EARTH_CATAPULT
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_EARTH_CATAPULT
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
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
            },
         })
         break
      // Mars University
      case 73:
         if (statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId).length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY, payload: true })
                  setModals((prevModals) => ({ ...prevModals, marsUniversity: true }))
               },
            })
         break
      // Viral Enhancers
      case 74:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 }),
         })
         break
      // Towing A Comet
      case 75:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 2 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.POWER_PLANT)]
         break
      // Ice Asteroid
      case 78:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         break
      // Quantum Extractor
      case 79:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 4 }),
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_QUANTUM_EXTRACTOR
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_QUANTUM_EXTRACTOR
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Giant Ice Asteroid
      case 80:
         subActions = getImmEffects(IMM_EFFECTS.AQUIFER)
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TEMPERATURE4)]
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 }),
         })
         break
      // Giant Space Mirror
      case 83:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 }),
         })
         break
      // Commercial District
      case 85:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 }),
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
                  if (
                     immEffect.type === RESOURCES.MLN &&
                     statePlayer.production.mln - immEffect.value < -5
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.STEEL &&
                     statePlayer.production.steel < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.TITAN &&
                     statePlayer.production.steel < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.PLANT &&
                     statePlayer.production.plant < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.ENERGY &&
                     statePlayer.production.energy < immEffect.value
                  ) {
                     prodReqMet = false
                     return isAnyProduction && prodReqMet
                  } else if (
                     immEffect.type === RESOURCES.HEAT &&
                     statePlayer.production.heat < immEffect.value
                  ) {
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
                  (immProdEffect) =>
                     immProdEffect.name === ANIMATIONS.PRODUCTION_IN ||
                     immProdEffect.name === ANIMATIONS.PRODUCTION_OUT
               )
            }
         }
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalProduction: {
                     ...prevModals.modalProduction,
                     cardIdOrCorpName:
                        statePlayer.corporation.name === CORP_NAMES.MINING_GUILD
                           ? CORP_NAMES.MINING_GUILD
                           : dataCards[0].id,
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 3 }),
         })
         break
      // Heather
      case 88:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 }),
         })
         break
      // Peroxide Power
      case 89:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 }),
         })
         break
      // Research
      case 90:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                     ...modifiedCards(cards.slice(0, 2), statePlayer),
                  ],
               })
               setCards(cards.slice(2))
            },
         })
         break
      // Gene Repair
      case 91:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         break
      // IO Mining Industries
      case 92:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         break
      // Bushes
      case 93:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
         })
         break
      // Mass Converter
      case 94:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 6,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 6 }),
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_MASS_CONVERTER
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_MASS_CONVERTER
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Greenhouses
      case 96:
         value = stateBoard.reduce(
            (total, field) =>
               field.object === TILES.CITY ||
               field.object === TILES.CITY_NEUTRAL ||
               field.object === TILES.SPECIAL_CITY_CAPITAL
                  ? total + 1
                  : total,
            0
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.PLANT,
               value: value,
               func: () =>
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: value }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 }),
         })
         break
      // Fueled Generators
      case 100:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.POWER_PLANT)]
         break
      // Power Grid
      case 102:
         value =
            statePlayer.cardsPlayed.reduce(
               (total, card) => (hasTag(card, TAGS.ENERGY) ? total + 1 : total),
               1
            ) +
            statePlayer.corporation.tags.reduce(
               (total, tag) => (tag === TAGS.POWER ? total + 1 : total),
               0
            )
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value }),
         })
         break
      // Earth Office
      case 105:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_EARTH_OFFICE
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_EARTH_OFFICE
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Acquired Company
      case 106:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 3 }),
         })
         break
      // Media Archives
      case 107:
         value = statePlayer.cardsPlayed.reduce(
            (total, card) => (hasTag(card, TAGS.EVENT) ? total + 1 : total),
            0
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value }),
            })
         break
      // Open City
      case 108:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 4 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
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
      // Business Network
      case 110:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 }),
         })
         break
      // Business Contacts
      case 111:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_BUSINESS_CONTACTS, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalBusCont: { cardsCount: 4, selectCount: 2 },
                  businessContacts: true,
               }))
            },
         })
         break
      // Bribed Committee
      case 112:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 2 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
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
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
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
                  dispatchGame({ type: ACTIONS_GAME.INCREMENT_OCEANS })
                  dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
               },
            })
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 2 }),
         })
         break
      // Farming
      case 118:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
         })
         break
      // Urbanized Area
      case 120:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
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
      // Moss
      case 125:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         break
      // GHG Factories
      case 126:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: -1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 }),
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
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: { cardId: actionOrCardId, resource: RESOURCES.ANIMAL, amount: 1 },
                  }),
            })
         }
         break
      // Zeppelins
      case 129:
         value = stateBoard.reduce(
            (total, field) =>
               (field.object === TILES.CITY ||
                  field.object === TILES.CITY_NEUTRAL ||
                  field.object === TILES.SPECIAL_CITY_CAPITAL) &&
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
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value }),
            })
         break
      // Worms
      case 130:
         value = Math.floor(
            statePlayer.cardsPlayed.reduce(
               (total, card) =>
                  hasTag(card, TAGS.MICROBE) && !hasTag(card, TAGS.EVENT) ? total + 1 : total,
               1
            ) / 2
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: value,
               func: () =>
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value }),
            })
         break
      // Decomposers
      case 131:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.MICROBE, amount: 1 },
               }),
         })
         break
      // Fusion Power
      case 132:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 }),
         })
         break
      // Cartel
      case 137:
         value =
            statePlayer.cardsPlayed.reduce(
               (total, card) =>
                  hasTag(card, TAGS.EARTH) && !hasTag(card, TAGS.EVENT) ? total + 1 : total,
               1
            ) +
            statePlayer.corporation.tags.reduce(
               (total, tag) => (tag === TAGS.EARTH ? total + 1 : total),
               0
            )
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value }),
         })
         break
      // Strip Mine
      case 138:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 4 }),
         })
         break
      // Large Convoy
      case 143:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                     ...modifiedCards(cards.slice(0, 2), statePlayer),
                  ],
               })
               setCards(cards.slice(2))
            },
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.AQUIFER)]
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
         })
         break
      // Tectonic Stress Power
      case 145:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 3 }),
         })
         break
      // Nitrophilic Moss
      case 146:
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         break
      // Herbivores
      case 147:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.ANIMAL, amount: 1 },
               }),
         })
         break
      // Insects
      case 148:
         value =
            statePlayer.cardsPlayed.reduce(
               (total, card) => (hasTag(card, TAGS.PLANT) ? total + 1 : total),
               0
            ) +
            statePlayer.corporation.tags.reduce(
               (total, tag) => (tag === TAGS.PLANT ? total + 1 : total),
               0
            )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.PLANT,
               value: value,
               func: () =>
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: value }),
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
         dataCards = dataCards.filter(
            (card) =>
               card.units.microbe > 0 ||
               card.units.animal > 0 ||
               card.units.science > 0 ||
               card.units.fighter > 0
         )
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
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
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_ANTIGRAVITY_TECHNOLOGY
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Investment Loan
      case 151:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 10,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 10 }),
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
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
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
            func: () =>
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: 2 }),
         })
         break
      // Designed Microorganisms
      case 155:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         break
      // Nitrite Reducing Bacteria
      case 157:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: 3,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.MICROBE, amount: 3 },
               }),
         })
         break
      // Industrial Microbes
      case 158:
         subActions = getImmEffects(IMM_EFFECTS.POWER_PLANT)
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         })
         break
      // Lichen
      case 159:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         break
      // Convoy From Europa
      case 161:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                     ...modifiedCards(cards.slice(0, 1), statePlayer),
                  ],
               })
               setCards(cards.slice(2))
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: 3 }),
         })
         break
      // Imported Nitrogen
      case 163:
         subActions = getImmEffects(IMM_EFFECTS.TR)
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 4 }),
         })
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prevModals) => ({
                     ...prevModals,
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
         dataCards = getCardsWithPossibleAnimals(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prevModals) => ({
                     ...prevModals,
                     modalResource: {
                        cardId: dataCards[0].id,
                        amount: 2,
                        data: dataCards,
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 1 }),
         })
         break
      // Magnetic Field Generators
      case 165:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -4 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 3 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            },
         })
         break
      // Shuttles
      case 166:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               let newCards = modifiedCardsEffect(
                  statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                  EFFECTS.EFFECT_SHUTTLES
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCardsEffect(
                  [
                     ...statePlayer.cardsPlayed,
                     statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                  ],
                  EFFECTS.EFFECT_SHUTTLES
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
            },
         })
         break
      // Import of Advanced GHG
      case 167:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 }),
         })
         break
      // Tundra Farming
      case 169:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 1 }),
         })
         break
      // Aerobraked Ammonia Asteroid
      case 170:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 3 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         if (dataCards.length > 0)
            subActions.push({
               name: ANIMATIONS.USER_INTERACTION,
               type: null,
               value: null,
               func: () => {
                  dispatchGame({ type: ACTIONS_GAME.SET_PHASE_ADDREMOVERES, payload: true })
                  setModals((prevModals) => ({
                     ...prevModals,
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -2 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         subActions = [...subActions, ...getImmEffects(IMM_EFFECTS.TR)]
         break
      // Pets
      case 172:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.ANIMAL, amount: 1 },
               }),
         })
         break
      // Protected Valley
      case 174:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
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
            statePlayer.cardsPlayed.reduce(
               (total, card) =>
                  hasTag(card, TAGS.SPACE) && !hasTag(card, TAGS.EVENT) ? total + 1 : total,
               1
            ) +
            statePlayer.corporation.tags.reduce(
               (total, tag) => (tag === TAGS.SPACE ? total + 1 : total),
               0
            )
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value }),
         })
         break
      // Noctis Farming
      case 176:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.PLANT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: 2 }),
         })
         break
      // Soil Factory
      case 179:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: 1 }),
         })
         break
      // Fuel Factory
      case 180:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         })
         break
      // Livestock
      case 184:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.PLANT,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_PLANT, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 2 }),
         })
         break
      // Olympus Conference
      case 185:
         subActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.SCIENCE,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId: actionOrCardId, resource: RESOURCES.SCIENCE, amount: 1 },
               }),
         })
         break
      // Rad-Suits
      case 186:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         })
         break
      // Energy Saving
      case 189:
         value = stateBoard.reduce(
            (total, field) =>
               (field.object === TILES.CITY ||
                  field.object === TILES.CITY_NEUTRAL ||
                  field.object === TILES.SPECIAL_CITY_CAPITAL) &&
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
               func: () =>
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: value }),
            })
         break
      // Local Heat Trapping
      case 190:
         subActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.HEAT,
            value: 5,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -5 }),
         })
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsInHand.find((card) => card.id === actionOrCardId),
                     options: getOptions(actionOrCardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Invention Contest
      case 192:
         subActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_BUSINESS_CONTACTS, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalBusCont: { cardsCount: 3, selectCount: 1 },
                  businessContacts: true,
               }))
            },
         })
         break
      // Indentured Workers
      case 195:
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.APPLY_INDENTURED_WORKERS_EFFECT }),
         })
         break
      // Lagrange Observatory
      case 196:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                     ...modifiedCards(cards.slice(0, 1), statePlayer),
                  ],
               })
               setCards(cards.slice(1))
            },
         })
         break
      // Terraforming Ganymede
      case 197:
         value =
            statePlayer.cardsPlayed.reduce(
               (total, card) => (hasTag(card, TAGS.JOVIAN) ? total + 1 : total),
               1
            ) +
            statePlayer.corporation.tags.reduce(
               (total, tag) => (tag === TAGS.JOVIAN ? total + 1 : total),
               0
            )
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: value })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            },
         })
         break
      // Immigration Shuttles
      case 198:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 5 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.MLN,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: -2 }),
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
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
         })
         break
      // Soletta
      case 203:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 7,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 7 }),
         })
         break
      // Technology Demonstration
      case 204:
         subActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand.filter((card) => card.id !== actionOrCardId),
                     ...modifiedCards(cards.slice(0, 2), statePlayer),
                  ],
               })
               setCards(cards.slice(2))
            },
         })
         break
      // Rad-Chem Factory
      case 205:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 2 })
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_TRRAISED, payload: true })
            },
         })
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
            },
         })
         break
      // Medical Lab
      case 207:
         value = Math.floor(
            (statePlayer.cardsPlayed.reduce(
               (total, card) => (hasTag(card, TAGS.BUILDING) ? total + 1 : total),
               1
            ) +
               statePlayer.corporation.tags.reduce(
                  (total, tag) => (tag === TAGS.BUILDING ? total + 1 : total),
                  0
               )) /
               2
         )
         if (value > 0)
            subActions.push({
               name: ANIMATIONS.PRODUCTION_IN,
               type: RESOURCES.MLN,
               value: value,
               func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: value }),
            })
         break
      // AI Central
      case 208:
         subActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         break
      default:
         break
   }
   return subActions
}
