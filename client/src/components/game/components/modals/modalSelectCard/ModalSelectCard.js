/* Used to modal ONLY for Search For Life (5), Inventors' Guild (6) or Business Network (110). Shows a card and user selects it or not (unless its microbe and Search for life, then selection cannot be made - it's automatically selected) */
import { useContext, useEffect } from 'react'
import { ACTIONS_PLAYER } from '../../../../../stateActions/actionsPlayer'
import { getCardsWithDecreasedCost } from '../../../../../utils/cards'
import { StatePlayerContext, ModalsContext, ActionsContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import BtnSelect from '../../buttons/BtnSelect'
import Card from '../../card/Card'
import DecreaseCostSelCard from '../modalsComponents/decreaseCost/DecreaseCostSelCard'
import { useSubactionSelectCard } from '../../../../../hooks/useSubactionSelectCard'

const ModalSelectCard = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)
   const { actions } = useContext(ActionsContext)
   const isSelected = actions.ids.includes(modals.modalSelectCard.cardIdAction)

   const btnActionConfirmPosition = {
      bottom: '-20%',
      left: '50%',
      transform: 'translate(-50%, 100%) scale(1.2)',
   }

   // Add card to the cardsSeen
   useEffect(() => {
      if (!statePlayer.cardsSeen.includes(modals.modalSelectCard.card.id)) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_SEEN,
            payload: [...statePlayer.cardsSeen, modals.modalSelectCard.card],
         })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const { handleClickSelect, handleClickConfirmBtn } = useSubactionSelectCard()

   return (
      <div className="card-container big center">
         {/* CARD */}
         <Card card={getCardsWithDecreasedCost([modals.modalSelectCard.card], statePlayer)[0]} isBig={true} />
         {/* CARD BUTTON */}
         <BtnSelect handleClick={handleClickSelect} cardId={modals.modalSelectCard.card.id} sourceCardId={modals.modalSelectCard.cardIdAction} />
         {/* CONFIRM BUTTON */}
         <BtnAction text="CONFIRM" onYesFunc={handleClickConfirmBtn} position={btnActionConfirmPosition} />
         {/* CARD DECREASE COST SECTION */}
         {statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && isSelected && (
            <DecreaseCostSelCard />
         )}
      </div>
   )
}

export default ModalSelectCard
