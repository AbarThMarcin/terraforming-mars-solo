/* Used to view standard projects */
import { useContext, useEffect } from 'react'
import { StatePlayerContext, ModalsContext, ActionsContext } from '../../../../game'
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
import { INIT_ACTIONS } from '../../../../../initStates/initActions'

const ModalStandardProjects = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { setModals } = useContext(ModalsContext)
   const { actions, setActions } = useContext(ActionsContext)

   useEffect(() => {
      setActions(INIT_ACTIONS)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className="modal-standard-projects-box center" onClick={(e) => e.stopPropagation()}>
         {/* HEADER */}
         <div className="header">STANDARD PROJECTS</div>
         {/* CLOSE BUTTON */}
         <BtnClose onCloseClick={() => setModals((prev) => ({ ...prev, standardProjects: false }))} />
         {/* ACTIONS */}
         <ModalSPaction id={0} icon={iconSellPatent} name={SP.SELL_PATENT} textConfirmation="" />
         <ModalSPaction id={1} icon={iconPowerPlant} name={SP.POWER_PLANT} textConfirmation={CONFIRMATION_TEXT.SP_POWERPLANT} />
         <ModalSPaction id={2} icon={iconAsteroid} name={SP.ASTEROID} textConfirmation={CONFIRMATION_TEXT.SP_ASTEROID} />
         <ModalSPaction id={3} icon={iconAquifer} name={SP.AQUIFER} textConfirmation={CONFIRMATION_TEXT.SP_AQUIFER} />
         <ModalSPaction id={4} icon={iconGreenery} name={SP.GREENERY} textConfirmation={CONFIRMATION_TEXT.SP_GREENERY} />
         <ModalSPaction id={5} icon={iconCity} name={SP.CITY} textConfirmation={CONFIRMATION_TEXT.SP_CITY} />
         {actions.id !== null && statePlayer.resources.heat > 0 && statePlayer.canPayWithHeat && <DecreaseCostSP />}
      </div>
   )
}

export default ModalStandardProjects
