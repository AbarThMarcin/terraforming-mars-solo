import { useReducer, createContext, useState, useEffect } from 'react'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { ACTIONS_PLAYER } from '../../util/actionsPlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { reducerGame } from '../../util/actionsGame'
import { reducerPlayer } from '../../util/actionsPlayer'
import { reducerBoard } from '../../util/actionsBoard'
import { funcPerformSubActions, modifiedCards, updateVP } from '../../util/misc'
import { funcGetImmEffects } from '../../data/immEffects/immEffects'
import { funcGetEffect } from '../../data/effects'
import { shuffledCorps, shuffledCards, randomBoard } from '../../App'
import {
   funcRequirementsMet,
   funcActionRequirementsMet,
   funcOptionRequirementsMet,
} from '../../data/requirements'
import { funcGetCardActions } from '../../data/cardActions'
import { funcGetOptionsActions } from '../../data/selectOneOptions'
import '../../css/app.css'
import ViewGameStateHeader from './gameComponents/ViewGameStateHeader'
import BtnMenu from './gameComponents/buttons/BtnMenu'
import PanelCorp from './gameComponents/panelCorp/PanelCorp'
import PanelStateGame from './gameComponents/PanelStateGame'
import StandardProjects from './gameComponents/buttons/BtnStandardProjects'
import PassContainer from './gameComponents/passContainer/PassContainer'
import Board from './gameComponents/board/Board'
import Modals from './gameComponents/modals/Modals'

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
   const [logItems, setLogItems] = useState([{ type: 'log', data: null }, { type: 'generation', data: { text: '1' } }])
   const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(1500)
   const [btnClickedId, setBtnClickedId] = useState(4)
   const [updateVpTrigger, setUpdateVpTrigger] = useState(false)

   useEffect(() => {
      // Update VP of all cards
      updateVP(statePlayer, dispatchPlayer, stateBoard)
      // Turn off Special Design effect (if aplicable)
      if (statePlayer.specialDesignEffect && modals.modalCard.id !== 206) {
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PARAMETERS_REQUIREMENTS, payload: -2 })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_SPECIAL_DESIGN_EFFECT, payload: false })
      }
      // Turn off Indentured Workers effect (if aplicable)
      if (statePlayer.indenturedWorkersEffect && modals.modalCard.id !== 195) {
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
            payload: modifiedCards(statePlayer.cardsInHand, statePlayer, null, false),
         })
         dispatchPlayer({
            type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
            payload: modifiedCards(statePlayer.cardsPlayed, statePlayer, null, false),
         })
         dispatchPlayer({ type: ACTIONS_PLAYER.SET_INDENTURED_WORKERS, payload: false })
      }
   }, [updateVpTrigger])

   function setAnimationSpeed(id) {
      switch (id) {
         case 1:
            setANIMATION_SPEED(2300)
            break
         case 2:
            setANIMATION_SPEED(1500)
            break
         case 3:
            setANIMATION_SPEED(1000)
            break
         case 4:
            setANIMATION_SPEED(600)
            break
         default:
            break
      }
   }

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
         setModals,
         cards,
         setCards,
         requirementsMet
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
      return funcGetEffect(
         effect,
         statePlayer,
         dispatchPlayer,
         dispatchGame,
         modals,
         setModals,
         cards,
         setCards
      )
   }
   function getOptionsActions(option, energyAmount, heatAmount) {
      return funcGetOptionsActions(
         option,
         statePlayer,
         dispatchPlayer,
         stateGame,
         dispatchGame,
         getImmEffects,
         modals,
         setModals,
         energyAmount,
         heatAmount
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
   function requirementsMet(card) {
      return funcRequirementsMet(card, statePlayer, stateGame, stateBoard, modals, getImmEffects)
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
                  setLogItems,
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
                  btnClickedId,
                  setBtnClickedId,
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
                           <Modals
                              setGameOn={setGameOn}
                              setAnimationSpeed={setAnimationSpeed}
                              logItems={logItems}
                           />
                           <BtnMenu />
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
