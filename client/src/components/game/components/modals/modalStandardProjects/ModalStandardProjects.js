/* Used to view standard projects */
import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../game'
import ModalSPaction from '../modalsComponents/ModalSPaction'
import DecreaseCostSP from '../modalsComponents/decreaseCost/DecreaseCostSP'
import { SP } from '../../../../../data/StandardProjects'
import BtnClose from '../../buttons/BtnClose'
import iconSellPatent from '../../../../../assets/images/resources/res_card.png'
import iconPowerPlant from '../../../../../assets/images/other/SPpowerPlant.svg'
import iconAsteroid from '../../../../../assets/images/other/tempIcon.svg'
import iconAquifer from '../../../../../assets/images/tiles/tile_ocean.svg'
import iconGreenery from '../../../../../assets/images/other/SPgreenery.svg'
import iconCity from '../../../../../assets/images/other/SPcity.svg'
import { CONFIRMATION_TEXT } from '../../../../../data/app'
import { useActionSP } from '../../../../../hooks/useActionSP'

const ModalStandardProjects = () => {
   const { setModals } = useContext(ModalsContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const [toBuyHeat, setToBuyHeat] = useState(0)
   const [toBuyMln, setToBuyMln] = useState(initToBuyMln())
   const [btnClickedId, setBtnClickedId] = useState(-1)
   const [actionClicked, setActionClicked] = useState(null)

   function initToBuyMln() {
      return [
         stateGame.SPCosts.sellPatent,
         stateGame.SPCosts.powerPlant.current,
         stateGame.SPCosts.asteroid,
         stateGame.SPCosts.aquifer,
         stateGame.SPCosts.greenery,
         stateGame.SPCosts.city,
      ]
   }

   const changeSPcosts = (operation, Sp) => {
      let resHeat = toBuyHeat
      let resMln = toBuyMln
      if (operation === 'increment') {
         resHeat++
      } else if (operation === 'decrement') {
         resHeat--
      }
      resMln = initToBuyMln()

      switch (Sp) {
         case SP.POWER_PLANT:
            resMln[1] = Math.max(stateGame.SPCosts.powerPlant.current - resHeat, 0)
            if (resHeat > stateGame.SPCosts.powerPlant.current) resHeat = stateGame.SPCosts.powerPlant.current
            break
         case SP.ASTEROID:
            resMln[2] = Math.max(stateGame.SPCosts.asteroid - resHeat, 0)
            if (resHeat > stateGame.SPCosts.asteroid) resHeat = stateGame.SPCosts.asteroid
            break
         case SP.AQUIFER:
            resMln[3] = Math.max(stateGame.SPCosts.aquifer - resHeat, 0)
            if (resHeat > stateGame.SPCosts.aquifer) resHeat = stateGame.SPCosts.aquifer
            break
         case SP.GREENERY:
            resMln[4] = Math.max(stateGame.SPCosts.greenery - resHeat, 0)
            if (resHeat > stateGame.SPCosts.greenery) resHeat = stateGame.SPCosts.greenery
            break
         case SP.CITY:
            resMln[5] = Math.max(stateGame.SPCosts.city - resHeat, 0)
            if (resHeat > stateGame.SPCosts.city) resHeat = stateGame.SPCosts.city
            break
         default:
            break
      }
      setToBuyHeat(resHeat)
      setToBuyMln(resMln)
   }

   const { onYesFunc } = useActionSP(btnClickedId, toBuyMln, toBuyHeat)

   return (
      <div className="modal-standard-projects-box center" onClick={(e) => e.stopPropagation()}>
         {/* HEADER */}
         <div className="header">STANDARD PROJECTS</div>
         {/* CLOSE BUTTON */}
         <BtnClose onCloseClick={() => setModals((prev) => ({ ...prev, standardProjects: false }))} />
         {/* ACTIONS */}
         <ModalSPaction id={0} icon={iconSellPatent} name={SP.SELL_PATENT} cost={toBuyMln[0]} textConfirmation="" onYesFunc={onYesFunc} setBtnClickedId={setBtnClickedId} />
         <ModalSPaction
            id={1}
            icon={iconPowerPlant}
            name={SP.POWER_PLANT}
            cost={toBuyMln[1]}
            textConfirmation={CONFIRMATION_TEXT.SP_POWERPLANT}
            actionClicked={actionClicked}
            setActionClicked={setActionClicked}
            changeSPcosts={changeSPcosts}
            onYesFunc={onYesFunc}
            setBtnClickedId={setBtnClickedId}
         />
         <ModalSPaction
            id={2}
            icon={iconAsteroid}
            name={SP.ASTEROID}
            cost={toBuyMln[2]}
            textConfirmation={CONFIRMATION_TEXT.SP_ASTEROID}
            actionClicked={actionClicked}
            setActionClicked={setActionClicked}
            changeSPcosts={changeSPcosts}
            onYesFunc={onYesFunc}
            setBtnClickedId={setBtnClickedId}
         />
         <ModalSPaction
            id={3}
            icon={iconAquifer}
            name={SP.AQUIFER}
            cost={toBuyMln[3]}
            textConfirmation={CONFIRMATION_TEXT.SP_AQUIFER}
            actionClicked={actionClicked}
            setActionClicked={setActionClicked}
            changeSPcosts={changeSPcosts}
            onYesFunc={onYesFunc}
            setBtnClickedId={setBtnClickedId}
         />
         <ModalSPaction
            id={4}
            icon={iconGreenery}
            name={SP.GREENERY}
            cost={toBuyMln[4]}
            textConfirmation={CONFIRMATION_TEXT.SP_GREENERY}
            actionClicked={actionClicked}
            setActionClicked={setActionClicked}
            changeSPcosts={changeSPcosts}
            onYesFunc={onYesFunc}
            setBtnClickedId={setBtnClickedId}
         />
         <ModalSPaction
            id={5}
            icon={iconCity}
            name={SP.CITY}
            cost={toBuyMln[5]}
            textConfirmation={CONFIRMATION_TEXT.SP_CITY}
            actionClicked={actionClicked}
            setActionClicked={setActionClicked}
            changeSPcosts={changeSPcosts}
            onYesFunc={onYesFunc}
            setBtnClickedId={setBtnClickedId}
         />
         {actionClicked !== null && statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && (
            <DecreaseCostSP toBuyMln={toBuyMln} toBuyHeat={toBuyHeat} changeSPcosts={changeSPcosts} actionClicked={actionClicked} />
         )}
      </div>
   )
}

export default ModalStandardProjects
