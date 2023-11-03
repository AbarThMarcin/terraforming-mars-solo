/* Used to view one card for use only */
import { useContext, useEffect } from 'react'
import { StatePlayerContext, ModalsContext, ActionsContext, StateGameContext } from '../../../../game'
import { hasTag } from '../../../../../utils/cards'
import { TAGS } from '../../../../../data/tags'
import Card from '../../card/Card'
import DecreaseCost from '../modalsComponents/decreaseCost/DecreaseCost'
import BtnAction from '../../buttons/BtnAction'
import { useActionCard } from '../../../../../hooks/useActionCard'

const ModalCardWithAction = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)
   const { actions } = useContext(ActionsContext)

   const btnActionPosition = { bottom: '0', left: '43.5%', transform: 'translate(-50%, 100%)' }

   const { onYesFunc, getInitResources } = useActionCard()

   useEffect(() => {
      getInitResources()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className="card-container big center" onClick={(e) => e.stopPropagation()}>
         {/* CARD */}
         {modals.modalCard ? <Card card={modals.modalCard} isBig={true} /> : <></>}
         {/* CARD BUTTON */}
         {!stateGame.phaseDraft && (
            <>
               <BtnAction
                  text="USE"
                  mln={actions.mln}
                  textConfirmation={`Do you want to play: ${modals.modalCard?.name}`}
                  onYesFunc={onYesFunc}
                  disabled={actions.disabled}
                  position={btnActionPosition}
               />
            </>
         )}
         {/* CARD DECREASE COST SECTION */}
         {((statePlayer.resources.steel > 0 && hasTag(modals.modalCard, TAGS.BUILDING)) ||
            (statePlayer.resources.titan > 0 && hasTag(modals.modalCard, TAGS.SPACE)) ||
            (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat)) &&
            modals.cardWithAction &&
            !stateGame.phaseDraft && <DecreaseCost />}
      </div>
   )
}

export default ModalCardWithAction
