import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import PanelCorpActionBtn from './PanelCorpActionBtn'
import actionGreenery from '../../../../../assets/images/panelCorp-actions/panelCorp-action-greenery.png'
import actionTemperature from '../../../../../assets/images/panelCorp-actions/panelCorp-action-temperature.png'

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
               statePlayer.resources.plants >= statePlayer.valueGreenery &&
               !modals.draft &&
               !stateGame.phasePlaceTile && (
                  <PanelCorpActionBtn
                     textConfirmation={`Do you want to convert ${statePlayer.valueGreenery} plants to a Greenery?`}
                     action={action.func}
                     bg={actionGreenery}
                  />
               )}
            {action.type === 'temperature' &&
               statePlayer.resources.heat >= 8 &&
               !modals.draft &&
               !stateGame.phasePlaceTile && (
                  <PanelCorpActionBtn
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
