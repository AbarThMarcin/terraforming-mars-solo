/* Used to show ONE card with selection */
import { useContext, useState } from 'react'
import { ANIMATIONS } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import { TAGS } from '../../../../data/tags'
import { ACTIONS_PLAYER } from '../../../../initStates/actionsPlayer'
import { hasTag, modifiedCards, withTimeAdded } from '../../../../util/misc'
import { StatePlayerContext, StateGameContext, ModalsContext, CardsContext } from '../../Game'
import BtnAction from '../buttons/BtnAction'
import BtnSelect from '../buttons/BtnSelect'
import Card from '../Card'
import DecreaseCostSelCard from './modalsComponents/DecreaseCostSelCard'

const ModalSelectCard = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { performSubActions } = useContext(StateGameContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { cards, setCards } = useContext(CardsContext)
   const [selected, setSelected] = useState(getInitSelected)
   const [toBuyMln, setToBuyMln] = useState(0)
   const [toBuyHeat, setToBuyHeat] = useState(0)
   const resources = getResources()

   const btnActionConfirmPosition = {
      bottom: '-20%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   const handleClickConfirmBtn = () => {
      // Close selectCard modal
      setModals((prevModals) => ({ ...prevModals, selectCard: false }))
      // If not selected, do nothing, else do search for life or buy a card
      if (!selected) {
         performSubActions([])
      } else {
         let subActions = []
         if (modals.modalSelectCard.cardIdAction === 5) {
            // Search For Life
            subActions.push({
               name: ANIMATIONS.RESOURCES_IN,
               type: RESOURCES.MICROBE,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.ADD_BIO_RES,
                     payload: {
                        cardId: modals.modalSelectCard.cardIdAction,
                        resource: RESOURCES.MICROBE,
                        amount: 1,
                     },
                  })
                  setCards(cards.slice(1))
               },
            })
         } else {
            // Inventors' Guild / Business Network
            if (toBuyMln > 0)
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.MLN,
                  value: toBuyMln,
                  func: () =>
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.CHANGE_RES_MLN,
                        payload: -toBuyMln,
                     }),
               })
            if (toBuyHeat > 0)
               subActions.push({
                  name: ANIMATIONS.RESOURCES_OUT,
                  type: RESOURCES.HEAT,
                  value: toBuyHeat,
                  func: () =>
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.CHANGE_RES_HEAT,
                        payload: -toBuyHeat,
                     }),
               })
            subActions.push({
               name: ANIMATIONS.CARD_IN,
               type: RESOURCES.CARD,
               value: 1,
               func: () => {
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                     payload: [
                        ...statePlayer.cardsInHand,
                        ...modifiedCards(withTimeAdded(cards.slice(0, 1)), statePlayer),
                     ],
                  })
                  setCards(cards.slice(1))
               },
            })
         }
         performSubActions(subActions)
      }
   }

   function getResources() {
      let res = statePlayer.resources.mln
      if (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat)
         res += statePlayer.resources.heat
      return res
   }

   const handleClickSelect = () => {
      if (modals.modalSelectCard.cardIdAction === 5) return
      if (resources < 3) return
      if (selected) {
         setToBuyMln(0)
         setToBuyHeat(0)
         setSelected((prev) => !prev)
      } else {
         let resMln = Math.min(statePlayer.resources.mln, 3)
         let resHeat = Math.min(3 - resMln, statePlayer.resources.heat)
         setToBuyHeat(resHeat)
         setToBuyMln(resMln)
         setSelected((prev) => !prev)
      }
   }

   function getInitSelected() {
      if (modals.modalSelectCard.cardIdAction === 5) {
         return hasTag(modals.modalSelectCard.card, TAGS.MICROBE)
      } else {
         return false
      }
   }

   return (
      <div className="card-container big center">
         {/* CARD */}
         <Card card={modals.modalSelectCard.card} isBig={true} />
         {/* CARD BUTTON */}
         <BtnSelect
            initBtnText={selected ? 'SELECTED' : 'SELECT'}
            handleClick={handleClickSelect}
            sourceCardId={modals.modalSelectCard.cardIdAction}
            resources={resources}
         />
         {/* CONFIRM BUTTON */}
         <BtnAction
            text="CONFIRM"
            onYesFunc={handleClickConfirmBtn}
            position={btnActionConfirmPosition}
         />
         {/* CARD DECREASE COST SECTION */}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && selected && (
            <DecreaseCostSelCard
               toBuyMln={toBuyMln}
               setToBuyMln={setToBuyMln}
               toBuyHeat={toBuyHeat}
               setToBuyHeat={setToBuyHeat}
            />
         )}
      </div>
   )
}

export default ModalSelectCard