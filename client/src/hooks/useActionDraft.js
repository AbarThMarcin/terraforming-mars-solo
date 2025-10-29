import { useContext } from 'react'
import { SettingsContext, SoundContext } from '../App'
import { ActionsContext, CorpsContext, ModalsContext, StateGameContext, StatePlayerContext, UserContext } from '../components/game'
import { ANIMATIONS, startAnimation } from '../data/animations'
import { CORP_NAMES } from '../data/corpNames'
import { EFFECTS } from '../data/effects/effectIcons'
import { IMM_EFFECTS } from '../data/immEffects/immEffects'
import { LOG_ICONS, LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter, funcUpdateLogItemAction } from '../data/log'
import { RESOURCES } from '../data/resources'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { getCards, getCardsSorted, getCardsWithDecreasedCost, getCardsWithTimeAdded, getNewCardsDrawIds } from '../utils/cards'
import { performImmediateCorpEffect } from '../data/effects/effects'
import { INIT_ACTIONS } from '../initStates/initActions'
import { turnReplayActionOff } from '../utils/misc'
import { useSubactionTile } from './useSubactionTile'
import { MATCH_TYPES } from '../data/app'

export const useActionDraft = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { settings } = useContext(SettingsContext)
   const {
      stateGame,
      dispatchGame,
      performSubActions,
      getImmEffects,
      getEffect,
      requirementsMet,
      setSaveToServerTrigger,
      setLogItems,
      setItemsExpanded,
      dataForReplay,
      setCurrentLogItem,
   } = useContext(StateGameContext)
   const stateGameContextObj = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { corps } = useContext(CorpsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const { actions, setActions } = useContext(ActionsContext)

   const { handleClickField } = useSubactionTile()

   const handleClickBtnSelect = (cardId) => {
      sound.btnSelectClick.play()
      let addCard = actions.ids.includes(cardId) === false
      if (addCard) {
         setActions((prev) => ({ ...prev, ids: [...prev.ids, cardId] }))
      } else {
         setActions((prev) => ({ ...prev, ids: prev.ids.filter((id) => id !== cardId) }))
      }
      setActions((prev) => {
         let diffMln = addCard ? 3 : -3
         let diffHeat = 0
         if (prev.mln + diffMln < 0) {
            diffHeat = prev.mln + diffMln
            diffMln = -3 - diffHeat
         }
         return { ...prev, mln: prev.mln + diffMln, heat: prev.heat + diffHeat }
      })
   }

   const handleClickArrow = (operation) => {
      sound.btnGeneralClick.play()
      if (operation === 'increment') {
         setActions((prev) => ({ ...prev, mln: prev.mln - 1, heat: prev.heat + 1 }))
      }
      if (operation === 'decrement') {
         setActions((prev) => ({ ...prev, mln: prev.mln + 1, heat: prev.heat - 1 }))
      }
   }

   const onYesFunc = () => {
      sound.btnGeneralClick.play()
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.DRAFT }, setItemsExpanded)
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, 'draft')
      if (actions.ids.length !== 0)
         funcUpdateLogItemAction(
            setLogItems,
            `${actions.mln ? 'paidMln: ' + actions.mln + '; ' : ''}${actions.heat ? 'paidHeat: ' + actions.heat + '; ' : ''}ids: ${actions.ids.join(', ')}`
         )
      if (stateGame.generation === 1) funcUpdateLogItemAction(setLogItems, `corpId: ${statePlayer.corporation.id}`)

      // Decrease corporation resources
      if (actions.mln > 0) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -actions.mln })
         funcSetLogItemsSingleActions(`Paid ${actions.mln} MC for cards in draft phase`, RESOURCES.MLN, -actions.mln, setLogItems)
      }
      if (actions.heat > 0) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -actions.heat })
         funcSetLogItemsSingleActions(`Paid ${actions.heat} heat for cards in draft phase`, RESOURCES.HEAT, -actions.heat, setLogItems)
      }
      // Add selected cards to the hand and cards purchased
      const purchasedCards = getCardsWithTimeAdded(getCardsWithDecreasedCost(getCards(statePlayer.cardsDrawIds), statePlayer).filter((card) => actions.ids.includes(card.id)))
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: getCardsSorted([...statePlayer.cardsInHand, ...purchasedCards], settings.sortId[0], requirementsMet),
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_PURCHASED,
         payload: [...statePlayer.cardsPurchased, ...purchasedCards],
      })
      if (actions.ids.length > 0)
         funcSetLogItemsSingleActions(
            `Purchased ${actions.ids.length} card${actions.ids.length > 1 ? 's' : ''} in the draft phase`,
            RESOURCES.CARD,
            actions.ids.length,
            setLogItems
         )
      // Set phase draft = FALSE
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Dismount draft modal
      setModals((prev) => ({ ...prev, confirmation: false }))
      // Update Server Data
      setSaveToServerTrigger((prev) => !prev)
      // Update Log with state of the game AFTER played action
      funcUpdateLastLogItemAfter(
         setLogItems,
         {
            ...statePlayer,
            resources: { ...statePlayer.resources, mln: statePlayer.resources.mln - actions.mln, heat: statePlayer.resources.heat - actions.heat },
            cardsInHand: [...statePlayer.cardsInHand, ...purchasedCards],
            cardsPurchased: [...statePlayer.cardsPurchased, ...purchasedCards],
         },
         stateGame
      )
      // Perform forced action for Tharsis or Inventrix in GEN 1, IF NOT REPLAY
      if (stateGame.generation === 1 && !dataForReplay) performForcedAction()

      // In Replay mode, turn off the ReplayAction phase and move to the next action
      turnReplayActionOff(stateGame, dispatchGame, dataForReplay, setCurrentLogItem)

      setActions(INIT_ACTIONS)
   }

   const performForcedAction = async () => {
      const purchasedCardsForLog = dataForReplay
         ? []
         : getCardsWithTimeAdded(getCardsWithDecreasedCost(getCards(statePlayer.cardsDrawIds), statePlayer).filter((card) => actions.ids.includes(card.id)))
      const resourcesForLog = dataForReplay
         ? { ...statePlayer.resources, mln: statePlayer.resources.mln, heat: statePlayer.resources.heat }
         : { ...statePlayer.resources, mln: statePlayer.resources.mln - actions.mln, heat: statePlayer.resources.heat - actions.heat }

      if (statePlayer.corporation.name === CORP_NAMES.THARSIS_REPUBLIC) {
         // Create new Log Item with STATE BEFORE, before Tharsis forced action
         funcCreateLogItem(
            setLogItems,
            {
               ...statePlayer,
               resources: resourcesForLog,
               cardsInHand: [...statePlayer.cardsInHand, ...purchasedCardsForLog],
               cardsPurchased: [...statePlayer.cardsPurchased, ...purchasedCardsForLog],
            },
            stateGame,
            { type: LOG_TYPES.FORCED_ACTION, title: CORP_NAMES.THARSIS_REPUBLIC, titleIcon: LOG_ICONS.FORCED_THARSIS },
            setItemsExpanded
         )
         // Also save action (string) for log that is being performed
         funcUpdateLogItemAction(setLogItems, 'forcedTharsis')

         const subActions = [...getImmEffects(IMM_EFFECTS.CITY), ...getEffect(EFFECTS.EFFECT_THARSIS_CITY), ...getEffect(EFFECTS.EFFECT_THARSIS_CITY_ONPLANET)]
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: subActions })
         performSubActions(subActions, false, handleClickField)
      }
      if (statePlayer.corporation.name === CORP_NAMES.INVENTRIX) {
         // Create new Log Item with STATE BEFORE, before Inventrix forced action
         funcCreateLogItem(
            setLogItems,
            {
               ...statePlayer,
               resources: resourcesForLog,
               cardsInHand: [...statePlayer.cardsInHand, ...purchasedCardsForLog],
               cardsPurchased: [...statePlayer.cardsPurchased, ...purchasedCardsForLog],
            },
            stateGame,
            { type: LOG_TYPES.FORCED_ACTION, title: CORP_NAMES.INVENTRIX, titleIcon: LOG_ICONS.FORCED_INVENTRIX },
            setItemsExpanded
         )
         // Also save action (string) for log that is being performed
         funcUpdateLogItemAction(setLogItems, 'forcedInventrix')

         // Get Random Cards Ids
         startAnimation(setModals)
         let newCardsDrawIds = await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
         const newCardsDrawNames = getCards(newCardsDrawIds).map((c) => c.name)
         funcSetLogItemsSingleActions(`Drew 3 cards (${newCardsDrawNames[0]}, ${newCardsDrawNames[1]} and ${newCardsDrawNames[2]})`, RESOURCES.CARD, 3, setLogItems)
         const cards = type === MATCH_TYPES.REPLAY ? getCardsSorted(
            [
               ...getCardsWithTimeAdded(statePlayer.cardsInHand, statePlayer),
               ...getCardsWithTimeAdded(getCards(newCardsDrawIds), statePlayer),
            ],
            settings.sortId[0],
            requirementsMet
         ) : getCardsSorted(
            [
               ...getCardsWithTimeAdded(getCards(statePlayer.cardsDrawIds), statePlayer).filter((card) => actions.ids.includes(card.id)),
               ...getCardsWithTimeAdded(getCards(newCardsDrawIds), statePlayer),
            ],
            settings.sortId[0],
            requirementsMet
         )
         performSubActions([
            {
               name: ANIMATIONS.CARD_IN,
               type: RESOURCES.CARD,
               value: 3,
               func: () => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: cards })
                  dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)] })
               },
            },
         ])
      }
   }

   const handleCorpClick = (corpId, e) => {
      if (e) e.stopPropagation()
      if (!stateGameContextObj) return // If in Main Menu -> Stats
      if (!stateGameContextObj.stateGame.phaseCorporation) return
      sound.btnGeneralClick.play()
      setActions((prev) => ({ ...prev, corpId }))
   }

   const handleClickNext = () => {
      sound.btnGeneralClick.play()
      // Assign choosen corporation to statePlayer.corporation
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_CORPORATION, payload: corps.find((c) => c.id === actions.corpId) })
      // Perform immediate effects
      performImmediateCorpEffect(
         corps.find((c) => c.id === actions.corpId),
         dispatchPlayer,
         dispatchGame
      )
      // Turn off corporation phase and turn on draft phase
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: true })
   }

   const handleChangeCorp = () => {
      sound.btnGeneralClick.play()
      // Reset player state
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_VALUE_GREENERY, payload: 8 })
      dispatchPlayer({ type: ACTIONS_PLAYER.SET_CANPAYWITHHEAT, payload: false })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS,
         payload: -statePlayer.globParamReqModifier,
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.CHANGE_VALUE_TITAN,
         payload: statePlayer.valueTitan === 4 ? -1 : 0,
      })
      dispatchGame({ type: ACTIONS_GAME.SET_POWERPLANT_COST, payload: 11 })
      // Reset game state
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_CORPORATION, payload: true })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
   }

   return { handleClickBtnSelect, handleClickArrow, onYesFunc, handleCorpClick, handleClickNext, handleChangeCorp, performForcedAction }
}
