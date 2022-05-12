import { useReducer, createContext, useState, useEffect } from 'react'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { reducerGame } from '../../util/actionsGame'
import { reducerPlayer } from '../../util/actionsPlayer'
import { reducerBoard } from '../../util/actionsBoard'
import { funcPerformSubActions, updateVP } from '../../util/misc'
import { funcGetImmEffects } from '../../data/immEffects'
import { funcGetEffect } from '../../data/effects'
import MenuIcon from './gameComponents/MenuIcon'
import PanelCorp from './gameComponents/panelCorp/PanelCorp'
import PanelStateGame from './gameComponents/PanelStateGame'
import StandardProjects from './gameComponents/StandardProjectsBtn'
import PassContainer from './gameComponents/passContainer/PassContainer'
import Board from './gameComponents/board/Board'
import Modals from './gameComponents/modals/Modals'
import { shuffledCorps, shuffledCards, randomBoard } from '../../App'
import '../../css/app.css'
import {
   funcRequirementsMet,
   funcActionRequirementsMet,
   funcOptionRequirementsMet,
} from '../../data/requirements'
import { funcGetCardActions } from '../../data/cardActions'
import ViewGameStateHeader from './gameComponents/ViewGameStateHeader'
import { funcGetOptionsActions } from '../../data/selectOneOptions'

export const StatePlayerContext = createContext()
export const StateGameContext = createContext()
export const StateBoardContext = createContext()
export const CorpsContext = createContext()
export const CardsContext = createContext()
export const ModalsContext = createContext()

function Game({ setGameOn }) {
   const [statePlayer, dispatchPlayer] = useReducer(reducerPlayer, INIT_STATE_PLAYER)
   const [stateGame, dispatchGame] = useReducer(reducerGame, INIT_STATE_GAME)
   const [modals, setModals] = useState(INIT_MODALS)
   const [stateBoard, dispatchBoard] = useReducer(reducerBoard, randomBoard)
   const corps = shuffledCorps
   const [cards, setCards] = useState(shuffledCards)
   const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(2000)
   const [updateVpTrigger, setUpdateVpTrigger] = useState(false)

   useEffect(() => {
      updateVP(statePlayer, dispatchPlayer, stateBoard)
   }, [updateVpTrigger])

   function getImmEffects(typeOrCardId) {
      return funcGetImmEffects(
         typeOrCardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         getImmEffects,
         stateBoard,
         dispatchBoard,
         modals,
         setModals
      )
   }
   function getCardActions(cardId, toBuyResources) {
      return funcGetCardActions(
         cardId,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         performSubActions,
         stateBoard,
         dispatchBoard,
         modals,
         setModals,
         cards,
         setCards,
         getEffect,
         getImmEffects,
         toBuyResources
      )
   }
   function getEffect(effect) {
      return funcGetEffect(effect, statePlayer, dispatchPlayer, stateGame, dispatchGame, modals, setModals)
   }
   function getOptionsActions(option, energyAmount) {
      return funcGetOptionsActions(
         option,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         getImmEffects,
         modals,
         setModals,
         energyAmount
      )
   }
   function performSubActions(subActions) {
      return funcPerformSubActions(
         subActions,
         ANIMATION_SPEED,
         setModals,
         dispatchGame,
         setUpdateVpTrigger
      )
   }
   function requirementsMet(card, cost, actionClicked) {
      return funcRequirementsMet(card, statePlayer, stateGame, stateBoard, modals, cost, actionClicked)
   }
   function actionRequirementsMet(card) {
      return funcActionRequirementsMet(card, statePlayer, stateGame, modals, stateBoard)
   }
   function optionRequirementsMet(card) {
      return funcOptionRequirementsMet(card, statePlayer)
   }

   return (
      <div className="game">
         <StatePlayerContext.Provider value={{ statePlayer, dispatchPlayer }}>
            <StateGameContext.Provider
               value={{
                  stateGame,
                  dispatchGame,
                  getImmEffects,
                  getCardActions,
                  getEffect,
                  getOptionsActions,
                  performSubActions,
                  requirementsMet,
                  actionRequirementsMet,
                  optionRequirementsMet,
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
                           {stateGame.phaseViewGameState && <ViewGameStateHeader />}
                           {!stateGame.phaseCorporation && <PanelStateGame />}
                           {!stateGame.phaseCorporation && <PassContainer />}
                           <Board />
                           {!stateGame.phaseCorporation && <PanelCorp />}
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
