import res_tr from '../../../../../../../../assets/images/resources/res_tr.svg'
import vp_any from '../../../../../../../../assets/images/vp/vp_any.svg'
import tempIconForLog from '../../../../../../../../assets/images/other/tempIconForLog.svg'
import oxIcon from '../../../../../../../../assets/images/other/oxIcon.svg'
import tile_ocean from '../../../../../../../../assets/images/tiles/tile_ocean.svg'

const LogItemStateParams = ({ state }) => {
   const vp = getVp()

   function getVp() {
      const cards = state.statePlayer.cardsPlayed.filter((card) => card.vp !== 0)
      return cards.length > 0 ? cards.reduce((total, card) => total + card.vp, 0) : 0
   }

   return (
      <div className="state-params-container">
         <div className="state-param">
            <img src={res_tr} className="center" alt="res_tr" />
            <span className="center">{state.stateGame.tr}</span>
         </div>
         <div className="state-param">
            <img src={vp_any} className="center" alt="vp_any" />
            <span className="center">{vp}</span>
         </div>
         <div className="state-param">
            <img src={tempIconForLog} className="center" alt="tempIconForLog" />
            <span className="center">{state.stateGame.globalParameters.temperature}</span>
         </div>
         <div className="state-param">
            <img src={oxIcon} className="center" alt="oxIcon" />
            <span className="center">{state.stateGame.globalParameters.oxygen}</span>
         </div>
         <div className="state-param">
            <img src={tile_ocean} className="center" alt="tile_ocean" />
            <span className="center">{state.stateGame.globalParameters.oceans}</span>
         </div>
      </div>
   )
}

export default LogItemStateParams
