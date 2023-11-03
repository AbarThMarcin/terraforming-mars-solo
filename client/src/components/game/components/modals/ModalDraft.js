/* Used to show window with cards to buy in the draft phase,
window with cards to sell and window with cards to select due
to any effect/action */
import { useContext, useEffect, useMemo } from 'react'
import { StateGameContext, StatePlayerContext, CorpsContext, ModalsContext, UserContext, StateBoardContext, ActionsContext } from '../../../game'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getLogConvertedForDB, getThinerStatePlayerForActive } from '../../../../utils/dataConversion'
import { getPositionInModalCards, getCards, getCardsWithDecreasedCost } from '../../../../utils/cards'
import BtnSelect from '../buttons/BtnSelect'
import { LOG_TYPES, funcUpdateLastLogItemAfter } from '../../../../data/log'
import DecreaseCostDraft from './modalsComponents/decreaseCost/DecreaseCostDraft'
import { SoundContext } from '../../../../App'
import { updateGameData } from '../../../../api/activeGame'
import { COMMUNICATION, CONFIRMATION_TEXT, MATCH_TYPES } from '../../../../data/app'
import { useActionDraft } from '../../../../hooks/useActionDraft'

const ModalDraft = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { sound } = useContext(SoundContext)
   const { stateGame, logItems, setSyncError, setLogItems, durationSeconds } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { initCorpsIds } = useContext(CorpsContext)
   const { type, user } = useContext(UserContext)
   const { actions } = useContext(ActionsContext)
   const cardsDraft = useMemo(
      () => (statePlayer.corporation ? getCardsWithDecreasedCost(getCards(statePlayer.cardsDrawIds), statePlayer) : []),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [statePlayer.cardsDrawIds]
   )

   const { handleClickBtnSelect, onYesFunc, handleChangeCorp } = useActionDraft()

   const textConfirmation = stateGame.generation === 1 ? CONFIRMATION_TEXT.DRAFT_GEN1 : actions.mln === 0 ? CONFIRMATION_TEXT.DRAFT_NOCARDS : CONFIRMATION_TEXT.DRAFT_CARDS
   const btnActionPosition = { bottom: '0.5%', left: '50%', transform: 'translateX(-50%)' }

   // Add draft cards to the cardsSeen
   useEffect(() => {
      // Update latest Log Item (PASS) with state of the game AFTER passed
      if (logItems[logItems.length - 1].type !== LOG_TYPES.GENERATION) funcUpdateLastLogItemAfter(setLogItems, statePlayer, stateGame)

      // Update active game on server only for generation other than 1
      if (stateGame.generation === 1 || !user || type === MATCH_TYPES.REPLAY) return

      if (!statePlayer.cardsSeen.includes(cardsDraft[0].id)) {
         const newCards = [...statePlayer.cardsSeen, ...cardsDraft]
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: newCards })
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
               setSyncError(COMMUNICATION.SYNC_ERROR)
            }
         })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className={`modal-select-cards ${(modals.cards || stateGame.phaseViewGameState) && 'display-none'}`}>
         {/* HEADER */}
         <ModalHeader text={stateGame.generation === 1 ? 'BUY UP TO 10 CARDS' : 'BUY UP TO 4 CARDS'} eachText="3" />
         {/* CHANGE CORPORATION BUTTON */}
         {stateGame.generation === 1 && (
            <div className="btn-change-corp pointer" onClick={handleChangeCorp}>
               CHANGE CORPORATION
            </div>
         )}
         {/* CARDS */}
         {cardsDraft.map((card, idx) => (
            <div
               key={idx}
               className={`card-container small ${actions.ids.includes(card.id) && 'selected'}`}
               style={getPositionInModalCards(cardsDraft.length, idx)}
               onClick={() => {
                  sound.btnCardsClick.play()
                  setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
               }}
            >
               <Card card={card} />
               <BtnSelect handleClick={() => handleClickBtnSelect(card.id)} cardId={card.id} />
            </div>
         ))}
         {/* ACTION BUTTON */}
         <BtnAction
            text="DONE"
            mln={actions.mln}
            textConfirmation={textConfirmation}
            onYesFunc={onYesFunc}
            disabled={actions.mln > statePlayer.resources.mln}
            position={btnActionPosition}
         />
         {/* DECREASE COST IF HELION */}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && actions.ids.length > 0 && <DecreaseCostDraft />}
      </div>
   )
}

export default ModalDraft
