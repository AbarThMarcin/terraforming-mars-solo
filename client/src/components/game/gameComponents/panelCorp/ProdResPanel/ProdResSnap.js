import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import actionGreenery from '../../../../../assets/images/panelCorp/actions/action-greenery.svg'
import actionGreeneryBright from '../../../../../assets/images/panelCorp/actions/action-greenery-bright.svg'
import actionTemperature from '../../../../../assets/images/panelCorp/actions/action-temperature.svg'
import actionTemperatureBright from '../../../../../assets/images/panelCorp/actions/action-temperature-bright.svg'
import BtnConvertPlantsHeat from '../../buttons/BtnConvertPlantsHeat'
import { RESOURCES } from '../../../../../data/resources'

const ProdResSnap = ({ prod, res, icon, action, resource }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   return (
      <>
         <div className="prod-res-snap-container">
            {/* Production */}
            <div className="prod-snap">
               <span>{prod}</span>
            </div>
            {/* Resources */}
            <div className={resource === RESOURCES.MLN ? 'res-snap mln' : 'res-snap'}>
               <div className="icon">
                  <img src={icon} alt="res_icon" />
               </div>
               <div className="value">
                  <span>{res}</span>
               </div>
            </div>
            {/* Action Buttons */}
            {action.type === 'greenery' &&
               statePlayer.resources.plant >= statePlayer.valueGreenery &&
               !modals.draft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState && (
                  <BtnConvertPlantsHeat
                     textConfirmation={`Do you want to convert ${statePlayer.valueGreenery} plants to a Greenery?`}
                     action={action.func}
                     bg={actionGreenery}
                     bgBright={actionGreeneryBright}
                  />
               )}
            {action.type === 'temperature' &&
               statePlayer.resources.heat >= 8 &&
               !modals.draft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState && (
                  <BtnConvertPlantsHeat
                     textConfirmation="Do you want to convert 8 heat to increase the temperature?"
                     action={action.func}
                     bg={actionTemperature}
                     bgBright={actionTemperatureBright}
                  />
               )}
         </div>
      </>
   )
}

export default ProdResSnap
