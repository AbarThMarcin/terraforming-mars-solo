// Modal for viewing and selecting cards when Mars University has been played
import { useContext, useEffect, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext, UserContext, StateBoardContext, CorpsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getLogConvertedForDB, getThinerStatePlayerForActive } from '../../../../utils/dataConversion'
import { getPositionInModalCards } from '../../../../utils/cards'
import Arrows from './modalsComponents/arrows/Arrows'
import { updateGameData } from '../../../../api/activeGame'
import { MATCH_TYPES } from '../../../../data/app'
import { useSubactionMarsUniversity } from '../../../../hooks/useSubactionMarsUniversity'

const ModalMarsUniversity = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame, logItems, setSyncError, durationSeconds } = useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, user } = useContext(UserContext)
   const { initCorpsIds } = useContext(CorpsContext)
   const { sound } = useContext(SoundContext)
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0', left: '42%', transform: 'translateX(-50%)' }
   const btnCancelPosition = { bottom: '0', left: '58%', transform: 'translateX(-50%)' }

   const { handleClickBtnSelect, onYesFunc, onCancelFunc, selectedCardId } = useSubactionMarsUniversity()

   // Update Server Data
   useEffect(() => {
      // Update active game on server only if user is logged
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
                           handleClickBtnSelect(card.id)
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
