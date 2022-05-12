import { ACTIONS_PLAYER } from '../util/actionsPlayer'
import { ACTIONS_GAME } from '../util/actionsGame'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import { getCardsWithPossibleMicrobes, modifiedCards } from '../util/misc'
import { getOptions } from './selectOneOptions'
import { TILES } from './board'
import { IMM_EFFECTS } from './immEffects'
import { SP } from './StandardProjects'
import { getSPeffectsToCall } from './effects'

import action_unmi from '../assets/images/actions/action_unmi.png'
import action_searchForLife from '../assets/images/actions/action_searchForLife.png'
import cardBuyOrDiscard from '../assets/images/actions/cardBuyOrDiscard.png'
import action_martianRails from '../assets/images/actions/action_martianRails.png'
import action_waterImport from '../assets/images/actions/action_waterImport.png'
import action_spaceElevator from '../assets/images/actions/action_spaceElevator.png'
import action_devCenter from '../assets/images/actions/action_devCenter.png'
import action_magnetizer from '../assets/images/actions/action_magnetizer.png'
import add1animal from '../assets/images/actions/add1animal.png'
import action_securityFleet from '../assets/images/actions/action_securityFleet.png'
import action_regolithEaters from '../assets/images/actions/action_regolithEaters.png'
import action_ghgBacteria from '../assets/images/actions/action_ghgBacteria.png'
import action_ants from '../assets/images/actions/action_ants.png'
import action_tardigrades from '../assets/images/actions/action_tardigrades.png'
import action_electroCatapult from '../assets/images/actions/action_electroCatapult.png'
import action_spaceMirrors from '../assets/images/actions/action_spaceMirrors.png'
import action_physicsComplex from '../assets/images/actions/action_physicsComplex.png'
import action_ironworks from '../assets/images/actions/action_ironworks.png'
import action_steelworks from '../assets/images/actions/action_steelworks.png'
import action_oreProcessor from '../assets/images/actions/action_oreProcessor.png'
import action_industrialCenter from '../assets/images/actions/action_industrialCenter.png'
import action_symbiotic from '../assets/images/actions/action_symbiotic.png'
import action_extremeCold from '../assets/images/actions/action_extremeCold.png'
import action_caretakerContract from '../assets/images/actions/action_caretakerContract.png'
import action_nitriteBacteria from '../assets/images/actions/action_nitriteBacteria.png'
import action_waterSplitting from '../assets/images/actions/action_waterSplitting.png'
import action_aquiferPumping from '../assets/images/actions/action_aquiferPumping.png'
import action_powerInfra from '../assets/images/actions/action_powerInfra.png'
import action_restrictedArea from '../assets/images/actions/action_restrictedArea.png'
import action_undergroundDet from '../assets/images/actions/action_undergroundDet.png'
import action_aiCentral from '../assets/images/actions/action_aiCentral.png'

export const ACTION_ICONS = {
   ACTION_UNMI: 'action_unmi',
   ACTION_SEARCHFORLIFE: 'action_searchForLife',
   CARDBUYORDISCARD: 'cardBuyOrDiscard',
   ACTION_MARTIANRAILS: 'action_martianRails',
   ACTION_WATERIMPORT: 'action_waterImport',
   ACTION_SPACEELEVATOR: 'action_spaceElevator',
   ACTION_DEVCENTER: 'action_devCenter',
   ACTION_MAGNETIZER: 'action_magnetizer',
   ADD1ANIMAL: 'add1animal',
   ACTION_SECURITYFLEET: 'action_securityFleet',
   ACTION_REGOLITHEATERS: 'action_regolithEaters',
   ACTION_GHGBACTERIA: 'action_ghgBacteria',
   ACTION_ANTS: 'action_ants',
   ACTION_TARDIGRADES: 'action_tardigrades',
   ACTION_ELECTROCATAPULT: 'action_electroCatapult',
   ACTION_SPACEMIRRORS: 'action_spaceMirrors',
   ACTION_PHYSICSCOMPLEX: 'action_physicsComplex',
   ACTION_IRONWORKS: 'action_ironworks',
   ACTION_STEELWORKS: 'action_steelworks',
   ACTION_OREPROCESSOR: 'action_oreProcessor',
   ACTION_INDUSTRIALCENTER: 'action_industrialCenter',
   ACTION_SYMBIOTIC: 'action_symbiotic',
   ACTION_EXTREMECOLD: 'action_extremeCold',
   ACTION_CARETAKERCONTRACT: 'action_caretakerContract',
   ACTION_NITRITEBACTERIA: 'action_nitriteBacteria',
   ACTION_WATERSPLITTING: 'action_waterSplitting',
   ACTION_AQUIFERPUMPING: 'action_aquiferPumping',
   ACTION_POWERINFRA: 'action_powerInfra',
   ACTION_RESTRICTEDAREA: 'action_restrictedArea',
   ACTION_UNDERGROUNDDET: 'action_undergroundDet',
   ACTION_AICENTRAL: 'action_aiCentral',
}

export const getActionIcon = (actionIconName) => {
   switch (actionIconName) {
      case ACTION_ICONS.ACTION_UNMI:
         return action_unmi
      case ACTION_ICONS.ACTION_SEARCHFORLIFE:
         return action_searchForLife
      case ACTION_ICONS.CARDBUYORDISCARD:
         return cardBuyOrDiscard
      case ACTION_ICONS.ACTION_MARTIANRAILS:
         return action_martianRails
      case ACTION_ICONS.ACTION_WATERIMPORT:
         return action_waterImport
      case ACTION_ICONS.ACTION_SPACEELEVATOR:
         return action_spaceElevator
      case ACTION_ICONS.ACTION_DEVCENTER:
         return action_devCenter
      case ACTION_ICONS.ACTION_MAGNETIZER:
         return action_magnetizer
      case ACTION_ICONS.ADD1ANIMAL:
         return add1animal
      case ACTION_ICONS.ACTION_SECURITYFLEET:
         return action_securityFleet
      case ACTION_ICONS.ACTION_REGOLITHEATERS:
         return action_regolithEaters
      case ACTION_ICONS.ACTION_GHGBACTERIA:
         return action_ghgBacteria
      case ACTION_ICONS.ACTION_ANTS:
         return action_ants
      case ACTION_ICONS.ACTION_TARDIGRADES:
         return action_tardigrades
      case ACTION_ICONS.ACTION_ELECTROCATAPULT:
         return action_electroCatapult
      case ACTION_ICONS.ACTION_SPACEMIRRORS:
         return action_spaceMirrors
      case ACTION_ICONS.ACTION_PHYSICSCOMPLEX:
         return action_physicsComplex
      case ACTION_ICONS.ACTION_IRONWORKS:
         return action_ironworks
      case ACTION_ICONS.ACTION_STEELWORKS:
         return action_steelworks
      case ACTION_ICONS.ACTION_OREPROCESSOR:
         return action_oreProcessor
      case ACTION_ICONS.ACTION_INDUSTRIALCENTER:
         return action_industrialCenter
      case ACTION_ICONS.ACTION_SYMBIOTIC:
         return action_symbiotic
      case ACTION_ICONS.ACTION_EXTREMECOLD:
         return action_extremeCold
      case ACTION_ICONS.ACTION_CARETAKERCONTRACT:
         return action_caretakerContract
      case ACTION_ICONS.ACTION_NITRITEBACTERIA:
         return action_nitriteBacteria
      case ACTION_ICONS.ACTION_WATERSPLITTING:
         return action_waterSplitting
      case ACTION_ICONS.ACTION_AQUIFERPUMPING:
         return action_aquiferPumping
      case ACTION_ICONS.ACTION_POWERINFRA:
         return action_powerInfra
      case ACTION_ICONS.ACTION_RESTRICTEDAREA:
         return action_restrictedArea
      case ACTION_ICONS.ACTION_UNDERGROUNDDET:
         return action_undergroundDet
      case ACTION_ICONS.ACTION_AICENTRAL:
         return action_aiCentral
      default:
         return
   }
}

export const funcGetCardActions = (
   cardId,
   statePlayer,
   dispatchPlayer,
   stateGame,
   dispatchGame,
   performSubActions,
   stateBoard,
   dispatchBoard,
   modals,
   setModals,
   cards,
   setCards,
   getEffect,
   getImmEffects,
   toBuyResources
) => {
   let subCardActions = []
   let dataCards = []
   let value = 0
   let spEffects = []
   switch (cardId) {
      // ===================== UNMI CORPORATION =====================
      case 'UNMI':
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 }),
         })
         break
      // =========================== CARDS ==========================
      // Search For Life
      case 5:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectCard: {
                     cardIdAction: cardId,
                     card: cards[0],
                     func: () => {
                        performSubActions([
                           {
                              name: ANIMATIONS.RESOURCES_IN,
                              type: RESOURCES.MICROBE,
                              value: 1,
                              func: () =>
                                 dispatchPlayer({
                                    type: ACTIONS_PLAYER.ADD_BIO_RES,
                                    payload: {
                                       cardId: cardId,
                                       resource: RESOURCES.MICROBE,
                                       amount: 1,
                                    },
                                 }),
                           },
                        ])
                     },
                  },
               }))
               setCards(cards.slice(1))
               setModals((prevModals) => ({ ...prevModals, selectCard: true }))
            },
         })
         break
      // Inventors' Guild and Business Network
      //
      //
      // Jakos wymyslec, zeby tutaj zamiast platnosc -3 mln zeby bylo z tymi resourcesToBuy[0] i [3] dla heliona.
      //
      //
      //
      case 6:
      case 110:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectCard: {
                     cardIdAction: cardId,
                     card: cards[0],
                     func: () => {
                        performSubActions([
                           {
                              name: ANIMATIONS.RESOURCES_OUT,
                              type: RESOURCES.MLN,
                              value: 3,
                              func: () =>
                                 dispatchPlayer({
                                    type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                                    payload: -3,
                                 }),
                           },
                           {
                              name: ANIMATIONS.CARD_IN,
                              type: RESOURCES.CARD,
                              value: 1,
                              func: () =>
                                 dispatchPlayer({
                                    type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                                    payload: [
                                       ...statePlayer.cardsInHand,
                                       ...modifiedCards(cards.slice(0, 1), statePlayer),
                                    ],
                                 }),
                           },
                        ])
                     },
                  },
               }))
               setCards(cards.slice(1))
               setModals((prevModals) => ({ ...prevModals, selectCard: true }))
            },
         })
         break
      // Martian Rails
      case 7:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 }),
         })
         value = stateBoard.filter(
            (field) =>
               field.object === TILES.CITY_NEUTRAL ||
               (
                  field.object === TILES.CITY &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY'
               ).length
         )
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: value,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: value }),
         })
         break
      // Water Import From Europa and Aquifer Pumping
      case 12:
      case 187:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[1])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.STEEL,
               value: toBuyResources[1],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
                     payload: -toBuyResources[1],
                  }),
            })
         if (toBuyResources[2])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.TITAN,
               value: toBuyResources[2],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
                     payload: -toBuyResources[2],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         getImmEffects(IMM_EFFECTS.AQUIFER).forEach((immEffect) => subCardActions.push(immEffect))
         spEffects = getSPeffectsToCall(SP.AQUIFER_NO_SP)
         spEffects.forEach((spEffect) => {
            if (
               statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
               statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
            )
               subCardActions = [...subCardActions, ...getEffect(spEffect)]
         })
         break
      // Space Elevator
      case 13:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: -1 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MLN,
            value: 5,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: 5 }),
         })
      // Development Center
      case 14:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -1 }),
         })
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand,
                     ...modifiedCards(cards.slice(0, 1), statePlayer),
                  ],
               })
               setCards(cards.slice(1))
            },
         })
      // Equatorial Magnetizer
      case 15:
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_OUT,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: -1 }),
         })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 }),
         })
      // Predators, Fish, Small Animals, Birds and Livestock
      case 24:
      case 52:
      case 54:
      case 72:
      case 128:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.ANIMAL,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.ANIMAL, amount: 1 },
               }),
         })
         break
      // Security Fleet
      case 28:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.FIGHTER,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.FIGHTER, amount: 1 },
               }),
         })
         break
      // Regolith Eaters, GHG Producing Bacteria, Electro Catapult, Nitrite Reducing Bacteria
      case 33:
      case 34:
      case 69:
      case 157:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.id === cardId),
                     options: getOptions(cardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Ants and Tardigrades
      case 35:
      case 49:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.MICROBE,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.MICROBE, amount: 1 },
               }),
         })
         break
      // Space Mirrors
      case 76:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.ENERGY,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_ENERGY, payload: 1 }),
         })
      // Physics Complex
      case 95:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 6,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -6 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.SCIENCE,
            value: 1,
            func: () =>
               dispatchPlayer({
                  type: ACTIONS_PLAYER.ADD_BIO_RES,
                  payload: { cardId, resource: RESOURCES.SCIENCE, amount: 1 },
               }),
         })
         break
      // Ironworks
      case 101:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 1 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            spEffects = getSPeffectsToCall(SP.AQUIFER_NO_SP)
            spEffects.forEach((spEffect) => {
               if (
                  statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                  statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
               )
                  subCardActions = [...subCardActions, ...getEffect(spEffect)]
            })
         }
         break
      // Steelworks
      case 103:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.STEEL,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: 2 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            spEffects = getSPeffectsToCall(SP.AQUIFER_NO_SP)
            spEffects.forEach((spEffect) => {
               if (
                  statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                  statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
               )
                  subCardActions = [...subCardActions, ...getEffect(spEffect)]
            })
         }
         break
      // Ore Processor
      case 104:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 4,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -4 }),
         })
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: 1 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            spEffects = getSPeffectsToCall(SP.AQUIFER_NO_SP)
            spEffects.forEach((spEffect) => {
               if (
                  statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                  statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
               )
                  subCardActions = [...subCardActions, ...getEffect(spEffect)]
            })
         }
         break
      // Industrial Center
      case 123:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         })
      // Symbiotic Fungus
      case 133:
         dataCards = getCardsWithPossibleMicrobes(statePlayer)
         subCardActions.push({
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
                     resType: RESOURCES.MICROBE,
                  },
                  resource: true,
               }))
            },
         })
         break
      // Extreme-Cold Fungus
      case 134:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.id === cardId),
                     options: getOptions(cardId),
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Caretaker Contract
      case 154:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.HEAT,
            value: 8,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -8 }),
         })
         subCardActions.push({
            name: ANIMATIONS.SHORT_ANIMATION,
            type: null,
            value: null,
            func: () => dispatchGame({ type: ACTIONS_GAME.CHANGE_TR, payload: 1 }),
         })
         break
      // Water Splitting Plant
      case 177:
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.ENERGY,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_ENERGY, payload: -3 }),
         })
         getImmEffects(IMM_EFFECTS.OXYGEN).forEach((immEffect) => subCardActions.push(immEffect))
         // Possible effects for placing ocean if increasing oxygen gets the ocean bonus (7% ox, -2 temp, 8- oceans)
         if (
            stateGame.globalParameters.oxygen === 7 &&
            stateGame.globalParameters.temperature === -2 &&
            stateGame.globalParameters.oceans < 9
         ) {
            spEffects = getSPeffectsToCall(SP.AQUIFER_NO_SP)
            spEffects.forEach((spEffect) => {
               if (
                  statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                  statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
               )
                  subCardActions = [...subCardActions, ...getEffect(spEffect)]
            })
         }
         break
      // Power Infrasctructure
      case 194:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               dispatchGame({ type: ACTIONS_GAME.SET_PHASE_SELECTONE, payload: true })
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectOne: {
                     card: statePlayer.cardsPlayed.find((card) => card.id === cardId),
                     options: null,
                  },
                  selectOne: true,
               }))
            },
         })
         break
      // Restricted Area
      case 199:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 1,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand,
                     ...modifiedCards(cards.slice(0, 1), statePlayer),
                  ],
               })
               setCards(cards.slice(1))
            },
         })
      // Underground Detonations
      case 202:
         if (toBuyResources[0])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: toBuyResources[0],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -toBuyResources[0],
                  }),
            })
         if (toBuyResources[3])
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: toBuyResources[3],
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -toBuyResources[3],
                  }),
            })
         subCardActions.push({
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.HEAT,
            value: 2,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_HEAT, payload: 2 }),
         })
      // AI Central
      case 208:
         subCardActions.push({
            name: ANIMATIONS.CARD_IN,
            type: RESOURCES.CARD,
            value: 2,
            func: () => {
               dispatchPlayer({
                  type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                  payload: [
                     ...statePlayer.cardsInHand,
                     ...modifiedCards(cards.slice(0, 2), statePlayer),
                  ],
               })
               setCards(cards.slice(2))
            },
         })
      default:
         break
   }
   return subCardActions
}
