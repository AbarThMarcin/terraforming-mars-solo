// Modal for viewing and selecting cards when Business Contacts OR Invention Contest has been played
import { useContext, useEffect, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, StateBoardContext, UserContext, CorpsContext, ActionsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getLogConvertedForDB, getThinerStatePlayerForActive } from '../../../../utils/dataConversion'
import { getCards, getPositionInModalCards, getCardsWithDecreasedCost } from '../../../../utils/cards'
import Arrows from './modalsComponents/arrows/Arrows'
import { updateGameData } from '../../../../api/activeGame'
import { MATCH_TYPES } from '../../../../data/app'
import { useSubactionBusinessContacts } from '../../../../hooks/useSubactionBusinessContacts'
import { replayData } from '../../../../data/replay'

const ModalBusinessContacts = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { stateGame, logItems, setSyncError, durationSeconds } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, user } = useContext(UserContext)
   const { initCorpsIds } = useContext(CorpsContext)
   const { actions } = useContext(ActionsContext)
   const { sound } = useContext(SoundContext)
   const [page, setPage] = useState(1)
   const cardsSeen = getCards(type === MATCH_TYPES.REPLAY ? replayData.modalBusCont.cards : modals.modalBusCont.cards)
   const selectCount = type === MATCH_TYPES.REPLAY ? replayData.modalBusCont.selectCount : modals.modalBusCont.selectCount

   const btnActionPosition = { bottom: '0', left: '50%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const { onYesFunc, handleClickBtnSelect } = useSubactionBusinessContacts()

   // Add cards to the cardsSeen
   useEffect(() => {
      if (!statePlayer.cardsSeen.includes(cardsSeen[0].id)) {
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_SEEN, payload: [...statePlayer.cardsSeen, ...cardsSeen] })
      }

      // Update active game on server only if user is logged and its not replay
      if (!user || type === MATCH_TYPES.REPLAY) return
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

   return (
      <>
         {/* ARROWS */}
         {modals.modalCards.length > 10 && <Arrows page={page} setPage={setPage} pages={Math.ceil(modals.modalCards.length / 10)} />}
         <div className="modal-select-cards">
            <div className="modal-cards-box full-size" style={{ left: getBoxPosition() }}>
               {/* CARDS */}
               {getCardsWithDecreasedCost(cardsSeen, statePlayer).map((card, idx) => (
                  <div
                     key={idx}
                     className={`card-container small ${actions.ids.includes(card.id) && 'selected'}`}
                     style={getPositionInModalCards(cardsSeen.length, idx)}
                     onClick={() => {
                        if (stateGame.replayActionId) return
                        sound.btnCardsClick.play()
                        setModals((prev) => ({ ...prev, modalCard: card, cardViewOnly: true }))
                     }}
                  >
                     {/* CARD */}
                     <Card card={card} />
                     {/* SELECT BUTTON */}
                     <div
                        className={`pointer ${actions.ids.includes(card.id) ? 'btn-selected' : 'btn-select'}`}
                        onClick={(e) => {
                           e.stopPropagation()
                           if (!stateGame.replayActionId) handleClickBtnSelect(card.id)
                        }}
                     >
                        {actions.ids.includes(card.id) ? 'SELECTED' : 'SELECT'}
                     </div>
                  </div>
               ))}
            </div>
            {/* HEADER */}
            <ModalHeader text="SELECT CARD" />
            {/* ACTION BUTTON */}
            <BtnAction text="DONE" onYesFunc={onYesFunc} disabled={actions.ids.length !== selectCount} position={btnActionPosition} />
         </div>
      </>
   )
}

export default ModalBusinessContacts
