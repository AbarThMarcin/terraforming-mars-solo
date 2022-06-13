import { useContext } from 'react'
import { TILES } from '../../../../data/board'
import { getNeighbors } from '../../../../util/misc'
import { StatePlayerContext, StateGameContext, StateBoardContext } from '../../Game'
import iconTr from '../../../../assets/images/resources/tr.svg'
import iconGreenery from '../../../../assets/images/tiles/greenery.svg'
import iconCity from '../../../../assets/images/tiles/city.svg'
import iconVp from '../../../../assets/images/vp/vp.svg'
import BtnAction from '../buttons/BtnAction'

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
   const trPoints = getTrPoints()
   const greeneryPoints = getGreeneryPoints()
   const cityPoints = getCityPoints()
   const victoryPoints = getVictoryPoints()
   const totalPoints = getTotalPoints()

   const btnActionPosition = { bottom: '-20%', left: '50%', transform: 'translateX(-50%)' }

   function getTrPoints() {
      return stateGame.tr
   }
   function getGreeneryPoints() {
      let board = JSON.parse(JSON.stringify(stateBoard))
      return board.filter((field) => field.object === TILES.GREENERY).length
   }
   function getCityPoints() {
      let points = 0
      let board = JSON.parse(JSON.stringify(stateBoard))
      let cities = board.filter(
         (field) =>
            (field.object === TILES.CITY || field.object === TILES.SPECIAL_CITY_CAPITAL) &&
            field.name !== 'PHOBOS SPACE HAVEN' &&
            field.name !== 'GANYMEDE COLONY'
      )
      cities.forEach((city) => {
         let x = city.x
         let y = city.y
         let greeneries = getNeighbors(x, y, board).filter(
            (field) => field.object === TILES.GREENERY || field.object === TILES.GREENERY_NEUTRAL
         )
         points += greeneries.length
      })
      return points
   }
   function getVictoryPoints() {
      const cards = statePlayer.cardsPlayed.filter((card) => card.vp !== 0)
      const count = cards.length > 0 ? cards.reduce((total, card) => total + card.vp, 0) : 0

      return count
   }
   function getTotalPoints() {
      return trPoints + greeneryPoints + cityPoints + victoryPoints
   }

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
            textConfirmation='Leave the game and go back to main menu?'
            onYesFunc={onYesFunc}
            position={btnActionPosition}
         />
      </div>
   )
}

export default ModalEndStats
