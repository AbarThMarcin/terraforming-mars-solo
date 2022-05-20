/* Used to show window with cards to buy in the draft phase,
window with cards to sell and window with cards to select due
to any effect/action */
import { useContext, useState } from 'react'
import { StateGameContext, StatePlayerContext, CardsContext, ModalsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnChangeCorp from '../buttons/BtnChangeCorp'
import BtnAction from '../buttons/BtnAction'
import Card from '../Card'
import { getPosition, modifiedCards } from '../../../../util/misc'
import { IMM_EFFECTS } from '../../../../data/immEffects/immEffects'
import { EFFECTS } from '../../../../data/effects'
import { ANIMATIONS } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import { CORP_NAMES } from '../../../../data/corpNames'
import BtnSelect from '../buttons/BtnSelect'

const ModalDraft = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, getImmEffects, getEffect } =
      useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { cards, setCards } = useContext(CardsContext)
   const [buyCost, setBuyCost] = useState(0)
   const [selectedCards, setSelectedCards] = useState([])
   const cardsDraft =
      stateGame.generation === 1
         ? modifiedCards(cards.slice(0, 10), statePlayer)
         : modifiedCards(cards.slice(0, 4), statePlayer)
   const textConfirmation =
      stateGame.generation === 1
         ? 'Are you sure you want to choose this corporation and these project cards?'
         : buyCost === 0
         ? "Are you sure you don't want to buy any cards?"
         : 'Are you sure you want to buy these project cards?'

   const btnActionPosition = { bottom: '0', left: '50%', transform: 'translateX(-50%)' }

   const onYesFunc = () => {
      // Decrease corporation mln resources
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -buyCost })
      // Add selected cards to the hand
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: [...statePlayer.cardsInHand, ...selectedCards],
      })
      // Remove all 4 (10 if gen = 1) cards from the CardsContext
      let newCards = stateGame.generation === 1 ? cards.slice(10) : cards.slice(4)
      setCards(newCards)
      // Set phase draft = FALSE
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Dismount draft modal
      setModals({ ...modals, confirmation: false, draft: false })
      // Perform starting Tharsis / Inventrix actions in GEN 1
      if (stateGame.generation === 1) {
         let actions = []
         if (statePlayer.corporation.name === CORP_NAMES.THARSIS_REPUBLIC) {
            actions = [
               ...getImmEffects(IMM_EFFECTS.CITY),
               ...getEffect(EFFECTS.EFFECT_THARSIS_CITY),
               ...getEffect(EFFECTS.EFFECT_THARSIS_CITY_ONPLANET),
            ]
            dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
            performSubActions(actions)
         }
         if (statePlayer.corporation.name === CORP_NAMES.INVENTRIX)
            performSubActions([
               {
                  name: ANIMATIONS.CARD_IN,
                  type: RESOURCES.CARD,
                  value: 3,
                  func: () => {
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: [
                           ...selectedCards,
                           ...modifiedCards(newCards.slice(0, 3), statePlayer),
                        ],
                     })
                     setCards(newCards.slice(3))
                  },
               },
            ])
      }
   }

   const handleClickBtnSelect = (card) => {
      if (selectedCards.filter((selCard) => selCard.id === card.id).length === 0) {
         setBuyCost((v) => v + 3)
         setSelectedCards((cards) => [...cards, card])
      } else {
         setBuyCost((v) => v - 3)
         setSelectedCards((cards) => cards.filter((c) => c.id !== card.id))
      }
   }

   return (
      <div
         className={`modal-background ${
            (modals.confirmation || stateGame.phaseViewGameState) && 'display-none'
         }`}
      >
         <div
            className={`modal-select-cards ${
               (modals.cards || stateGame.phaseViewGameState) && 'display-none'
            }`}
         >
            {/* HEADER */}
            <ModalHeader
               text={stateGame.generation === 1 ? 'BUY UP TO 10 CARDS' : 'BUY UP TO 4 CARDS'}
               eachText="3 each"
            />
            {/* CHANGE CORPORATION BUTTON */}
            {stateGame.generation === 1 && (
               <BtnChangeCorp
                  dispatchGame={dispatchGame}
                  statePlayer={statePlayer}
                  dispatchPlayer={dispatchPlayer}
               />
            )}
            {/* CARDS */}
            {cardsDraft.map((card, idx) => (
               <div
                  key={idx}
                  className={`card-container ${selectedCards.includes(card) && 'selected'}`}
                  style={getPosition(cardsDraft.length, idx)}
                  onClick={() => setModals({ ...modals, modalCard: card, cardViewOnly: true })}
               >
                  <Card card={card} />
                  <BtnSelect initBtnText="SELECT" handleClick={() => handleClickBtnSelect(card)} />
               </div>
            ))}
            {/* ACTION BUTTON */}
            <BtnAction
               text="DONE"
               mln={buyCost}
               textConfirmation={textConfirmation}
               onYesFunc={onYesFunc}
               disabled={buyCost > statePlayer.resources.mln}
               position={btnActionPosition}
            />
         </div>
      </div>
   )
}

export default ModalDraft
