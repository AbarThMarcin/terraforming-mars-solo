import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatePlayerContext, StateGameContext, StateBoardContext, UserContext, ModalsContext } from '../../../../game'
import iconTr from '../../../../../assets/images/resources/res_tr.svg'
import iconGreenery from '../../../../../assets/images/tiles/tile_greenery.svg'
import iconCity from '../../../../../assets/images/tiles/tile_city.svg'
import iconVp from '../../../../../assets/images/vp/vp_any.svg'
import BtnAction from '../../buttons/BtnAction'
import { getCityPoints, getGreeneryPoints, getTotalPoints, getTrPoints, getVictoryPoints } from '../../../../../utils/misc'
import { createEndedGameData } from '../../../../../api/endedGame'
import { deleteActiveGameData } from '../../../../../api/activeGame'
import { updateUser } from '../../../../../api/user'
import { getCorpLogoMini } from '../../../../../data/corporations'
import { funcUpdateLastLogItemAfter } from '../../../../../data/log/log'

const ModalEndStats = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame, logItems, setSyncError, setLogItems } = useContext(StateGameContext)
   const { setModals } = useContext(ModalsContext)
   const { stateBoard } = useContext(StateBoardContext)
   const { user, setUser, type } = useContext(UserContext)
   const victoryLossText =
      stateGame.globalParameters.temperature >= 8 && stateGame.globalParameters.oxygen >= 14 && stateGame.globalParameters.oceans >= 9 ? 'YOU WIN!' : 'YOU LOSE!'
   const trPoints = getTrPoints(stateGame)
   const greeneryPoints = getGreeneryPoints(stateBoard)
   const cityPoints = getCityPoints(stateBoard)
   const victoryPoints = getVictoryPoints(statePlayer)
   const totalPoints = getTotalPoints(statePlayer, stateGame, stateBoard)
   const navigate = useNavigate()
   const [addRankedGame, setAddRankedGame] = useState(false)
   const logo = getCorpLogoMini(statePlayer.corporation.name)

   const gameData = {
      victory: victoryLossText === 'YOU WIN!' ? true : false,
      corporation: statePlayer.corporation,
      cards: {
         played: statePlayer.cardsPlayed,
         seen: statePlayer.cardsSeen,
         purchased: statePlayer.cardsPurchased,
         inDeck: statePlayer.cardsDeckIds,
      },
      logItems,
      points: {
         tr: trPoints,
         greenery: greeneryPoints,
         city: cityPoints,
         vp: victoryPoints,
         total: totalPoints,
      },
   }

   useEffect(() => {
      funcUpdateLastLogItemAfter(setLogItems, statePlayer, stateGame, stateBoard)

      const updateBackend = async () => {
         // If not logged, do nothing
         if (!user) return
         // Remove game from active games

         // await deleteActiveGameData(user.token, type)
         let matchWithId = null
         matchWithId = await deleteActiveGameData(user.token, type)
         if (matchWithId?.response) {
            setSyncError('THERE ARE SOME ISSUES WITH UPDATING GAME ON SERVER')
         } else {
            // Also update user's profile (activeMatches)
            const userMatches = {
               activeMatches: {
                  quickMatch: type === 'quickMatch' ? false : user.activeMatches.quickMatch,
                  quickMatchId: type === 'quickMatchId' ? false : user.activeMatches.quickMatchId,
                  ranked: type === 'ranked' ? false : user.activeMatches.ranked,
               },
            }
            const { data } = await updateUser(user.token, userMatches)
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
            // Create ended game if type = ranked
            if (type === 'ranked') setAddRankedGame(true)
         }
      }

      updateBackend()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      if (addRankedGame) createEndedGameData(user.token, gameData)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [addRankedGame])

   const btnActionDonePosition = { bottom: '-20%', left: '50%', transform: 'translateX(-50%)' }
   const btnActionLogPosition = { bottom: '1%', right: '1%', transform: 'scale(0.8)' }

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
         <div className="corporation-container">
            <div className="logo">
               <img src={logo} alt={`logo_${statePlayer.corporation.name}`} size="20px" />
            </div>
            <div>{statePlayer.corporation.name}</div>
         </div>
         <BtnAction text="LOG" onYesFunc={() => setModals((prev) => ({ ...prev, log: true }))} position={btnActionLogPosition} />
         <BtnAction text="DONE" textConfirmation="Leave the game and go back to main menu?" onYesFunc={() => navigate('/')} position={btnActionDonePosition} />
      </div>
   )
}

export default ModalEndStats
