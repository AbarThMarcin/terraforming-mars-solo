/* LIST OF ALL EFFECTS:                ModalCardWithAction Component
This includes all effects in game EXCEPT immediate effects from corporations, listed in the
ModalCorps component => callImmediateEffect function. */

import { useReducer, createContext, useState } from 'react'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { reducerGame } from '../../util/actionsGame'
import { reducerPlayer } from '../../util/actionsPlayer'
import { reducerBoard } from '../../util/actionsBoard'
import { doAction } from '../../data/actions'
import MenuIcon from './gameComponents/MenuIcon'
import PanelCorp from './gameComponents/panelCorp/PanelCorp'
import PanelStateGame from './gameComponents/PanelStateGame'
import StandardProjects from './gameComponents/StandardProjectsBtn'
import PassContainer from './gameComponents/passContainer/PassContainer'
import Board from './gameComponents/board/Board'
import Modals from './gameComponents/modals/Modals'
import { shuffledCorps, shuffledCards, randomBoard } from '../../App'
import '../../css/app.css'
import { areRequirementsMet } from '../../data/requirements'

export const StatePlayerContext = createContext()
export const StateGameContext = createContext()
export const StateBoardContext = createContext()
export const CorpsContext = createContext()
export const CardsContext = createContext()
export const ModalsContext = createContext()

function Game({ setGameOn }) {
   const [statePlayer, dispatchPlayer] = useReducer(reducerPlayer, INIT_STATE_PLAYER)
   const [stateGame, dispatchGame] = useReducer(reducerGame, INIT_STATE_GAME)
   const [stateBoard, dispatchBoard] = useReducer(reducerBoard, randomBoard)
   const corps = shuffledCorps
   const [cards, setCards] = useState(shuffledCards)
   const [modals, setModals] = useState(INIT_MODALS)
   const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(1500)

   function performActions(typeOrCardId) {
      doAction(
         typeOrCardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         stateBoard,
         dispatchBoard,
         modals,
         setModals,
         ANIMATION_SPEED
      )
   }

   function requirementsMet(card) {
      return areRequirementsMet(card, statePlayer, stateGame)
   }

   return (
      <div className="game">
         <StatePlayerContext.Provider value={{ statePlayer, dispatchPlayer }}>
            <StateGameContext.Provider
               value={{
                  stateGame,
                  dispatchGame,
                  performActions,
                  requirementsMet,
                  ANIMATION_SPEED,
                  setANIMATION_SPEED,
               }}
            >
               <StateBoardContext.Provider value={{ stateBoard, dispatchBoard }}>
                  <CorpsContext.Provider value={corps}>
                     <CardsContext.Provider value={{ cards, setCards }}>
                        <ModalsContext.Provider value={{ modals, setModals }}>
                           {/* ----------------------------------------------------- */}
                           {!stateGame.phaseCorporation &&
                              !stateGame.phaseDraft &&
                              !stateGame.phaseViewGameState && <StandardProjects />}
                           {!stateGame.phaseCorporation && <PanelStateGame />}
                           {!stateGame.phaseCorporation && <PanelCorp />}
                           {!stateGame.phaseCorporation && <PassContainer />}
                           <Board />
                           <Modals setGameOn={setGameOn} />
                           <MenuIcon />
                           {/* ----------------------------------------------------- */}
                        </ModalsContext.Provider>
                     </CardsContext.Provider>
                  </CorpsContext.Provider>
               </StateBoardContext.Provider>
            </StateGameContext.Provider>
         </StatePlayerContext.Provider>
      </div>
   )
}

export default Game
