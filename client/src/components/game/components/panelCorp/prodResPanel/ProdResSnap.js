import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../game'
import actionGreenery from '../../../../../assets/images/panelCorp/actions/action_greenery.svg'
import actionTemperature from '../../../../../assets/images/panelCorp/actions/action_temperature.svg'
import BtnConvertPlantsHeat from '../../buttons/BtnConvertPlantsHeat'
import { RESOURCES } from '../../../../../data/resources'
import { CONFIRMATION_TEXT } from '../../../../../data/app'

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
               !stateGame.phaseDraft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState &&
               !stateGame.phaseCorporation &&
               !modals.animation && (
                  <BtnConvertPlantsHeat
                     textConfirmation={`Do you want to convert ${statePlayer.valueGreenery} plants to a Greenery?`}
                     action={action.func}
                     bg={actionGreenery}
                  />
               )}
            {action.type === 'temperature' &&
               statePlayer.resources.heat >= 8 &&
               stateGame.globalParameters.temperature < 8 &&
               !stateGame.phaseDraft &&
               !stateGame.phasePlaceTile &&
               !stateGame.phaseViewGameState &&
               !stateGame.phaseCorporation &&
               !modals.animation && (
                  <BtnConvertPlantsHeat
                     textConfirmation={CONFIRMATION_TEXT.CONVERT_HEAT}
                     action={action.func}
                     bg={actionTemperature}
                  />
               )}
         </div>
      </>
   )
}

export default ProdResSnap
