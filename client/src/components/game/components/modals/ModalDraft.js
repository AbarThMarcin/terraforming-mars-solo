/* Used to show window with cards to buy in the draft phase,
window with cards to sell and window with cards to select due
to any effect/action */
import { useContext, useEffect, useMemo, useState } from 'react'
import { StateGameContext, StatePlayerContext, CorpsContext, ModalsContext, UserContext, StateBoardContext } from '../../../game'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnChangeCorp from '../buttons/BtnChangeCorp'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getLogConvertedForDB, getThinerStatePlayer } from '../../../../utils/logReplay'
import { getPositionInModalCards, getCards, getNewCardsDrawIds, getCardsWithDecreasedCost, getCardsSorted, getCardsWithTimeAdded } from '../../../../utils/cards'
import { IMM_EFFECTS } from '../../../../data/immEffects/immEffects'
import { EFFECTS } from '../../../../data/effects/effectIcons'
import { ANIMATIONS } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import { CORP_NAMES } from '../../../../data/corpNames'
import BtnSelect from '../buttons/BtnSelect'
import { LOG_TYPES, funcUpdateLastLogItemAfter, funcCreateLogItem, funcSetLogItemsSingleActions, LOG_ICONS, funcUpdateLogItemAction } from '../../../../data/log/log'
import DecreaseCostDraft from './modalsComponents/decreaseCost/DecreaseCostDraft'
import { SettingsContext, SoundContext } from '../../../../App'
import { updateGameData } from '../../../../api/activeGame'

const ModalDraft = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { settings } = useContext(SettingsContext)
   const { sound } = useContext(SoundContext)
   const {
      stateGame,
      dispatchGame,
      performSubActions,
      getImmEffects,
      getEffect,
      requirementsMet,
      setSaveToServerTrigger,
      logItems,
      setSyncError,
      setLogItems,
      setItemsExpanded,
      durationSeconds,
   } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { initCorpsIds } = useContext(CorpsContext)
   const { type, id, user } = useContext(UserContext)
   const [toBuyMln, setToBuyMln] = useState(0)
   const [toBuyHeat, setToBuyHeat] = useState(0)
   const [selectedCardsIds, setSelectedCardsIds] = useState([])
   const cardsDraft = useMemo(
      () => getCardsWithDecreasedCost(getCards(statePlayer.cardsDrawIds), statePlayer),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [statePlayer.cardsDrawIds]
   )
   const textConfirmation =
      stateGame.generation === 1
         ? 'Are you sure you want to choose this corporation and these project cards?'
         : toBuyMln === 0
         ? "Are you sure you don't want to buy any cards?"
         : 'Are you sure you want to buy these project cards?'

   const btnActionPosition = { bottom: '0.5%', left: '50%', transform: 'translateX(-50%)' }

   // Add draft cards to the cardsSeen
   useEffect(() => {
      // Update latest Log Item (PASS) with state of the game AFTER passed
      funcUpdateLastLogItemAfter(setLogItems, statePlayer, stateGame)

      // Update active game on server only for generation other than 1
      if (stateGame.generation === 1 || !user) return

      if (!statePlayer.cardsSeen.includes(cardsDraft[0].id)) {
         const newCards = [...statePlayer.cardsSeen, ...cardsDraft]
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: newCards })
         // Update Server Data
         const updatedData = {
            statePlayer: getThinerStatePlayer(statePlayer),
            stateGame,
            stateModals: modals,
            stateBoard,
            corps: initCorpsIds,
            logItems: getLogConvertedForDB(logItems),
            durationSeconds,
         }
         updateGameData(user.token, updatedData, type).then((res) => {
            if (res.message === 'success') {
               setSyncError('')
            } else {
               setSyncError('THERE ARE SOME ISSUES WITH UPDATING GAME ON SERVER')
            }
         })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const onYesFunc = async () => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.DRAFT }, setItemsExpanded)
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, 'draft')
      if (selectedCardsIds.length !== 0)
         funcUpdateLogItemAction(setLogItems, `${toBuyMln ? 'paidMln: ' + toBuyMln : ''}${toBuyHeat ? 'paidHeat: ' + toBuyHeat : ''}; ids: ${selectedCardsIds.join(', ')}`)
      if (stateGame.generation === 1) funcUpdateLogItemAction(setLogItems, `corpId: ${statePlayer.corporation.id}`)

      // let actionString = 'draft'
      // if (selectedCardsIds.length !== 0) {
      //    actionString += `[${toBuyMln ? 'paidMln: ' + toBuyMln : ''}${toBuyHeat ? 'paidHeat: ' + toBuyHeat : ''}; ids: ${selectedCardsIds.join(', ')}`
      // }
      // if (stateGame.generation === 1) actionString += `; corpId: ${statePlayer.corporation}`
      // actionString += ']'
      // funcUpdateLogItemAction(setLogItems, actionString)

      // Decrease corporation resources
      if (toBuyMln > 0) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln })
         funcSetLogItemsSingleActions(`Paid ${toBuyMln} MC for cards in draft phase`, RESOURCES.MLN, -toBuyMln, setLogItems)
      }
      if (toBuyHeat > 0) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         funcSetLogItemsSingleActions(`Paid ${toBuyHeat} heat for cards in draft phase`, RESOURCES.HEAT, -toBuyHeat, setLogItems)
      }
      // Add selected cards to the hand and cards purchased
      const purchasedCards = getCardsWithTimeAdded(cardsDraft.filter((card) => selectedCardsIds.includes(card.id)))
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: getCardsSorted([...statePlayer.cardsInHand, ...purchasedCards], settings.sortId[0], requirementsMet),
      })
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_PURCHASED,
         payload: [...statePlayer.cardsPurchased, ...purchasedCards],
      })
      if (selectedCardsIds.length > 0)
         funcSetLogItemsSingleActions(
            `Purchased ${selectedCardsIds.length} card${selectedCardsIds.length > 1 ? 's' : ''} in the draft phase`,
            RESOURCES.CARD,
            selectedCardsIds.length,
            setLogItems
         )
      // Set phase draft = FALSE
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Dismount draft modal
      setModals((prev) => ({ ...prev, confirmation: false, draft: false }))
      // Update Server Data
      setSaveToServerTrigger((prev) => !prev)
      // Update Log with state of the game AFTER played action
      funcUpdateLastLogItemAfter(
         setLogItems,
         {
            ...statePlayer,
            resources: { ...statePlayer.resources, mln: statePlayer.resources.mln - toBuyMln, heat: statePlayer.resources.heat - toBuyHeat },
            cardsInHand: [...statePlayer.cardsInHand, ...purchasedCards],
            cardsPurchased: [...statePlayer.cardsPurchased, ...purchasedCards],
         },
         stateGame
      )
      // Perform forced action for Tharsis or Inventrix in GEN 1
      if (stateGame.generation === 1) {
         if (statePlayer.corporation.name === CORP_NAMES.THARSIS_REPUBLIC) {
            // Create new Log Item with STATE BEFORE, before Tharsis forced action
            funcCreateLogItem(
               setLogItems,
               {
                  ...statePlayer,
                  resources: { ...statePlayer.resources, mln: statePlayer.resources.mln - toBuyMln, heat: statePlayer.resources.heat - toBuyHeat },
                  cardsInHand: [...statePlayer.cardsInHand, ...purchasedCards],
                  cardsPurchased: [...statePlayer.cardsPurchased, ...purchasedCards],
               },
               stateGame,
               { type: LOG_TYPES.FORCED_ACTION, title: CORP_NAMES.THARSIS_REPUBLIC, titleIcon: LOG_ICONS.FORCED_THARSIS },
               setItemsExpanded
            )
            // Also save action (string) for log that is being performed
            funcUpdateLogItemAction(setLogItems, 'forcedTharsis')

            const actions = [...getImmEffects(IMM_EFFECTS.CITY), ...getEffect(EFFECTS.EFFECT_THARSIS_CITY), ...getEffect(EFFECTS.EFFECT_THARSIS_CITY_ONPLANET)]
            dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
            performSubActions(actions)
         }
         if (statePlayer.corporation.name === CORP_NAMES.INVENTRIX) {
            // Create new Log Item with STATE BEFORE, before Inventrix forced action
            funcCreateLogItem(
               setLogItems,
               {
                  ...statePlayer,
                  resources: { ...statePlayer.resources, mln: statePlayer.resources.mln - toBuyMln, heat: statePlayer.resources.heat - toBuyHeat },
                  cardsInHand: [...statePlayer.cardsInHand, ...purchasedCards],
                  cardsPurchased: [...statePlayer.cardsPurchased, ...purchasedCards],
               },
               stateGame,
               { type: LOG_TYPES.FORCED_ACTION, title: CORP_NAMES.INVENTRIX, titleIcon: LOG_ICONS.FORCED_INVENTRIX },
               setItemsExpanded
            )
            // Also save action (string) for log that is being performed
            funcUpdateLogItemAction(setLogItems, 'forcedInventrix')

            // Get Random Cards Ids
            let newCardsDrawIds = await getNewCardsDrawIds(3, statePlayer, dispatchPlayer, type, id, user?.token)
            const newCardsDrawNames = getCards(newCardsDrawIds).map((c) => c.name)
            funcSetLogItemsSingleActions(`Drew 3 cards (${newCardsDrawNames[0]}, ${newCardsDrawNames[1]} and ${newCardsDrawNames[2]})`, RESOURCES.CARD, 3, setLogItems)
            performSubActions([
               {
                  name: ANIMATIONS.CARD_IN,
                  type: RESOURCES.CARD,
                  value: 3,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: getCardsSorted(
                           [...cardsDraft.filter((card) => selectedCardsIds.includes(card.id)), ...getCardsWithDecreasedCost(getCards(newCardsDrawIds), statePlayer)],
                           settings.sortId[0],
                           requirementsMet
                        ),
                     })
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                        payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)],
                     })
                  },
               },
            ])
         }
      }
   }

   const handleClickBtnSelect = (card) => {
      let addCard = selectedCardsIds.includes(card.id) === false
      let resMln = addCard ? toBuyMln + 3 : toBuyMln - 3
      let resHeat = toBuyHeat
      if (resMln < 0) {
         resHeat -= 0 - resMln
         resMln = 0
      }
      if (addCard) {
         setSelectedCardsIds((ids) => [...ids, card.id])
      } else {
         setSelectedCardsIds((ids) => ids.filter((id) => id !== card.id))
      }
      setToBuyMln(resMln)
      setToBuyHeat(resHeat)
   }

   return (
      <div className={`modal-select-cards ${(modals.cards || stateGame.phaseViewGameState) && 'display-none'}`}>
         {/* HEADER */}
         <ModalHeader text={stateGame.generation === 1 ? 'BUY UP TO 10 CARDS' : 'BUY UP TO 4 CARDS'} eachText="3" />
         {/* CHANGE CORPORATION BUTTON */}
         {stateGame.generation === 1 && <BtnChangeCorp dispatchGame={dispatchGame} statePlayer={statePlayer} dispatchPlayer={dispatchPlayer} />}
         {/* CARDS */}
         {cardsDraft.map((card, idx) => (
            <div
               key={idx}
               className={`card-container small ${selectedCardsIds.includes(card.id) && 'selected'}`}
               style={getPositionInModalCards(cardsDraft.length, idx)}
               onClick={() => {
                  sound.btnCardsClick.play()
                  setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
               }}
            >
               <Card card={card} />
               <BtnSelect initBtnText="SELECT" handleClick={() => handleClickBtnSelect(card)} />
            </div>
         ))}
         {/* ACTION BUTTON */}
         <BtnAction
            text="DONE"
            mln={toBuyMln}
            textConfirmation={textConfirmation}
            onYesFunc={onYesFunc}
            disabled={toBuyMln > statePlayer.resources.mln}
            position={btnActionPosition}
         />
         {/* DECREASE COST IF HELION */}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && selectedCardsIds.length > 0 && (
            <DecreaseCostDraft toBuyMln={toBuyMln} setToBuyMln={setToBuyMln} toBuyHeat={toBuyHeat} setToBuyHeat={setToBuyHeat} />
         )}
      </div>
   )
}

export default ModalDraft
