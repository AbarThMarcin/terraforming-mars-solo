import { useContext, useState } from 'react'
import { getActionCost } from '../../../../../../../util/misc'
import { ModalsContext, StatePlayerContext } from '../../../../../Game'
import CardDecreaseCost from '../../../modalsComponents/CardDecreaseCost'
import ModalOtherDataActionsItem from './ModalOtherDataActionsItem'

const ModalOtherDataActions = ({ setCardSnap }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)
   const [actionClicked, setActionClicked] = useState(null)
   const [toBuyMln, setToBuyMln] = useState(0)
   const [toBuySteel, setToBuySteel] = useState(0)
   const [toBuyTitan, setToBuyTitan] = useState(0)
   const [toBuyHeat, setToBuyHeat] = useState(0)

   const changeCosts = (cardId) => {
      let resMln = 0
      let resSteel = 0
      let resTitan = 0
      let resHeat = 0
      let diff
      let cost = getActionCost(cardId)

      if (statePlayer.resources.titan > 0 && cardId === 12) {
         diff = cost - statePlayer.resources.mln
         if (diff > 0)
            resTitan = Math.min(
               Math.ceil(diff / statePlayer.valueTitan),
               statePlayer.resources.titan
            )
      }
      if (statePlayer.resources.steel > 0 && cardId === 187) {
         diff = cost - statePlayer.resources.mln - resTitan * statePlayer.valueTitan
         if (diff > 0)
            resSteel = Math.min(
               Math.ceil(diff / statePlayer.valueSteel),
               statePlayer.resources.steel
            )
      }
      diff = cost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan
      resMln = Math.min(diff, statePlayer.resources.mln)
      resHeat = Math.max(
         0,
         cost - resSteel * statePlayer.valueSteel - resTitan * statePlayer.valueTitan - resMln
      )
      setToBuyMln(resMln)
      setToBuySteel(resSteel)
      setToBuyTitan(resTitan)
      setToBuyHeat(resHeat)

      return [resMln, resSteel, resTitan, resHeat]
   }

   return (
      <>
         <div className="modal-other-data center">
            {statePlayer.corporation.name === 'UNMI' && (
               <ModalOtherDataActionsItem
                  item={statePlayer.corporation}
                  setCardSnap={setCardSnap}
               />
            )}
            {modals.modalOther.data.map((item, idx) => (
               <ModalOtherDataActionsItem
                  key={idx}
                  item={item}
                  setCardSnap={setCardSnap}
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  toBuyMln={toBuyMln}
                  toBuySteel={toBuySteel}
                  toBuyTitan={toBuyTitan}
                  toBuyHeat={toBuyHeat}
                  changeCosts={changeCosts}
               />
            ))}
         </div>
         {/* CARD DECREASE COST SECTION */}
         {((statePlayer.resources.titan > 0 && actionClicked === 12) ||
            (statePlayer.resources.steel > 0 && actionClicked === 187) ||
            (statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && actionClicked)) && (
            <CardDecreaseCost
               toBuyMln={toBuyMln}
               setToBuyMln={setToBuyMln}
               toBuySteel={toBuySteel}
               setToBuySteel={setToBuySteel}
               toBuyTitan={toBuyTitan}
               setToBuyTitan={setToBuyTitan}
               toBuyHeat={toBuyHeat}
               setToBuyHeat={setToBuyHeat}
               actionClicked={actionClicked}
            />
         )}
      </>
   )
}

export default ModalOtherDataActions
