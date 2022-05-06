import { useContext } from 'react'
import { TILES, setAvailFieldsAdjacent } from '../../../../../data/board'
import { SP } from '../../../../../data/StandardProjects'
import {
   StatePlayerContext,
   StateGameContext,
   StateBoardContext,
   ModalsContext,
} from '../../../Game'

const ModalSPaction = ({
   id,
   icon,
   name,
   cost,
   textConfirmation,
   actionClicked,
   setActionClicked,
   changeSPcosts,
   handleUseSP,
   setBtnClickedId,
}) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const isAvailable = SPrequirementsMet()

   const handleClickBtn = () => {
      // No action if cost is higher than resources
      if (!isAvailable) return
      // If clicked SELL PATENT
      if (name === SP.SELL_PATENT) {
         setModals({ ...modals, sellCards: true })
         return
      }
      // For Helion only: first click turns 'Decrease Cost with heat' minimodal,
      // second click turns confirmation modal
      if (statePlayer.canPayWithHeat) {
         if (actionClicked === null || actionClicked !== name) {
            setActionClicked(name)
            changeSPcosts(undefined, name)
            return
         }
      }
      setModals({
         ...modals,
         modalConfData: {
            text: textConfirmation,
            onYes: () => handleUseSP(name),
            onNo: () => setModals({ ...modals, confirmation: false }),
         },
         confirmation: true,
      })
   }

   function SPrequirementsMet() {
      let v = true
      // If stateGame.phasePlaceTile
      if (stateGame.phasePlaceTile) v = false
      // If less resources than cost
      if (statePlayer.resources.mln < cost) v = false
      // Other requirements
      let availFields = []
      switch (name) {
         case SP.SELL_PATENT:
            if (statePlayer.cardsInHand.length === 0) v = false
            break
         case SP.POWER_PLANT:
            // No requirements
            break
         case SP.ASTEROID:
            if (stateGame.globalParameters.temperature === 8) v = false
            break
         case SP.AQUIFER:
            if (stateGame.globalParameters.oceans === 9) v = false
            break
         case SP.GREENERY:
            availFields = stateBoard.filter(
               (field) =>
                  !field.oceanOnly &&
                  !field.object &&
                  field.name !== 'NOCTIC CITY' &&
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY'
            )
            if (availFields.length === 0) v = false
            break
         case SP.CITY:
            const cityTiles = stateBoard.filter(
               (field) =>
                  field.object === TILES.CITY ||
                  field.object === TILES.CITY_NEUTRAL ||
                  field.object === TILES.SPECIAL_CITY_CAPITAL
            )
            availFields = setAvailFieldsAdjacent(stateBoard, cityTiles, false).filter(
               (availField) => availField.available === true
            )
            if (availFields.length === 0) v = false
            break
         default:
            break
      }
      return v
   }

   return (
      <div className={`sp-action ${!isAvailable && 'disabled'}`}>
         <div className="sp-action-element sp-action-icon">{icon.url}</div>
         <div className="sp-action-element sp-action-name">{name}</div>
         <div className="sp-action-element sp-action-cost">{cost}</div>
         <div
            className={`sp-action-element sp-action-btn ${isAvailable && 'pointer'}`}
            onClick={handleClickBtn}
            onMouseDown={() => setBtnClickedId(id)}
         >
            BTN
         </div>
      </div>
   )
}

export default ModalSPaction
