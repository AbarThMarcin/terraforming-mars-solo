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

import action_searchForLife from '../assets/images/actions/action_searchForLife.png'
import cardBuyOrDiscard from '../assets/images/actions/cardBuyOrDiscard.png'
import action_martianRails from '../assets/images/actions/action_martianRails.png'
import action_waterImport from '../assets/images/actions/action_waterImport.png'
import add1animal from '../assets/images/actions/add1animal.png'
import action_unmi from '../assets/images/actions/action_unmi.png'
import action_symbiotic from '../assets/images/actions/action_symbiotic.png'
import action_extremeCold from '../assets/images/actions/action_extremeCold.png'
import action_regolithEaters from '../assets/images/actions/action_regolithEaters.png'
import action_aquiferPumping from '../assets/images/actions/action_aquiferPumping.png'

export const ACTION_ICONS = {
   ACTION_SEARCHFORLIFE: 'action_searchForLife',
   CARDBUYORDISCARD: 'cardBuyOrDiscard',
   ACTION_MARTIANRAILS: 'action_martianRails',
   ACTION_WATERIMPORT: 'action_waterImport',
   ADD1ANIMAL: 'add1animal',
   ACTION_UNMI: 'action_unmi',
   ACTION_SYMBIOTIC: 'action_symbiotic',
   ACTION_EXTREMECOLD: 'action_extremeCold',
   ACTION_REGOLITHEATERS: 'action_regolithEaters',
   ACTION_AQUIFERPUMPING: 'action_aquiferPumping',
}

export const getActionIcon = (actionIconName) => {
   switch (actionIconName) {
      case ACTION_ICONS.ACTION_SEARCHFORLIFE:
         return action_searchForLife
      case ACTION_ICONS.CARDBUYORDISCARD:
         return cardBuyOrDiscard
      case ACTION_ICONS.ACTION_MARTIANRAILS:
         return action_martianRails
      case ACTION_ICONS.ACTION_WATERIMPORT:
         return action_waterImport
      case ACTION_ICONS.ACTION_UNMI:
         return action_unmi
      case ACTION_ICONS.ADD1ANIMAL:
         return add1animal
      case ACTION_ICONS.ACTION_SYMBIOTIC:
         return action_symbiotic
      case ACTION_ICONS.ACTION_EXTREMECOLD:
         return action_extremeCold
      case ACTION_ICONS.ACTION_REGOLITHEATERS:
         return action_regolithEaters
      case ACTION_ICONS.ACTION_AQUIFERPUMPING:
         return action_aquiferPumping
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
   getImmEffects
) => {
   let subCardActions = []
   let dataCards = []
   let value = 0
   let spEffects = []
   switch (cardId) {
      // ===================== UNMI CORPORATION =====================
      case 'UNMI':
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MLN,
            value: 3,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -3 }),
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
         subCardActions.push({
            name: ANIMATIONS.RESOURCES_OUT,
            type: RESOURCES.MLN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -1 }),
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
      // Inventors' Guild
      case 6:
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
         if (modals.modalResources.mln)
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.MLN,
               value: modals.modalResources.mln,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                     payload: -modals.modalResources.mln,
                  }),
            })
         if (modals.modalResources.steel)
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.STEEL,
               value: modals.modalResources.steel,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_STEEL,
                     payload: -modals.modalResources.steel,
                  }),
            })
         if (modals.modalResources.titan)
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.TITAN,
               value: modals.modalResources.titan,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_TITAN,
                     payload: -modals.modalResources.titan,
                  }),
            })
         if (modals.modalResources.heat)
            subCardActions.push({
               name: ANIMATIONS.RESOURCES_OUT,
               type: RESOURCES.HEAT,
               value: modals.modalResources.heat,
               func: () =>
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                     payload: -modals.modalResources.heat,
                  }),
            })
         getImmEffects(IMM_EFFECTS.AQUIFER).forEach((immEffect) => subCardActions.push(immEffect))
         spEffects = getSPeffectsToCall(SP.AQUIFER_NO_SP)
         spEffects.forEach((spEffect) => {
            if (statePlayer.cardsPlayed.some((card) => card.effect === spEffect))
               subCardActions.push(getEffect(spEffect))
            if (statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect))
               subCardActions.push(getEffect(spEffect))
         })
         break
      // Regolith Eaters
      case 33:
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
      // Livestock
      case 184:
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
      default:
         break
   }
   return subCardActions
}
