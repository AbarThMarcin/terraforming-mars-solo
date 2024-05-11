import { useContext, useEffect, useState } from 'react'
import { ActionsContext, ModalsContext, StateBoardContext, StateGameContext, StatePlayerContext } from '../..'
import { getLogAndStatesConvertedForGame, parseActionStringToObject } from '../../../../utils/dataConversion'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { ACTIONS_BOARD } from '../../../../stateActions/actionsBoard'
import { LOG_TYPES } from '../../../../data/log'
import { useActionDraft } from '../../../../hooks/useActionDraft'
import { SettingsContext, SoundContext } from '../../../../App'
import { INIT_ACTIONS } from '../../../../initStates/initActions'
import { useActionCard } from '../../../../hooks/useActionCard'
import { getActionIdsWithCost, getCards, getCardsSorted } from '../../../../utils/cards'
import { CONFIRMATION_TEXT } from '../../../../data/app'
import { RESOURCES } from '../../../../data/resources'
import { useActionCardAction } from '../../../../hooks/useActionCardAction'
import { useActionSP } from '../../../../hooks/useActionSP'
import { getActions } from '../../../../utils/misc'
import { CORP_NAMES } from '../../../../data/corpNames'
import { getCorporationById } from '../../../../utils/corporation'
import ReplayLogListItem from './ReplayLogListItem'
import { getConfirmationTextOfSP, getNameOfSP } from '../../../../data/StandardProjects'
import { useSubactionSellPatents } from '../../../../hooks/useSubactionSellPatents'
import { useActionHeatGreenery } from '../../../../hooks/useActionHeatGreenery'
import { useActionPass } from '../../../../hooks/useActionPass'

const SPEED_MODIFIER = 0.7 // Smaller number, the faster animation

const REAL_USER_ACTIONS = {
   // ======================================================== Draft
   DRAFT_MODAL_CORPS_ON: 'DRAFT_MODAL_CORPS_ON',
   DRAFT_CLICK_CORP: 'DRAFT_CLICK_CORP',
   DRAFT_CLICK_NEXT_MODAL_CORP: 'DRAFT_CLICK_NEXT_MODAL_CORP',
   DRAFT_SELECT_CARD: 'DRAFT_SELECT_CARD',
   DRAFT_INCREMENT_HEAT: 'DRAFT_INCREMENT_HEAT',
   DRAFT_CONFIRM: 'DRAFT_CONFIRM',
   // =============================================== Forced Actions
   FORCED_INVENTRIX: 'FORCED_INVENTRIX',
   FORCED_THARSIS: 'FORCED_THARSIS',
   // ============================================= Immediate Effect
   IMMEFFECT_CARDSINHAND: 'IMMEFFECT_CARDSINHAND',
   IMMEFFECT_SHOWCARD: 'IMMEFFECT_SHOWCARD',
   IMMEFFECT_CLICKUSE: 'IMMEFFECT_CLICKUSE',
   IMMEFFECT_INCREMENT_STEEL: 'IMMEFFECT_INCREMENT_STEEL',
   IMMEFFECT_DECREMENT_STEEL: 'IMMEFFECT_DECREMENT_STEEL',
   IMMEFFECT_INCREMENT_TITAN: 'IMMEFFECT_INCREMENT_TITAN',
   IMMEFFECT_DECREMENT_TITAN: 'IMMEFFECT_DECREMENT_TITAN',
   IMMEFFECT_INCREMENT_HEAT: 'IMMEFFECT_INCREMENT_HEAT',
   IMMEFFECT_DECREMENT_HEAT: 'IMMEFFECT_DECREMENT_HEAT',
   // ================================================= Card actions
   CARDACTION_MODALACTIONS: 'CARDACTION_MODALACTIONS',
   CARDACTION_CLICKUSE: 'CARDACTION_CLICKUSE',
   CARDACTION_INCREMENT_STEEL: 'CARDACTION_INCREMENT_STEEL',
   CARDACTION_INCREMENT_TITAN: 'CARDACTION_INCREMENT_TITAN',
   CARDACTION_INCREMENT_HEAT: 'CARDACTION_INCREMENT_HEAT',
   CARDACTION_DECREMENT_STEEL: 'CARDACTION_DECREMENT_STEEL',
   CARDACTION_DECREMENT_TITAN: 'CARDACTION_DECREMENT_TITAN',
   CARDACTION_DECREMENT_HEAT: 'CARDACTION_DECREMENT_HEAT',
   CARDACTION_USEACTION: 'CARDACTION_USEACTION',
   // ============================================ Standard Projects
   SP_MODALACTIONS: 'SP_MODALACTIONS',
   SP_CLICKUSE: 'SP_CLICKUSE',
   SP_INCREMENT_HEAT: 'SP_INCREMENT_HEAT', // No decrement, because
   // when clicking first on a SP USE btn, it will always be 0 heat.
   SP_USEACTION: 'SP_USEACTION',
   // ================================================= Convert Heat
   CONVERT_HEAT: 'CONVERT_HEAT',
   // ============================================= Convert Greenery
   CONVERT_GREENERY: 'CONVERT_GREENERY',
   // ================================================= Sell Patents
   SP_SELECT_CARD: 'SP_SELECT_CARD',
   SP_CONFIRM: 'SP_CONFIRM',
   // ========================================================= Pass
   PASS: 'PASS',
   // ========================================================= Misc
   MODALS_OFF: 'MODALS_OFF',
   CONFIRMATION_ON: 'CONFIRMATION_ON',
   CONFIRMATION_CLICK_YES: 'CONFIRMATION_CLICK_YES',
}

const ReplayLogList = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, requirementsMet, actionRequirementsMet, setLogItems, ANIMATION_SPEED, dataForReplay, currentLogItem, setCurrentLogItem } =
      useContext(StateGameContext)
   const { dispatchBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { setActions } = useContext(ActionsContext)
   const { sound } = useContext(SoundContext)
   const { settings } = useContext(SettingsContext)
   const [nextAction, setNextAction] = useState(null)

   const [countActions, cardsActions] = getActions(statePlayer, actionRequirementsMet)

   // Real actions from hooks
   const actionsDraft = useActionDraft()
   const actionsImmEffect = useActionCard()
   const actionsCardActions = useActionCardAction()
   const actionsSP = useActionSP()
   const actionsConvertHeatGreenery = useActionHeatGreenery()
   const actionsSellPatents = useSubactionSellPatents()
   const actionsPass = useActionPass()

   useEffect(() => {
      if (!nextAction) return
      switch (nextAction.name) {
         // ========================================================================================================================================
         // ================================================================================================================================== Draft
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.DRAFT_MODAL_CORPS_ON:
            actionsDraft.handleChangeCorp()
            break
         case REAL_USER_ACTIONS.DRAFT_CLICK_CORP:
            actionsDraft.handleCorpClick(nextAction.payload)
            break
         case REAL_USER_ACTIONS.DRAFT_CLICK_NEXT_MODAL_CORP:
            actionsDraft.handleClickNext()
            break
         case REAL_USER_ACTIONS.DRAFT_SELECT_CARD:
            actionsDraft.handleClickBtnSelect(nextAction.payload)
            break
         case REAL_USER_ACTIONS.DRAFT_INCREMENT_HEAT:
            actionsDraft.handleClickArrow('increment')
            break
         case REAL_USER_ACTIONS.DRAFT_CONFIRM:
            actionsDraft.onYesFunc()
            break
         // ========================================================================================================================================
         // ========================================================================================================================= Forced Actions
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.FORCED_INVENTRIX:
         case REAL_USER_ACTIONS.FORCED_THARSIS:
            actionsDraft.performForcedAction()
            break
         // ========================================================================================================================================
         // ================================================================================================================== Card Immediate Effect
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.IMMEFFECT_CARDSINHAND:
            sound.btnGeneralClick.play()
            setModals((prev) => ({
               ...prev,
               modalCards: getCardsSorted(statePlayer.cardsInHand, settings.sortId[0], requirementsMet),
               modalCardsType: 'Cards In Hand',
               cards: true,
            }))
            break
         case REAL_USER_ACTIONS.IMMEFFECT_SHOWCARD:
            sound.btnGeneralClick.play()
            setModals((prev) => ({ ...prev, modalCard: modals.modalCards.find((c) => c.id === nextAction.payload), cardWithAction: true }))
            break
         case REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_STEEL:
            actionsImmEffect.handleClickArrow(RESOURCES.STEEL, 'increment')
            break
         case REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_TITAN:
            actionsImmEffect.handleClickArrow(RESOURCES.TITAN, 'increment')
            break
         case REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_HEAT:
            actionsImmEffect.handleClickArrow(RESOURCES.HEAT, 'increment')
            break
         case REAL_USER_ACTIONS.IMMEFFECT_DECREMENT_STEEL:
            actionsImmEffect.handleClickArrow(RESOURCES.STEEL, 'decrement')
            break
         case REAL_USER_ACTIONS.IMMEFFECT_DECREMENT_TITAN:
            actionsImmEffect.handleClickArrow(RESOURCES.TITAN, 'decrement')
            break
         case REAL_USER_ACTIONS.IMMEFFECT_DECREMENT_HEAT:
            actionsImmEffect.handleClickArrow(RESOURCES.HEAT, 'decrement')
            break
         case REAL_USER_ACTIONS.IMMEFFECT_CLICKUSE:
            actionsImmEffect.onYesFunc()
            break
         // ========================================================================================================================================
         // =========================================================================================================================== Card actions
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.CARDACTION_MODALACTIONS:
            sound.btnSPorOtherSnap.play()
            setModals((prev) => ({ ...prev, modalOther: { header: 'ACTIONS', amount: countActions, data: cardsActions }, other: true }))
            break
         case REAL_USER_ACTIONS.CARDACTION_CLICKUSE:
            actionsCardActions.handleClickAction(nextAction.payload)
            break
         case REAL_USER_ACTIONS.CARDACTION_INCREMENT_STEEL:
            actionsCardActions.handleClickArrow(RESOURCES.STEEL, 'increment')
            break
         case REAL_USER_ACTIONS.CARDACTION_INCREMENT_TITAN:
            actionsCardActions.handleClickArrow(RESOURCES.TITAN, 'increment')
            break
         case REAL_USER_ACTIONS.CARDACTION_INCREMENT_HEAT:
            actionsCardActions.handleClickArrow(RESOURCES.HEAT, 'increment')
            break
         case REAL_USER_ACTIONS.CARDACTION_DECREMENT_STEEL:
            actionsCardActions.handleClickArrow(RESOURCES.STEEL, 'decrement')
            break
         case REAL_USER_ACTIONS.CARDACTION_DECREMENT_TITAN:
            actionsCardActions.handleClickArrow(RESOURCES.TITAN, 'decrement')
            break
         case REAL_USER_ACTIONS.CARDACTION_DECREMENT_HEAT:
            actionsCardActions.handleClickArrow(RESOURCES.HEAT, 'decrement')
            break
         case REAL_USER_ACTIONS.CARDACTION_USEACTION:
            actionsCardActions.onYesFunc(nextAction.payload.item, nextAction.payload.costs)
            break
         // ========================================================================================================================================
         // ====================================================================================================================== Standard Projects
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.SP_MODALACTIONS:
            sound.btnSPorOtherSnap.play()
            setModals((prev) => ({ ...prev, standardProjects: true }))
            break
         case REAL_USER_ACTIONS.SP_CLICKUSE:
            actionsSP.handleClickBtn(
               nextAction.payload.id,
               nextAction.payload.name,
               nextAction.payload.textConfirmation,
               nextAction.payload.paidMln,
               nextAction.payload.isAvailable
            )
            break
         case REAL_USER_ACTIONS.SP_INCREMENT_HEAT:
            actionsSP.handleClickArrow('increment')
            break
         case REAL_USER_ACTIONS.SP_USEACTION:
            actionsSP.onYesFunc(nextAction.payload.id, nextAction.payload.name, nextAction.payload.paidMln, nextAction.payload.heat)
            break
         // ========================================================================================================================================
         // =========================================================================================================================== Convert Heat
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.CONVERT_HEAT:
            actionsConvertHeatGreenery.onYesFuncHeat()
            break
         // ========================================================================================================================================
         // ======================================================================================================================= Convert Greenery
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.CONVERT_GREENERY:
            actionsConvertHeatGreenery.onYesFuncGreenery()
            break
         // ========================================================================================================================================
         // =========================================================================================================================== Sell Patents
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.SP_SELECT_CARD:
            actionsSellPatents.handleClickBtnSelect(nextAction.payload)
            break
         case REAL_USER_ACTIONS.SP_CONFIRM:
            actionsSellPatents.onYesFunc()
            break
         // ========================================================================================================================================
         // =================================================================================================================================== Pass
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.PASS:
            actionsPass.onYesFunc()
            break
         // ========================================================================================================================================
         // =================================================================================================================================== Misc
         // ========================================================================================================================================
         case REAL_USER_ACTIONS.MODALS_OFF:
            sound.btnGeneralClick.play()
            dispatchGame({ type: ACTIONS_GAME.SET_PHASE_VIEWGAMESTATE, payload: false })
            setModals((prev) => ({ ...prev, log: false, other: false, standardProjects: false, cards: false, cardWithAction: false, cardViewOnly: false, corp: false }))
            break
         case REAL_USER_ACTIONS.CONFIRMATION_ON:
            sound.btnGeneralClick.play()
            setModals((prev) => ({ ...prev, modalConf: { text: nextAction.payload, onYes: () => {}, onNo: () => {} }, confirmation: true }))
            break
         default:
            break
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [nextAction])

   const handleClickNextActionBtn = () => {
      if (stateGame.replayActionId) return
      sound.btnGeneralClick.play()
      const actionString = dataForReplay.logItems[currentLogItem].action
      const actionObj = parseActionStringToObject(actionString)
      let delay = ANIMATION_SPEED * SPEED_MODIFIER
      let textConfirmation

      dispatchGame({ type: ACTIONS_GAME.SET_REPLAY_ACTION_ID, payload: currentLogItem })

      // For all actions, turn viewing game state off and modals: log, other, sp, cards and card
      if (stateGame.phaseViewGameState || modals.log || modals.other || modals.standardProjects || modals.cards || modals.cardWithAction || modals.cardViewOnly || modals.corp) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.MODALS_OFF }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
      }

      // ========================================================================================================================================
      // ================================================================================================================================== Draft
      // ========================================================================================================================================
      if (actionObj.draft) {
         // Go back to corps (if gen 1)
         if (stateGame.generation === 1) {
            if (stateGame.phaseDraft) {
               setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.DRAFT_MODAL_CORPS_ON }), delay)
               delay += ANIMATION_SPEED * SPEED_MODIFIER + 500
            }
            setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.DRAFT_CLICK_CORP, payload: actionObj.corpId }), delay)
            delay += ANIMATION_SPEED * SPEED_MODIFIER
            setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.DRAFT_CLICK_NEXT_MODAL_CORP }), delay)
            delay += ANIMATION_SPEED * SPEED_MODIFIER
         }
         // Buy cards
         if (actionObj.ids) {
            actionObj.ids.forEach((id, idx) => {
               setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.DRAFT_SELECT_CARD, payload: id }), delay)
               idx === actionObj.ids.length ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.8)
            })
            // If bought with heat
            if (actionObj.paidHeat) {
               for (let i = 1; i <= actionObj.paidHeat; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.DRAFT_INCREMENT_HEAT }), delay)
                  i === actionObj.paidHeat ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            }
         }
         textConfirmation = stateGame.generation === 1 ? CONFIRMATION_TEXT.DRAFT_GEN1 : actionObj.ids.length === 0 ? CONFIRMATION_TEXT.DRAFT_NOCARDS : CONFIRMATION_TEXT.DRAFT_CARDS
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: textConfirmation }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.8
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.DRAFT_CONFIRM }), delay)
         // ========================================================================================================================================
         // ======================================================================================================================= Forced Inventrix
         // ========================================================================================================================================
      } else if (actionObj.forcedInventrix) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.FORCED_INVENTRIX }), delay)
         // ========================================================================================================================================
         // ========================================================================================================================= Forced Tharsis
         // ========================================================================================================================================
      } else if (actionObj.forcedTharsis) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.FORCED_THARSIS }), delay)
         // ========================================================================================================================================
         // ============================================================================================================================= Imm effect
         // ========================================================================================================================================
      } else if (actionObj.immEffect) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_CARDSINHAND }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_SHOWCARD, payload: actionObj.id }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER

         const cardPlayed = statePlayer.cardsInHand.find((c) => c.id === actionObj.id)
         const initValues = actionsImmEffect.getInitResources(cardPlayed)
         let actionObjPaid
         // If bought with steel
         actionObjPaid = actionObj.paidSteel ? actionObj.paidSteel : 0
         if (actionObjPaid !== initValues.resSteel) {
            if (actionObjPaid > initValues.resSteel) {
               for (let i = initValues.resSteel; i < actionObjPaid; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_STEEL }), delay)
                  i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            } else {
               for (let i = actionObjPaid; i < initValues.resSteel; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_DECREMENT_STEEL }), delay)
                  i === initValues.resSteel - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            }
         }
         // If bought with titan
         actionObjPaid = actionObj.paidTitan ? actionObj.paidTitan : 0
         if (actionObjPaid !== initValues.resTitan) {
            if (actionObjPaid > initValues.resTitan) {
               for (let i = initValues.resTitan; i < actionObjPaid; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_TITAN }), delay)
                  i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            } else {
               for (let i = actionObjPaid; i < initValues.resTitan; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_DECREMENT_TITAN }), delay)
                  i === initValues.resTitan - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            }
         }
         // If bought with heat
         actionObjPaid = actionObj.paidHeat ? actionObj.paidHeat : 0
         if (actionObjPaid !== initValues.resHeat) {
            if (actionObjPaid > initValues.resHeat) {
               for (let i = initValues.resHeat; i < actionObjPaid; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_HEAT }), delay)
                  i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            } else {
               for (let i = actionObjPaid; i < initValues.resHeat; i++) {
                  setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_DECREMENT_HEAT }), delay)
                  i === initValues.resHeat - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
               }
            }
         }
         textConfirmation = `Do you want to play: ${getCards(actionObj.id).name}`
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: textConfirmation }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_CLICKUSE }), delay)
         // ========================================================================================================================================
         // ============================================================================================================================ Card action
         // ========================================================================================================================================
      } else if (actionObj.cardAction) {
         const cardOrCorp = actionObj.id === CORP_NAMES.UNMI ? getCorporationById(12) : getCards(actionObj.id)
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_MODALACTIONS }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_CLICKUSE, payload: cardOrCorp }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7

         if (actionObj.paidSteel || actionObj.paidTitan || actionObj.paidHeat) {
            const [, steel, titan, heat] = actionsCardActions.changeCosts(actionObj.id, false)

            let actionObjPaid
            // If bought with steel
            actionObjPaid = actionObj.paidSteel ? actionObj.paidSteel : 0
            if (actionObjPaid !== steel) {
               if (steel < actionObjPaid) {
                  for (let i = steel; i < actionObjPaid; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_INCREMENT_STEEL }), delay)
                     i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               } else {
                  for (let i = actionObjPaid; i < steel; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_DECREMENT_STEEL }), delay)
                     i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               }
            }
            // If bought with titan
            actionObjPaid = actionObj.paidTitan ? actionObj.paidTitan : 0
            if (actionObjPaid !== titan) {
               if (titan < actionObjPaid) {
                  for (let i = titan; i < actionObjPaid; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_INCREMENT_TITAN }), delay)
                     i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               } else {
                  for (let i = actionObjPaid; i < titan; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_DECREMENT_TITAN }), delay)
                     i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               }
            }
            // If bought with heat
            actionObjPaid = actionObj.paidHeat ? actionObj.paidHeat : 0
            if (actionObjPaid !== heat) {
               if (heat < actionObjPaid) {
                  for (let i = heat; i < actionObjPaid; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_INCREMENT_HEAT }), delay)
                     i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               } else {
                  for (let i = actionObjPaid; i < heat; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_DECREMENT_HEAT }), delay)
                     i === actionObjPaid - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               }
            }
         }
         if (
            (actionObj.id === 12 && statePlayer.resources.titan > 0) || // Water Import From Europa
            (actionObj.id === 187 && statePlayer.resources.steel > 0) || // Aquifer Pumping
            (getActionIdsWithCost().includes(actionObj.id) && statePlayer.canPayWithHeat && statePlayer.resources.heat > 0)
         ) {
            setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_CLICKUSE, payload: cardOrCorp }), delay)
            delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         }

         setTimeout(
            () =>
               setNextAction({
                  name: REAL_USER_ACTIONS.CARDACTION_USEACTION,
                  payload: { item: cardOrCorp, costs: [actionObj.paidMln, actionObj.paidSteel, actionObj.paidTitan, actionObj.paidHeat] },
               }),
            delay
         )
         // ========================================================================================================================================
         // ====================================================================================================================== Standard Projects
         // ========================================================================================================================================
      } else if (actionObj.sp) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.SP_MODALACTIONS }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         // First click on SP use button
         setTimeout(
            () =>
               setNextAction({
                  name: REAL_USER_ACTIONS.SP_CLICKUSE,
                  payload: {
                     id: actionObj.id,
                     name: getNameOfSP(actionObj.id),
                     textConfirmation: getConfirmationTextOfSP(actionObj.id),
                     paidMln: actionObj.paidMln ? actionObj.paidMln : 0,
                     isAvailable: true,
                  },
               }),
            delay
         )
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7

         // If bought with heat - clicks on increase heat arrow
         if (actionObj.paidHeat) {
            for (let i = 0; i < actionObj.paidHeat; i++) {
               setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.SP_INCREMENT_HEAT }), delay)
               i === actionObj.paidHeat - 1 ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
            }
         }
         // Second click on SP use button
         if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0) {
            setTimeout(
               () =>
                  setNextAction({
                     name: REAL_USER_ACTIONS.SP_CLICKUSE,
                     payload: {
                        id: actionObj.id,
                        name: getNameOfSP(actionObj.id),
                        textConfirmation: getConfirmationTextOfSP(actionObj.id),
                        paidMln: actionObj.paidMln ? actionObj.paidMln : 0,
                        isAvailable: true,
                     },
                  }),
               delay
            )
            delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         }
         // Final actions after confirmation
         setTimeout(
            () =>
               setNextAction({
                  name: REAL_USER_ACTIONS.SP_USEACTION,
                  payload: {
                     id: actionObj.id,
                     name: getNameOfSP(actionObj.id),
                     paidMln: actionObj.paidMln ? actionObj.paidMln : 0,
                     heat: actionObj.paidHeat ? actionObj.paidHeat : 0,
                  },
               }),
            delay
         )
         // ========================================================================================================================================
         // =========================================================================================================================== Convert Heat
         // ========================================================================================================================================
      } else if (actionObj.convertHeat) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: CONFIRMATION_TEXT.CONVERT_HEAT }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONVERT_HEAT }), delay)
         // ========================================================================================================================================
         // ======================================================================================================================= Convert Greenery
         // ========================================================================================================================================
      } else if (actionObj.convertGreenery) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: `Do you want to convert ${statePlayer.valueGreenery} plants to a Greenery?` }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONVERT_GREENERY }), delay)
         // ========================================================================================================================================
         // ============================================================================================================================ Sell Patent
         // ========================================================================================================================================
      } else if (actionObj.spSellPatent) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.SP_MODALACTIONS }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         // Click on SP sell patent use button
         setTimeout(
            () =>
               setNextAction({
                  name: REAL_USER_ACTIONS.SP_CLICKUSE,
                  payload: { id: 0, name: getNameOfSP(0), textConfirmation: '', paidMln: 0, isAvailable: true },
               }),
            delay
         )
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         // Select cards to sell
         actionObj.ids.forEach((id, idx) => {
            setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.SP_SELECT_CARD, payload: id }), delay)
            idx === actionObj.ids.length ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.8)
         })
         // Confirm
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: CONFIRMATION_TEXT.SELLCARDS }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.8
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.SP_CONFIRM }), delay)
         // ========================================================================================================================================
         // =================================================================================================================================== Pass
         // ========================================================================================================================================
      } else if (actionObj.pass) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: CONFIRMATION_TEXT.PASS }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.PASS }), delay)
      }
   }

   const clickLogItemReplay = (idx, logItem = null) => {
      if (stateGame.replayActionId) return
      if (logItem?.type === LOG_TYPES.GENERATION) return
      if (idx === currentLogItem) return

      sound.btnGeneralClick.play()

      const cardsInOrderIds = [...dataForReplay.cards.seen.map((c) => c.id), ...dataForReplay.cards.inDeck]
      const { convertedLogItems, newStatePlayer, newStateGame, newStateBoard, newStateModal } = getLogAndStatesConvertedForGame(
         dataForReplay.logItems,
         dataForReplay.initStateBoard,
         cardsInOrderIds,
         dataForReplay.forfeited,
         idx
      )

      dispatchPlayer({ type: ACTIONS_PLAYER.SET_STATE, payload: newStatePlayer })
      dispatchGame({ type: ACTIONS_GAME.SET_STATE, payload: newStateGame })
      dispatchBoard({ type: ACTIONS_BOARD.SET_STATE, payload: newStateBoard })
      setModals(newStateModal)
      setLogItems(convertedLogItems)
      setActions(INIT_ACTIONS)

      setCurrentLogItem(idx)
   }

   return (
      <div className="replay-log-list">
         <div className="header">GO TO ACTION</div>
         <ul>
            {dataForReplay.logItems.map((logItem, idx) => (
               <ReplayLogListItem key={idx} logItem={logItem} idx={idx} clickLogItemReplay={clickLogItemReplay} currentLogItem={currentLogItem} />
            ))}
            <li
               className={`forfeited-endgame${currentLogItem === dataForReplay.logItems.length ? ' active' : ' pointer'}`}
               onClick={() => clickLogItemReplay(dataForReplay.logItems.length)}
            >
               {dataForReplay.forfeited ? 'FORFEITED' : 'END GAME'}
            </li>
         </ul>
         {currentLogItem !== dataForReplay.logItems.length && (
            <div className="btn-do-action" onClick={handleClickNextActionBtn}>
               DO ACTION
            </div>
         )}
      </div>
   )
}

export default ReplayLogList
