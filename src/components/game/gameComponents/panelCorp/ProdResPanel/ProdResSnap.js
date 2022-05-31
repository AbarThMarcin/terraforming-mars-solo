import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import actionGreenery from '../../../../../assets/images/panelCorp/actions/action-greenery.png'
import actionTemperature from '../../../../../assets/images/panelCorp/actions/action-temperature.png'
import BtnConvertPlantsHeat from '../../buttons/BtnConvertPlantsHeat'

const ProdResSnap = ({ prod, res, icon, action }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)
   return (
      <>
         <div className="prod-res-snap-container">
            <div className="prod-snap">{prod}</div>
            <div className="res-snap">
               <div className="res-snap-icon">{icon}</div>
               <div className="res-snap-value">{res}</div>
            </div>
            {action.type === 'greenery' &&
               statePlayer.resources.plant >= statePlayer.valueGreenery &&
               !modals.draft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState &&
               !modals.animation && (
                  <BtnConvertPlantsHeat
                     textConfirmation={`Do you want to convert ${statePlayer.valueGreenery} plants to a Greenery?`}
                     action={action.func}
                     bg={actionGreenery}
                  />
               )}
            {action.type === 'temperature' &&
               statePlayer.resources.heat >= 8 &&
               !modals.draft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState &&
               !modals.animation && (
                  <BtnConvertPlantsHeat
                     textConfirmation="Do you want to convert 8 heat to increase the temperature?"
                     action={action.func}
                     bg={actionTemperature}
                  />
               )}
         </div>
      </>
   )
}

export default ProdResSnap
