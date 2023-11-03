import { useContext, useEffect } from 'react'
import { CORP_NAMES } from '../../../../../../../data/corpNames'
import { getCardsSorted } from '../../../../../../../utils/cards'
import { ActionsContext, ModalsContext, StatePlayerContext } from '../../../../../../game'
import DecreaseCostAction from '../../../modalsComponents/decreaseCost/DecreaseCostAction'
import ModalOtherDataActionsItem from './ModalOtherDataActionsItem'
import { INIT_ACTIONS } from '../../../../../../../initStates/initActions'

const ModalOtherDataActions = ({ setCardSnap }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)
   const { actions, setActions } = useContext(ActionsContext)

   useEffect(() => {
      setActions(INIT_ACTIONS)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <>
         <div className="modal-other-data center">
            {statePlayer.corporation.name === CORP_NAMES.UNMI && (
               <ModalOtherDataActionsItem item={statePlayer.corporation} setCardSnap={setCardSnap} />
            )}
            {getCardsSorted(modals.modalOther.data, '4a-played').map((item, idx) => (
               <ModalOtherDataActionsItem key={idx} item={item} setCardSnap={setCardSnap} />
            ))}
         </div>
         {/* CARD DECREASE COST SECTION */}
         {((statePlayer.resources.titan > 0 && actions.id === 12) ||
            (statePlayer.resources.steel > 0 && actions.id === 187) ||
            (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && actions.id)) && (
            <DecreaseCostAction />
         )}
      </>
   )
}

export default ModalOtherDataActions
