import res_mln from '../../../../../../../../assets/images/resources/res_mln.svg'
import res_steel from '../../../../../../../../assets/images/resources/res_steel.svg'
import res_titan from '../../../../../../../../assets/images/resources/res_titan.svg'
import res_plant from '../../../../../../../../assets/images/resources/res_plant.svg'
import res_energy from '../../../../../../../../assets/images/resources/res_energy.svg'
import res_heat from '../../../../../../../../assets/images/resources/res_heat.svg'
import res_prodBg from '../../../../../../../../assets/images/resources/res_prodBg.svg'

const LogItemStateProdRes = ({ state }) => {
   return (
      <div className="state-prod-res-container">
         <div className="state-prod-res">
            <div className="state-prod">
               <div className="value">
                  <span>{state.statePlayer.production.mln}</span>
               </div>
               <div className="icon">
                  <img src={res_prodBg} className="center first" alt="prodBg_icon" />
                  <img src={res_mln} className="center" alt="res_mln_icon" />
               </div>
            </div>
            <div className="state-res">
               <div className="value">
                  <span>{state.statePlayer.resources.mln}</span>
               </div>
               <div className="icon">
                  <img src={res_mln} className="center" alt="res_mln_icon" />
               </div>
            </div>
         </div>
         <div className="state-prod-res">
            <div className="state-prod">
               <div className="value">
                  <span>{state.statePlayer.production.steel}</span>
               </div>
               <div className="icon">
                  <img src={res_prodBg} className="center first" alt="prodBg_icon" />
                  <img src={res_steel} className="center" alt="res_steel_icon" />
               </div>
            </div>
            <div className="state-res">
               <div className="value">
                  <span>{state.statePlayer.resources.steel}</span>
               </div>
               <div className="icon">
                  <img src={res_steel} className="center" alt="res_steel_icon" />
               </div>
            </div>
         </div>
         <div className="state-prod-res">
            <div className="state-prod">
               <div className="value">
                  <span>{state.statePlayer.production.titan}</span>
               </div>
               <div className="icon">
                  <img src={res_prodBg} className="center first" alt="prodBg_icon" />
                  <img src={res_titan} className="center" alt="res_titan_icon" />
               </div>
            </div>
            <div className="state-res">
               <div className="value">
                  <span>{state.statePlayer.resources.titan}</span>
               </div>
               <div className="icon">
                  <img src={res_titan} className="center" alt="res_titan_icon" />
               </div>
            </div>
         </div>
         <div className="state-prod-res">
            <div className="state-prod">
               <div className="value">
                  <span>{state.statePlayer.production.plant}</span>
               </div>
               <div className="icon">
                  <img src={res_prodBg} className="center first" alt="prodBg_icon" />
                  <img src={res_plant} className="center" alt="res_plant_icon" />
               </div>
            </div>
            <div className="state-res">
               <div className="value">
                  <span>{state.statePlayer.resources.plant}</span>
               </div>
               <div className="icon">
                  <img src={res_plant} className="center" alt="res_plant_icon" />
               </div>
            </div>
         </div>
         <div className="state-prod-res">
            <div className="state-prod">
               <div className="value">
                  <span>{state.statePlayer.production.energy}</span>
               </div>
               <div className="icon">
                  <img src={res_prodBg} className="center first" alt="prodBg_icon" />
                  <img src={res_energy} className="center" alt="res_energy_icon" />
               </div>
            </div>
            <div className="state-res">
               <div className="value">
                  <span>{state.statePlayer.resources.energy}</span>
               </div>
               <div className="icon">
                  <img src={res_energy} className="center" alt="res_energy_icon" />
               </div>
            </div>
         </div>
         <div className="state-prod-res">
            <div className="state-prod">
               <div className="value">
                  <span>{state.statePlayer.production.heat}</span>
               </div>
               <div className="icon">
                  <img src={res_prodBg} className="center first" alt="prodBg_icon" />
                  <img src={res_heat} className="center" alt="res_heat_icon" />
               </div>
            </div>
            <div className="state-res">
               <div className="value">
                  <span>{state.statePlayer.resources.heat}</span>
               </div>
               <div className="icon">
                  <img src={res_heat} className="center" alt="res_heat_icon" />
               </div>
            </div>
         </div>
      </div>
   )
}

export default LogItemStateProdRes
