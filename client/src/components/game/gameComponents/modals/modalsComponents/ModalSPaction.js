import { useContext } from 'react'
import { TILES, setAvailFieldsAdjacent } from '../../../../../data/board'
import { SP } from '../../../../../data/StandardProjects'
import { getAllResourcesForSP } from '../../../../../utils/misc'
import {
   StatePlayerContext,
   StateGameContext,
   StateBoardContext,
   ModalsContext,
} from '../../../Game'
import BtnAction from '../../buttons/BtnAction'

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
   const { setModals } = useContext(ModalsContext)
   const isAvailable = SPrequirementsMet()
   const styles =
      name === SP.GREENERY
         ? { transform: 'translateX(8%)' }
         : name === SP.CITY
         ? { transform: 'translateX(4%)' }
         : {}

   const btnSPActionPosition = { right: '8%', top: '50%', transform: 'translateY(-50%) scale(0.9)' }

   const handleClickBtn = () => {
      // No action if cost is higher than resources
      if (!isAvailable) return
      // If clicked SELL PATENT
      if (name === SP.SELL_PATENT) {
         setModals((prev) => ({ ...prev, sellCards: true, modalCards: statePlayer.cardsInHand }))
         return
      }
      // For Helion only: first click turns 'Decrease Cost with heat' minimodal,
      // second click turns confirmation modal
      if (statePlayer.canPayWithHeat && statePlayer.resources.heat > 0) {
         if (actionClicked === null || actionClicked !== name) {
            setActionClicked(name)
            changeSPcosts(undefined, name)
            return
         }
      }
      setModals((prev) => ({
         ...prev,
         modalConf: {
            text: textConfirmation,
            onYes: () => handleUseSP(name),
            onNo: () => setModals((prev) => ({ ...prev, confirmation: false })),
         },
         confirmation: true,
      }))
   }

   function SPrequirementsMet() {
      let v = true
      // If stateGame.phasePlaceTile
      if (stateGame.phasePlaceTile) v = false
      // If less resources than cost
      if (actionClicked === name) {
         if (statePlayer.resources.mln < cost) v = false
      } else {
         if (getAllResourcesForSP(statePlayer) < cost) v = false
      }
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
                  field.name !== 'PHOBOS SPACE HAVEN' &&
                  field.name !== 'GANYMEDE COLONY' &&
                  field.name !== 'NOCTIS CITY'
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
         {/* Icon */}
         <div className="sp-action-element icon">
            <div>
               <img style={styles} src={icon} alt={`icon_${name}`} />
            </div>
         </div>
         {/* Name */}
         <div className="sp-action-element name">{name}</div>
         {/* Button */}
         <BtnAction
            text="USE"
            mln={cost}
            onYesFunc={handleClickBtn}
            disabled={!isAvailable}
            position={btnSPActionPosition}
            onMouseDownFunc={() => setBtnClickedId(id)}
         />
      </div>
   )
}

export default ModalSPaction
