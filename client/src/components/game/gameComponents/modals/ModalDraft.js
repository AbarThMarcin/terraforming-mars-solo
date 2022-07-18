/* Used to show window with cards to buy in the draft phase,
window with cards to sell and window with cards to select due
to any effect/action */
import { useContext, useMemo, useState } from 'react'
import { StateGameContext, StatePlayerContext, CardsContext, ModalsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../stateActions/actionsGame'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import ModalHeader from './modalsComponents/ModalHeader'
import BtnChangeCorp from '../buttons/BtnChangeCorp'
import BtnAction from '../buttons/BtnAction'
import Card from '../Card'
import { getCards, getNewCardsDrawIds, getPosition, modifiedCards, sorted, withTimeAdded } from '../../../../utils/misc'
import { IMM_EFFECTS } from '../../../../data/immEffects/immEffects'
import { EFFECTS } from '../../../../data/effects/effectIcons'
import { ANIMATIONS } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import { CORP_NAMES } from '../../../../data/corpNames'
import BtnSelect from '../buttons/BtnSelect'
import { LOG_TYPES } from '../../../../data/log'
import logIconTharsis from '../../../../assets/images/other/forcedActionTharsis.svg'
import logIconInventrix from '../../../../assets/images/other/forcedActionInventrix.svg'
import DecreaseCostDraft from './modalsComponents/DecreaseCostDraft'
import { CARDS } from '../../../../data/cards'

const ModalDraft = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const {
      stateGame,
      dispatchGame,
      performSubActions,
      getImmEffects,
      getEffect,
      sortId,
      requirementsMet,
      setSaveToServerTrigger,
   } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { cardsDeckIds, cardsDrawIds, setCardsDeckIds, setCardsDrawIds } = useContext(CardsContext)
   const [toBuyMln, setToBuyMln] = useState(0)
   const [toBuyHeat, setToBuyHeat] = useState(0)
   const [selectedCardsIds, setSelectedCardsIds] = useState([])
   const cardsDraft = useMemo(
      () => modifiedCards(getCards(CARDS, cardsDrawIds), statePlayer),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [cardsDrawIds]
   )
   const textConfirmation =
      stateGame.generation === 1
         ? 'Are you sure you want to choose this corporation and these project cards?'
         : toBuyMln === 0
         ? "Are you sure you don't want to buy any cards?"
         : 'Are you sure you want to buy these project cards?'

   const btnActionPosition = { bottom: '0.5%', left: '50%', transform: 'translateX(-50%)' }

   const onYesFunc = async () => {
      // Decrease corporation resources
      if (toBuyMln > 0) dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln })
      if (toBuyHeat > 0)
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
      // Add selected cards to the hand
      dispatchPlayer({
         type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
         payload: sorted(
            [
               ...statePlayer.cardsInHand,
               ...withTimeAdded(cardsDraft.filter((card) => selectedCardsIds.includes(card.id))),
            ],
            sortId[0],
            requirementsMet
         ),
      })
      // Set phase draft = FALSE
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_DRAFT, payload: false })
      // Dismount draft modal
      setModals({ ...modals, confirmation: false, draft: false })
      // Update Server Data
      setSaveToServerTrigger((prev) => !prev)
      // Perform forced action for Tharsis or Inventrix in GEN 1
      if (stateGame.generation === 1) {
         let actions = []
         if (statePlayer.corporation.name === CORP_NAMES.THARSIS_REPUBLIC) {
            actions = [
               ...getImmEffects(IMM_EFFECTS.CITY),
               ...getEffect(EFFECTS.EFFECT_THARSIS_CITY),
               ...getEffect(EFFECTS.EFFECT_THARSIS_CITY_ONPLANET),
            ]
            dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
            performSubActions(
               actions,
               {
                  type: LOG_TYPES.FORCED_ACTION,
                  text: CORP_NAMES.THARSIS_REPUBLIC,
               },
               logIconTharsis
            )
         }
         if (statePlayer.corporation.name === CORP_NAMES.INVENTRIX) {
            // Get Random Cards Ids
            let newCardsDrawIds = await getNewCardsDrawIds(3, cardsDeckIds, setCardsDeckIds, setCardsDrawIds)
            performSubActions(
               [
                  {
                     name: ANIMATIONS.CARD_IN,
                     type: RESOURCES.CARD,
                     value: 3,
                     func: () => {
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                           payload: sorted(
                              [
                                 ...cardsDraft.filter((card) => selectedCardsIds.includes(card.id)),
                                 ...modifiedCards(getCards(CARDS, newCardsDrawIds), statePlayer),
                              ],
                              sortId[0],
                              requirementsMet
                           ),
                        })
                     },
                  },
               ],
               {
                  type: LOG_TYPES.FORCED_ACTION,
                  text: CORP_NAMES.INVENTRIX,
               },
               logIconInventrix
            )
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
      <div
         className={`modal-select-cards ${
            (modals.cards || stateGame.phaseViewGameState) && 'display-none'
         }`}
      >
         {/* HEADER */}
         <ModalHeader
            text={stateGame.generation === 1 ? 'BUY UP TO 10 CARDS' : 'BUY UP TO 4 CARDS'}
            eachText="3"
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
               className={`card-container small ${
                  selectedCardsIds.includes(card.id) && 'selected'
               }`}
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
            mln={toBuyMln}
            textConfirmation={textConfirmation}
            onYesFunc={onYesFunc}
            disabled={toBuyMln > statePlayer.resources.mln}
            position={btnActionPosition}
         />
         {/* DECREASE COST IF HELION */}
         {statePlayer.resources.heat > 0 &&
            statePlayer.canPayWithHeat &&
            selectedCardsIds.length > 0 && (
               <DecreaseCostDraft
                  toBuyMln={toBuyMln}
                  setToBuyMln={setToBuyMln}
                  toBuyHeat={toBuyHeat}
                  setToBuyHeat={setToBuyHeat}
               />
            )}
      </div>
   )
}

export default ModalDraft
