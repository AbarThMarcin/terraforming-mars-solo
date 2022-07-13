import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { ANIMATIONS } from './animations'
import { RESOURCES } from './resources'
import { getCardsWithPossibleMicrobes, modifiedCards, withTimeAdded } from '../utils/misc'
import { getOptions } from './selectOneOptions'
import { TILES } from './board'
import { IMM_EFFECTS } from './immEffects/immEffects'
import { EFFECTS } from './effects'

import action_unmi from '../assets/images/actions/action_unmi.svg'
import action_searchForLife from '../assets/images/actions/action_searchForLife.svg'
import cardBuyOrDiscard from '../assets/images/actions/cardBuyOrDiscard.svg'
import action_martianRails from '../assets/images/actions/action_martianRails.svg'
import action_waterImport from '../assets/images/actions/action_waterImport.svg'
import action_spaceElevator from '../assets/images/actions/action_spaceElevator.svg'
import action_devCenter from '../assets/images/actions/action_devCenter.svg'
import action_magnetizer from '../assets/images/actions/action_magnetizer.svg'
import add1animal from '../assets/images/actions/add1animal.svg'
import action_securityFleet from '../assets/images/actions/action_securityFleet.svg'
import action_regolithEaters from '../assets/images/actions/action_regolithEaters.svg'
import action_ghgBacteria from '../assets/images/actions/action_ghgBacteria.svg'
import action_ants from '../assets/images/actions/action_ants.svg'
import action_tardigrades from '../assets/images/actions/action_tardigrades.svg'
import action_electroCatapult from '../assets/images/actions/action_electroCatapult.svg'
import action_spaceMirrors from '../assets/images/actions/action_spaceMirrors.svg'
import action_physicsComplex from '../assets/images/actions/action_physicsComplex.svg'
import action_ironworks from '../assets/images/actions/action_ironworks.svg'
import action_steelworks from '../assets/images/actions/action_steelworks.svg'
import action_oreProcessor from '../assets/images/actions/action_oreProcessor.svg'
import action_industrialCenter from '../assets/images/actions/action_industrialCenter.svg'
import action_symbiotic from '../assets/images/actions/action_symbiotic.svg'
import action_extremeCold from '../assets/images/actions/action_extremeCold.svg'
import action_caretakerContract from '../assets/images/actions/action_caretakerContract.svg'
import action_nitriteBacteria from '../assets/images/actions/action_nitriteBacteria.svg'
import action_waterSplitting from '../assets/images/actions/action_waterSplitting.svg'
import action_aquiferPumping from '../assets/images/actions/action_aquiferPumping.svg'
import action_powerInfra from '../assets/images/actions/action_powerInfra.svg'
import action_restrictedArea from '../assets/images/actions/action_restrictedArea.svg'
import action_undergroundDet from '../assets/images/actions/action_undergroundDet.svg'
import action_aiCentral from '../assets/images/actions/action_aiCentral.svg'
import { CORP_NAMES } from './corpNames'

export const ACTION_ICONS = {
   ACTION_UNMI: 'Action UNMI',
   ACTION_SEARCHFORLIFE: 'Action Search For Life',
   CARDBUYORDISCARD: 'Action Card Buy Or Discard',
   ACTION_MARTIANRAILS: 'Action Martian Rails',
   ACTION_WATERIMPORT: 'Action Water Import From Europa',
   ACTION_SPACEELEVATOR: 'Action Space Elevator',
   ACTION_DEVCENTER: 'Action Development Center',
   ACTION_MAGNETIZER: 'Action Equatorial Magnetizer',
   ADD1ANIMAL: 'Action Add 1 Animal',
   ACTION_SECURITYFLEET: 'Action Security Fleet',
   ACTION_REGOLITHEATERS: 'Action Regolith Eaters',
   ACTION_GHGBACTERIA: 'Action GHG Reducing Bacteria',
   ACTION_ANTS: 'Action Ants',
   ACTION_TARDIGRADES: 'Action Tardigrades',
   ACTION_ELECTROCATAPULT: 'Action Electro Catapult',
   ACTION_SPACEMIRRORS: 'Action Space Mirrors',
   ACTION_PHYSICSCOMPLEX: 'Action Physics Complex',
   ACTION_IRONWORKS: 'Action Ironworks',
   ACTION_STEELWORKS: 'Action Steelworks',
   ACTION_OREPROCESSOR: 'Action Ore Processor',
   ACTION_INDUSTRIALCENTER: 'Action Industrial Center',
   ACTION_SYMBIOTIC: 'Action Symbiotic Fungus',
   ACTION_EXTREMECOLD: 'Action Extreme-cold Fungus',
   ACTION_CARETAKERCONTRACT: 'Action Caretaker Contract',
   ACTION_NITRITEBACTERIA: 'Action Nitrite Reducing Bacteria',
   ACTION_WATERSPLITTING: 'Action Water Splitting Plant',
   ACTION_AQUIFERPUMPING: 'Action Aquifer Pumping',
   ACTION_POWERINFRA: 'Action Power Infrastructure',
   ACTION_RESTRICTEDAREA: 'Action Restricted Area',
   ACTION_UNDERGROUNDDET: 'Action Underground Detonations',
   ACTION_AICENTRAL: 'Action AI Central',
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
   switch (cardId) {
      // ===================== UNMI CORPORATION =====================
      case CORP_NAMES.UNMI:
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
                  modalSelectCard: { cardIdAction: cardId, card: cards[0] },
                  selectCard: true,
               }))
            },
         })
         break
      // Inventors' Guild and Business Network
      case 6:
      case 110:
         subCardActions.push({
            name: ANIMATIONS.USER_INTERACTION,
            type: null,
            value: null,
            func: () => {
               setModals((prevModals) => ({
                  ...prevModals,
                  modalSelectCard: { cardIdAction: cardId, card: cards[0] },
                  selectCard: true,
               }))
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
               (field.object === TILES.CITY &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY')
         ).length
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
         if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
            subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
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
         break
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
                     ...modifiedCards(withTimeAdded(cards.slice(0, 1)), statePlayer),
                  ],
               })
               setCards(cards.slice(1))
            },
         })
         break
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
         break
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
         break
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
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
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
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
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
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
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
         break
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
            if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE))
               subCardActions = [...subCardActions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
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
                     ...modifiedCards(withTimeAdded(cards.slice(0, 1)), statePlayer),
                  ],
               })
               setCards(cards.slice(1))
            },
         })
         break
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
         break
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
                     ...modifiedCards(withTimeAdded(cards.slice(0, 2)), statePlayer),
                  ],
               })
               setCards(cards.slice(2))
            },
         })
         break
      default:
         break
   }
   return subCardActions
}
