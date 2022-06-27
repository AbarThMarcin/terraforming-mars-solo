import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, StateBoardContext } from '../../Game'
import iconTr from '../../../../assets/images/resources/tr.svg'
import iconGreenery from '../../../../assets/images/tiles/greenery.svg'
import iconCity from '../../../../assets/images/tiles/city.svg'
import iconVp from '../../../../assets/images/vp/any.svg'
import BtnAction from '../buttons/BtnAction'
import { getCityPoints, getGreeneryPoints, getTotalPoints, getTrPoints, getVictoryPoints } from '../../../../util/misc'

const ModalEndStats = ({ setGameOn }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { stateBoard } = useContext(StateBoardContext)
   const victoryLossText =
      stateGame.globalParameters.temperature === 8 &&
      stateGame.globalParameters.oxygen === 14 &&
      stateGame.globalParameters.oceans === 9
         ? 'YOU WIN!'
         : 'YOU LOSE!'
   const trPoints = getTrPoints(stateGame)
   const greeneryPoints = getGreeneryPoints(stateBoard)
   const cityPoints = getCityPoints(stateBoard)
   const victoryPoints = getVictoryPoints(statePlayer)
   const totalPoints = getTotalPoints(statePlayer, stateGame, stateBoard)

   const btnActionPosition = { bottom: '-20%', left: '50%', transform: 'translateX(-50%)' }

   const onYesFunc = () => {
      setGameOn(false)
   }

   return (
      <div className="modal-end-stats center">
         <span className="header">SCOREBOARD</span>
         <span className="victory-loss">{victoryLossText}</span>
         <div className="data">
            <div className="category">
               <img src={iconTr} alt="icon_tr" />
               <span className="name">TERRAFORMING RATING </span>
               <span className="value">{trPoints}</span>
            </div>
            <div className="category">
               <img src={iconGreenery} alt="icon_greenery" />
               <span className="name">GREENERY </span>
               <span className="value">{greeneryPoints}</span>
            </div>
            <div className="category">
               <img src={iconCity} alt="icon_city" />
               <span className="name">CITY </span>
               <span className="value">{cityPoints}</span>
            </div>
            <div className="category">
               <img src={iconVp} alt="icon_vp" />
               <span className="name">VICTORY POINTS </span>
               <span className="value">{victoryPoints}</span>
            </div>
            <div className="category">
               <span className="name">TOTAL </span>
               <span className="value value-total">{totalPoints}</span>
            </div>
         </div>
         <BtnAction
            text="DONE"
            textConfirmation="Leave the game and go back to main menu?"
            onYesFunc={onYesFunc}
            position={btnActionPosition}
         />
      </div>
   )
}

export default ModalEndStats
