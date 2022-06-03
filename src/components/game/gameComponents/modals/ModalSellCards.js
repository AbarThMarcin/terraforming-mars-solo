/* Used to show window with cards to sell */
import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext } from '../../Game'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../Card'
import { getPosition } from '../../../../util/misc'
import { SP } from '../../../../data/StandardProjects'
import { ANIMATIONS } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import Arrows from './modalsComponents/Arrows'
import BtnSelect from '../buttons/BtnSelect'

const ModalSellCards = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const [mlnBack, setMlnBack] = useState(0)
   const [selectedCards, setSelectedCards] = useState([])
   const textConfirmation = 'Are you sure you want to sell these project cards?'
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0.5%', left: '42%', transform: 'translateX(-50%)' }
   const btnCancelPosition = { bottom: '0.5%', left: '58%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const onYesFunc = () => {
      let subActions = []
      // Dismount confirmation, sellCards and standardProjects modals
      setModals({ ...modals, confirmation: false, sellCards: false, standardProjects: false })
      // Add removal of selected cards to the subActions
      subActions.push({
         name: ANIMATIONS.CARD_OUT,
         type: RESOURCES.CARD,
         value: mlnBack,
         func: () =>
            dispatchPlayer({
               type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
               payload: statePlayer.cardsInHand.filter((c) => !selectedCards.includes(c)),
            }),
      })
      // Add mln addition to the subAction
      subActions.push({
         name: ANIMATIONS.RESOURCES_IN,
         type: RESOURCES.MLN,
         value: mlnBack,
         func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: mlnBack }),
      })
      // Perform subActions
      performSubActions(subActions)
   }

   const handleClickBtnSelect = (card) => {
      if (!selectedCards.includes(card)) {
         setMlnBack((v) => v + 1)
         setSelectedCards((cards) => [...cards, card])
      } else {
         setMlnBack((v) => v - 1)
         setSelectedCards((cards) => cards.filter((c) => c.id !== card.id))
      }
   }

   return (
      <div
         className={`modal-background ${
            (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
         }`}
      >
         {/* ARROWS */}
         {modals.modalCards.length > 10 && (
            <Arrows
               page={page}
               setPage={setPage}
               pages={Math.ceil(modals.modalCards.length / 10)}
            />
         )}
         <div className="modal-select-cards">
            <div className="modal-cards-box full-size" style={{ left: getBoxPosition() }}>
               {/* CARDS */}
               {statePlayer.cardsInHand.map((card, idx) => (
                  <div
                     key={idx}
                     className={`card-container small ${selectedCards.includes(card) && 'selected'}`}
                     style={getPosition(statePlayer.cardsInHand.length, idx)}
                     onClick={() => setModals({ ...modals, modalCard: card, cardViewOnly: true })}
                  >
                     <Card card={card} />
                     <BtnSelect
                        initBtnText="SELECT"
                        handleClick={() => handleClickBtnSelect(card)}
                     />
                  </div>
               ))}
            </div>
            {/* HEADER */}
            <ModalHeader text={SP.SELL_PATENT} eachText="1" />
            {/* ACTION BUTTON */}
            <BtnAction
               text="SELL"
               mln={mlnBack}
               textConfirmation={textConfirmation}
               onYesFunc={onYesFunc}
               disabled={mlnBack === 0}
               position={btnActionPosition}
            />
            {/* CANCEL BUTTON */}
            <BtnAction text="CANCEL" position={btnCancelPosition} />
         </div>
      </div>
   )
}

export default ModalSellCards
