/* Used to show window with cards to sell */
import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, ModalsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnAction from '../buttons/BtnAction'
import Card from '../card/Card'
import { getPositionInModalCards } from '../../../../utils/cards'
import { SP } from '../../../../data/StandardProjects'
import { ANIMATIONS } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import Arrows from './modalsComponents/arrows/Arrows'
import BtnSelect from '../buttons/BtnSelect'
import { LOG_ICONS, LOG_TYPES, funcCreateLogItem, funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../../../../data/log/log'

const ModalSellCards = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performSubActions, setLogItems, setItemsExpanded } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)
   const [mlnBack, setMlnBack] = useState(0)
   const [selectedCardsIds, setSelectedCardsIds] = useState([])
   const textConfirmation = 'Are you sure you want to sell these project cards?'
   const [page, setPage] = useState(1)

   const btnActionPosition = { bottom: '0.5%', left: '42%', transform: 'translateX(-50%)' }
   const btnCancelPosition = { bottom: '0.5%', left: '58%', transform: 'translateX(-50%)' }

   const getBoxPosition = () => {
      return `${(1 - page) * 100}%`
   }

   const onYesFunc = () => {
      // Before doing anything, save StatePlayer, StateGame and StateBoard to the log
      funcCreateLogItem(setLogItems, statePlayer, stateGame, { type: LOG_TYPES.SP_ACTION, title: SP.SELL_PATENT, titleIcon: LOG_ICONS.SELL_PATENT }, setItemsExpanded)
      // Also save action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `SPsellPatent[${selectedCardsIds.join(', ')}]`)

      let subActions = []
      // Dismount confirmation, sellCards and standardProjects modals
      setModals((prev) => ({
         ...prev,
         confirmation: false,
         sellCards: false,
         standardProjects: false,
         cardPlayed: false,
      }))
      // Add removal of selected cards to the subActions
      subActions.push({
         name: ANIMATIONS.CARD_OUT,
         type: RESOURCES.CARD,
         value: mlnBack,
         func: () => {
            dispatchPlayer({
               type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
               payload: statePlayer.cardsInHand.filter((c) => !selectedCardsIds.includes(c.id)),
            })
            funcSetLogItemsSingleActions(mlnBack === 1 ? 'Sold 1 card' : `Sold ${mlnBack} cards`, RESOURCES.CARD, -mlnBack, setLogItems)
         },
      })
      // Add mln addition to the subAction
      subActions.push({
         name: ANIMATIONS.RESOURCES_IN,
         type: RESOURCES.MLN,
         value: mlnBack,
         func: () => {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: mlnBack })
            funcSetLogItemsSingleActions(`Received ${mlnBack} MC`, RESOURCES.MLN, mlnBack, setLogItems)
         },
      })
      // Perform subActions
      performSubActions(subActions)
   }

   const handleClickBtnSelect = (card) => {
      if (!selectedCardsIds.includes(card.id)) {
         setMlnBack((v) => v + 1)
         setSelectedCardsIds((cardsIds) => [...cardsIds, card.id])
      } else {
         setMlnBack((v) => v - 1)
         setSelectedCardsIds((cardsIds) => cardsIds.filter((id) => id !== card.id))
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
                     className={`card-container small ${selectedCardsIds.includes(card.id) && 'selected'}`}
                     style={getPositionInModalCards(statePlayer.cardsInHand.length, idx)}
                     onClick={() => {
                        sound.btnCardsClick.play()
                        setModals({ ...modals, modalCard: card, cardViewOnly: true })
                     }}
                  >
                     <Card card={card} />
                     <BtnSelect initBtnText="SELECT" handleClick={() => handleClickBtnSelect(card)} />
                  </div>
               ))}
            </div>
            {/* HEADER */}
            <ModalHeader text={SP.SELL_PATENT} eachText="1" />
            {/* ACTION BUTTON */}
            <BtnAction text="SELL" mln={mlnBack} textConfirmation={textConfirmation} onYesFunc={onYesFunc} disabled={mlnBack === 0} position={btnActionPosition} />
            {/* CANCEL BUTTON */}
            <BtnAction text="CANCEL" position={btnCancelPosition} />
         </div>
      </>
   )
}

export default ModalSellCards
