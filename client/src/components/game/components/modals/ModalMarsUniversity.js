// Modal for viewing and selecting cards when Mars University has been played
import { useContext, useEffect, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, UserContext, StateBoardContext, CorpsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getLogConvertedForDB, getThinerStatePlayerForActive } from '../../../../utils/dataConversion'
import { getPositionInModalCards, getCardsWithDecreasedCost, getCards, getNewCardsDrawIds, getCardsWithTimeAdded } from '../../../../utils/cards'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import Arrows from './modalsComponents/arrows/Arrows'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { updateGameData } from '../../../../api/activeGame'
import { funcSetLogItemsSingleActions, funcUpdateLastLogItemAfter, funcUpdateLogItemAction } from '../../../../data/log'

const ModalMarsUniversity = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, logItems, ANIMATION_SPEED, setSyncError, setLogItems, durationSeconds } = useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { initCorpsIds } = useContext(CorpsContext)
   const { sound } = useContext(SoundContext)
   const [selectedCardId, setSelectedCardId] = useState(0)
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0', left: '42%', transform: 'translateX(-50%)' }
   const btnCancelPosition = { bottom: '0', left: '58%', transform: 'translateX(-50%)' }

   // Update Server Data
   useEffect(() => {
      // Update active game on server only if user is logged
      if (!user) return

      // Update Server Data
      const updatedData = {
         statePlayer: getThinerStatePlayerForActive(statePlayer),
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

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      setModals((prev) => ({
         ...prev,
         modalCards: statePlayer.cardsInHand,
      }))
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [statePlayer.cardsInHand])

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const onYesFunc = async () => {
      // Turn mars university phase off
      setModals((prev) => ({ ...prev, marsUniversity: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY, payload: false })
      // Get Random Cards Ids
      let newCardsDrawIds = await getNewCardsDrawIds(1, statePlayer, dispatchPlayer, type, id, user?.token)
      // Discard selected card
      startAnimation(setModals)
      setAnimation(ANIMATIONS.CARD_OUT, RESOURCES.CARD, 1, setModals)
      let newCardsInHand = JSON.parse(JSON.stringify(statePlayer.cardsInHand.filter((card) => card.id !== selectedCardId)))
      setTimeout(() => {
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCardsInHand })
         funcSetLogItemsSingleActions(`Discarded 1 card (${getCards([selectedCardId])[0].name}) from MARS UNIVERSITY effect`, RESOURCES.CARD, -1, setLogItems)
         endAnimation(setModals)
      }, ANIMATION_SPEED)
      // Draw a card
      setTimeout(() => {
         startAnimation(setModals)
         setAnimation(ANIMATIONS.CARD_IN, RESOURCES.CARD, 1, setModals)
      }, ANIMATION_SPEED)
      newCardsInHand = [...newCardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)]
      setTimeout(() => {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: newCardsInHand,
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_SEEN,
            payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)],
         })
         funcSetLogItemsSingleActions(`Drew 1 card (${getCards(newCardsDrawIds)[0].name}) from MARS UNIVERSITY effect`, RESOURCES.CARD, 1, setLogItems)
         let newStatePlayer = JSON.parse(JSON.stringify(statePlayer))
         newStatePlayer = {
            ...newStatePlayer,
            cardsInHand: newCardsInHand,
         }
         funcUpdateLastLogItemAfter(setLogItems, newStatePlayer, stateGame)
         endAnimation(setModals)
         // Continue remaining actions
         startAnimation(setModals)
         performSubActions(stateGame.actionsLeft, true)
         funcUpdateLogItemAction(setLogItems, `MUtargetId: ${selectedCardId}`)
      }, ANIMATION_SPEED * 2)
   }

   const onCancelFunc = () => {
      // Turn mars university phase off
      setModals((prev) => ({ ...prev, marsUniversity: false }))
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_MARS_UNIVERSITY, payload: false })
      // Continue remaining actions
      startAnimation(setModals)
      performSubActions(stateGame.actionsLeft, true)
   }

   const handleClickBtnSelect = (card) => {
      if (selectedCardId === 0 || card.id !== selectedCardId) {
         setSelectedCardId(card.id)
      } else {
         setSelectedCardId(0)
      }
   }

   return (
      <>
         {/* ARROWS */}
         {modals.modalCards.length > 10 && <Arrows page={page} setPage={setPage} pages={Math.ceil(modals.modalCards.length / 10)} />}
         <div className="modal-select-cards">
            <div className="box full-size" style={{ left: getBoxPosition() }}>
               {/* CARDS */}
               {statePlayer.cardsInHand.map((card, idx) => (
                  <div
                     key={idx}
                     className={`card-container small ${selectedCardId === card.id && 'selected'}`}
                     style={getPositionInModalCards(statePlayer.cardsInHand.length, idx)}
                     onClick={() => {
                        sound.btnCardsClick.play()
                        setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
                     }}
                  >
                     {/* CARD */}
                     <Card card={card} />
                     {/* SELECT BUTTON */}
                     <div
                        className={`pointer ${card.id === selectedCardId ? 'btn-selected' : 'btn-select'}`}
                        onClick={(e) => {
                           e.stopPropagation()
                           handleClickBtnSelect(card)
                        }}
                     >
                        {card.id === selectedCardId ? 'SELECTED' : 'SELECT'}
                     </div>
                  </div>
               ))}
            </div>
            {/* HEADER */}
            <ModalHeader text="SELECT CARD TO DISCARD" />
            {/* ACTION BUTTON */}
            <BtnAction text="DISCARD" onYesFunc={onYesFunc} disabled={selectedCardId === 0} position={btnActionPosition} />
            {/* CANCEL BUTTON */}
            <BtnAction text="CANCEL" onYesFunc={onCancelFunc} position={btnCancelPosition} />
         </div>
      </>
   )
}

export default ModalMarsUniversity
