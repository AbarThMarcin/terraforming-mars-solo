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
import { getCards, getCardsSorted } from '../../../../utils/cards'
import { CONFIRMATION_TEXT } from '../../../../data/app'
import { RESOURCES } from '../../../../data/resources'
import { useActionCardAction } from '../../../../hooks/useActionCardAction'
import { getActions } from '../../../../utils/misc'
import { CORP_NAMES } from '../../../../data/corpNames'
import { getCorporationById } from '../../../../utils/corporation'
import ReplayLogListItem from './ReplayLogListItem'

const SPEED_MODIFIER = 0.7 // Smaller number, the faster animation

const REAL_USER_ACTIONS = {
   // Draft
   DRAFT_MODAL_CORPS_ON: 'DRAFT_MODAL_CORPS_ON',
   DRAFT_CLICK_CORP: 'DRAFT_CLICK_CORP',
   DRAFT_CLICK_NEXT_MODAL_CORP: 'DRAFT_CLICK_NEXT_MODAL_CORP',
   DRAFT_SELECT_CARD: 'DRAFT_SELECT_CARD',
   DRAFT_INCREMENT_HEAT: 'DRAFT_INCREMENT_HEAT',
   DRAFT_CONFIRM: 'DRAFT_CONFIRM',
   // Forced Action - Inventrix
   FORCED_INVENTRIX: 'VIEW_GAME_STATE_OFF',
   // Immediate Effect
   IMMEFFECT_CARDSINHAND: 'IMMEFFECT_CARDSINHAND',
   IMMEFFECT_SHOWCARD: 'IMMEFFECT_SHOWCARD',
   IMMEFFECT_CLICKUSE: 'IMMEFFECT_CLICKUSE',
   IMMEFFECT_INCREMENT_STEEL: 'IMMEFFECT_INCREMENT_STEEL',
   IMMEFFECT_INCREMENT_TITAN: 'IMMEFFECT_INCREMENT_TITAN',
   IMMEFFECT_INCREMENT_HEAT: 'IMMEFFECT_INCREMENT_HEAT',
   // Card actions
   CARDACTION_MODALACTIONS: 'CARDACTION_MODALACTIONS',
   CARDACTION_CLICKUSE: 'CARDACTION_CLICKUSE',
   CARDACTION_INCREMENT_STEEL: 'CARDACTION_INCREMENT_STEEL',
   CARDACTION_INCREMENT_TITAN: 'CARDACTION_INCREMENT_TITAN',
   CARDACTION_INCREMENT_HEAT: 'CARDACTION_INCREMENT_HEAT',
   CARDACTION_DECREMENT_STEEL: 'CARDACTION_DECREMENT_STEEL',
   CARDACTION_DECREMENT_TITAN: 'CARDACTION_DECREMENT_TITAN',
   CARDACTION_DECREMENT_HEAT: 'CARDACTION_DECREMENT_HEAT',
   CARDACTION_USEACTION: 'CARDACTION_USEACTION',
   // Misc
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

   const actionsDraft = useActionDraft()
   const actionsImmEffect = useActionCard()
   const actionsCardActions = useActionCardAction()

   useEffect(() => {
      if (!nextAction) return
      switch (nextAction.name) {
         // Draft
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
         // Forced Inventrix
         case REAL_USER_ACTIONS.FORCED_INVENTRIX:
            actionsDraft.performForcedAction()
            break
         // Card Immediate Effect
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
         case REAL_USER_ACTIONS.IMMEFFECT_CLICKUSE:
            actionsImmEffect.onYesFunc()
            break
         // Card actions
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
         // Misc
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
      } else if (actionObj.forcedInventrix) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.FORCED_INVENTRIX }), delay)
      } else if (actionObj.immEffect) {
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_CARDSINHAND }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_SHOWCARD, payload: actionObj.id }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         // If bought with steel
         if (actionObj.paidSteel) {
            for (let i = 1; i <= actionObj.paidSteel; i++) {
               setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_STEEL }), delay)
               i === actionObj.paidSteel ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
            }
         }
         // If bought with titan
         if (actionObj.paidTitan) {
            for (let i = 1; i <= actionObj.paidTitan; i++) {
               setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_TITAN }), delay)
               i === actionObj.paidTitan ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
            }
         }
         // If bought with heat
         if (actionObj.paidHeat) {
            for (let i = 1; i <= actionObj.paidHeat; i++) {
               setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_INCREMENT_HEAT }), delay)
               i === actionObj.paidHeat ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
            }
         }
         textConfirmation = `Do you want to play: ${getCards(actionObj.id).name}`
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CONFIRMATION_ON, payload: textConfirmation }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.IMMEFFECT_CLICKUSE }), delay)
      } else if (actionObj.cardAction) {
         const cardOrCorp = actionObj.id === CORP_NAMES.UNMI ? getCorporationById(12) : getCards(actionObj.id)
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_MODALACTIONS }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER
         setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_CLICKUSE, payload: cardOrCorp }), delay)
         delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.7
         // If bought with anything
         if (actionObj.paidSteel || actionObj.paidTitan || actionObj.paidHeat) {
            const [, steel, titan, heat] = actionsCardActions.changeCosts(actionObj.id, false)
            if (actionObj.paidSteel) {
               if (steel < actionObj.paidSteel) {
                  for (let i = steel; i < actionObj.paidSteel; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_INCREMENT_STEEL }), delay)
                     i === actionObj.paidSteel ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               } else if (steel > actionObj.paidSteel) {
                  for (let i = actionObj.paidSteel; i < steel; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_DECREMENT_STEEL }), delay)
                     i === actionObj.paidSteel ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               }
            }
            if (actionObj.paidTitan) {
               if (titan < actionObj.paidTitan) {
                  for (let i = titan; i < actionObj.paidTitan; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_INCREMENT_TITAN }), delay)
                     i === actionObj.paidTitan ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               } else if (actionObj.paidTitan < titan) {
                  for (let i = actionObj.paidTitan; i < titan; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_DECREMENT_TITAN }), delay)
                     i === actionObj.paidTitan ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               }
            }
            if (actionObj.paidHeat) {
               if (heat < actionObj.paidHeat) {
                  for (let i = heat; i < actionObj.paidHeat; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_INCREMENT_HEAT }), delay)
                     i === actionObj.paidHeat ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               } else if (actionObj.paidHeat < heat) {
                  for (let i = actionObj.paidHeat; i < heat; i++) {
                     setTimeout(() => setNextAction({ name: REAL_USER_ACTIONS.CARDACTION_DECREMENT_HEAT }), delay)
                     i === actionObj.paidHeat ? (delay += ANIMATION_SPEED * SPEED_MODIFIER) : (delay += ANIMATION_SPEED * SPEED_MODIFIER * 0.4)
                  }
               }
            }
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
