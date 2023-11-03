/* Used to show window with cards to sell */
import { useContext, useState } from 'react'
import { StatePlayerContext, ModalsContext, ActionsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getPositionInModalCards } from '../../../../utils/cards'
import { SP } from '../../../../data/StandardProjects'
import Arrows from './modalsComponents/arrows/Arrows'
import BtnSelect from '../buttons/BtnSelect'
import { CONFIRMATION_TEXT } from '../../../../data/app'
import { useSubactionSellPatents } from '../../../../hooks/useSubactionSellPatents'

const ModalSellCards = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const { actions } = useContext(ActionsContext)
   const textConfirmation = CONFIRMATION_TEXT.SELLCARDS
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0.5%', left: '42%', transform: 'translateX(-50%)' }
   const btnCancelPosition = { bottom: '0.5%', left: '58%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const { handleClickBtnSelect, onYesFunc } = useSubactionSellPatents()

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
                     className={`card-container small ${actions.ids.includes(card.id) && 'selected'}`}
                     style={getPositionInModalCards(statePlayer.cardsInHand.length, idx)}
                     onClick={() => {
                        sound.btnCardsClick.play()
                        setModals({ ...modals, modalCard: card, cardViewOnly: true })
                     }}
                  >
                     <Card card={card} />
                     <BtnSelect handleClick={() => handleClickBtnSelect(card.id)} cardId={card.id} />
                  </div>
               ))}
            </div>
            {/* HEADER */}
            <ModalHeader text={SP.SELL_PATENT} eachText="1" />
            {/* ACTION BUTTON */}
            <BtnAction text="SELL" mln={actions.mln} textConfirmation={textConfirmation} onYesFunc={onYesFunc} disabled={actions.mln === 0} position={btnActionPosition} />
            {/* CANCEL BUTTON */}
            <BtnAction text="CANCEL" position={btnCancelPosition} />
         </div>
      </>
   )
}

export default ModalSellCards
