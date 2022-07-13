/* Used to show the settings sub-menu window */
import { useContext, useState } from 'react'
import { updateUser } from '../../../../api/apiUser'
import { SPEED } from '../../../../data/settings'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { sorted } from '../../../../utils/misc'
import { UserContext, StatePlayerContext, StateGameContext } from '../../Game'

const ModalSettings = ({ setAnimationSpeed, showTotVP, setShowTotVP, sortId, setSortId }) => {
   const { user, setUser } = useContext(UserContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { ANIMATION_SPEED, requirementsMet } = useContext(StateGameContext)
   const [speedId, setSpeedId] = useState(getAnimationId())

   function getAnimationId() {
      switch (ANIMATION_SPEED) {
         case SPEED.SLOW:
            return 1
         case SPEED.NORMAL:
            return 2
         case SPEED.FAST:
            return 3
         case SPEED.VERY_FAST:
            return 4
         default:
            break
      }
   }

   const handleClickArrow_speed = (arrow) => {
      // Change on Front-end
      let newId
      if (arrow === 'left') {
         newId = speedId - 1
         if (newId < 1) newId = 4
      } else {
         newId = speedId + 1
         if (newId > 4) newId = 1
      }
      setSpeedId(newId)
      setAnimationSpeed(newId)
      // Change in Backend
      if (user) {
         const settings = {
            gameSpeed: newId,
            showTotalVP: user.settings.showTotalVP,
         }
         updateBackend(settings)
      }
   }

   const handleClickArrow_totVP = () => {
      // Change on Front-end
      let newShowTotVP = !showTotVP
      setShowTotVP(newShowTotVP)
      // Change in Backend
      if (user) {
         const settings = {
            gameSpeed: user.settings.gameSpeed,
            showTotalVP: newShowTotVP,
         }
         updateBackend(settings)
      }
   }

   const handleClickArrow_sort = (type, arrow) => {
      // Change on Front-end
      let digit =
         type === 'hand' ? parseInt(sortId[0].slice(0, 1)) : parseInt(sortId[1].slice(0, 1))
         let sign = type === 'hand' ? sortId[0].slice(1, 2) : sortId[1].slice(1, 2)
      const maxIdDigit = type === 'hand' ? 5 : 4
      let newSortId
      if (sign === 'a') {
         sign = 'b'
         if (arrow === 'left') digit = newDigit(arrow, digit, maxIdDigit)
      } else {
         sign = 'a'
         if (arrow === 'right') digit = newDigit(arrow, digit, maxIdDigit)
      }
      if (type === 'played' && digit === 4) sign += '-played'
      newSortId =
         type === 'hand'
            ? [`${digit}${sign}`, sortId[1]]
            : [sortId[0], `${digit}${sign}`]
      setSortId(newSortId)
      type === 'hand'
         ? dispatchPlayer({
              type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
              payload: sorted(statePlayer.cardsInHand, newSortId[0], requirementsMet),
           })
         : dispatchPlayer({
              type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
              payload: sorted(statePlayer.cardsPlayed, newSortId[1], requirementsMet),
           })
      // Change in Backend
      if (user) {
         const settings = {
            gameSpeed: user.settings.gameSpeed,
            showTotalVP: user.settings.showTotalVP,
            handSortId: newSortId[0],
            playedSortId: newSortId[1],
         }
         updateBackend(settings)
      }
   }
   function newDigit(arrow, digit, maxIdDigit) {
      if (arrow === 'left') {
         digit--
         if (digit < 1) digit = maxIdDigit
      } else {
         digit++
         if (digit > maxIdDigit) digit = 1
      }
      return digit
   }

   const updateBackend = async (settings) => {
      try {
         const { data } = await updateUser(user.token, { settings })
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
      } catch (error) {
         console.log('Something went wrong.')
      }
   }

   return (
      <div className="settings-container">
         {/* Animation Speed */}
         <div className="settings">
            <span>ANIMATION SPEED</span>
            <div className="item">
               <div
                  className="arrow arrow-left pointer"
                  onClick={() => handleClickArrow_speed('left')}
               ></div>
               {speedId === 1 && <span>SLOW</span>}
               {speedId === 2 && <span>NORMAL</span>}
               {speedId === 3 && <span>FAST</span>}
               {speedId === 4 && <span>VERY FAST</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={() => handleClickArrow_speed('right')}
               ></div>
            </div>
         </div>
         {/* Show Total VP */}
         <div className="settings">
            <span>SHOW TOTAL POINTS</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={handleClickArrow_totVP}></div>
               <span>{showTotVP ? 'YES' : 'NO'}</span>
               <div className="arrow arrow-right pointer" onClick={handleClickArrow_totVP}></div>
            </div>
         </div>
         {/* Cards In Hand Sort by */}
         <div className="settings">
            <span>CARDS IN HAND SORT BY</span>
            <div className="item">
               <div
                  className="arrow arrow-left pointer"
                  onClick={() => handleClickArrow_sort('hand', 'left')}
               ></div>
               {sortId[0] === '1a' && <span>{`COST (ASC)`}</span>}
               {sortId[0] === '1b' && <span>{`COST (DESC)`}</span>}
               {sortId[0] === '2a' && <span>{`CARD TYPE (ASC)`}</span>}
               {sortId[0] === '2b' && <span>{`CARD TYPE (DESC)`}</span>}
               {sortId[0] === '3a' && <span>{`TAGS (ASC)`}</span>}
               {sortId[0] === '3b' && <span>{`TAGS (DESC)`}</span>}
               {sortId[0] === '4a' && <span>{`CHRONOLOGICAL (ASC)`}</span>}
               {sortId[0] === '4b' && <span>{`CHRONOLOGICAL (DESC)`}</span>}
               {sortId[0] === '5a' && <span>{`PLAYABILITY (ASC)`}</span>}
               {sortId[0] === '5b' && <span>{`PLAYABILITY (DESC)`}</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={() => handleClickArrow_sort('hand', 'right')}
               ></div>
            </div>
         </div>
         {/* Cards Played Sort by */}
         <div className="settings">
            <span>CARDS PLAYED SORT BY</span>
            <div className="item">
               <div
                  className="arrow arrow-left pointer"
                  onClick={() => handleClickArrow_sort('played', 'left')}
               ></div>
               {sortId[1] === '1a' && <span>{`COST (ASC)`}</span>}
               {sortId[1] === '1b' && <span>{`COST (DESC)`}</span>}
               {sortId[1] === '2a' && <span>{`CARD TYPE (ASC)`}</span>}
               {sortId[1] === '2b' && <span>{`CARD TYPE (DESC)`}</span>}
               {sortId[1] === '3a' && <span>{`TAGS (ASC)`}</span>}
               {sortId[1] === '3b' && <span>{`TAGS (DESC)`}</span>}
               {sortId[1] === '4a-played' && <span>{`CHRONOLOGICAL (ASC)`}</span>}
               {sortId[1] === '4b-played' && <span>{`CHRONOLOGICAL (DESC)`}</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={() => handleClickArrow_sort('played', 'right')}
               ></div>
            </div>
         </div>
      </div>
   )
}

export default ModalSettings
