/* 

LIST OF ALL IMMEDIATE CORP EFFECTS: ModalCorps Component
   This includes only few corporations. Changes to the states are made immediately right
   after corp is selected.

LIST OF ALL CARDS' ACTIONS:         ModalCardWithAction Component
   This includes actions for ALL (non-corporate) cards in the game.

LIST OF ALL EFFECTS:                ModalCardWithAction Component
   This includes all effects in game EXCEPT immediate effects from corporations, listed in the
   ModalCorps component => callImmediateEffect function.

*/

import { useReducer, createContext, useState } from 'react'
import { INIT_STATE_GAME } from './initStates/initStateGame'
import { INIT_STATE_PLAYER } from './initStates/initStatePlayer'
import { INIT_MODALS } from './initStates/initModals'
import { reducerGame } from './util/dispatchGame'
import { reducerPlayer } from './util/dispatchPlayer'
import MenuIcon from './components/MenuIcon'
import PanelCorp from './components/panelCorp/PanelCorp'
import PanelStateGame from './components/PanelStateGame'
import StandardProjects from './components/StandardProjectsBtn'
import PassContainer from './components/passContainer/PassContainer'
import Board from './components/board/Board'
import Modals from './components/modals/Modals'
import { shuffledCorps, shuffledCards } from './App'
import './css/app.css'
import { hasTag } from './util/misc'

export const StateGameContext = createContext()
export const StatePlayerContext = createContext()
export const CorpsContext = createContext()
export const CardsContext = createContext()
export const ModalsContext = createContext()

function Game({ setGameOn }) {
   const [stateGame, dispatchGame] = useReducer(reducerGame, INIT_STATE_GAME)
   const [statePlayer, dispatchPlayer] = useReducer(reducerPlayer, INIT_STATE_PLAYER)
   const corps = shuffledCorps
   const [cards, setCards] = useState(shuffledCards)
   const [modals, setModals] = useState(INIT_MODALS)

   function checkRequirements(card) {
      let isAvailable = true
      // Check cost vs resources first
      if (resourcesForCard(card) < card.currentCost) {
         isAvailable = false
         return isAvailable
      }
      // Check other requirements
      card.requirements.forEach((req) => {
         // Oxygen requirement
         if (req.type === 'oxygen') {
            if (req.other === 'max' && stateGame.globalParameters.oxygen >= req.value)
               isAvailable = false
            if (req.other === 'min' && stateGame.globalParameters.oxygen <= req.value)
               isAvailable = false
         }
         // Temperature requirement
         if (req.type === 'temperature') {
            if (req.other === 'max' && stateGame.globalParameters.temperature >= req.value)
               isAvailable = false
            if (req.other === 'min' && stateGame.globalParameters.temperature <= req.value)
               isAvailable = false
         }
         // Oceans requirement
         if (req.type === 'oceans') {
            if (req.other === 'max' && stateGame.globalParameters.oceans >= req.value)
               isAvailable = false
            if (req.other === 'min' && stateGame.globalParameters.oceans <= req.value)
               isAvailable = false
         }
      })
      return isAvailable
   }

   function resourcesForCard(card) {
      let resources = statePlayer.resources.mln
      if (hasTag(card, 'building'))
         resources += statePlayer.resources.steel * statePlayer.valueSteel
      if (hasTag(card, 'space')) resources += statePlayer.resources.titan * statePlayer.valueTitan
      return resources
   }

   return (
      <div className="game">
         <StateGameContext.Provider value={{ stateGame, dispatchGame, checkRequirements }}>
            <StatePlayerContext.Provider value={{ statePlayer, dispatchPlayer }}>
               <CorpsContext.Provider value={corps}>
                  <CardsContext.Provider value={{ cards, setCards }}>
                     <ModalsContext.Provider value={{ modals, setModals }}>
                        {!stateGame.corporationPhase && !stateGame.draftPhase && (
                           <StandardProjects />
                        )}
                        {!stateGame.corporationPhase && <PanelStateGame />}
                        {!stateGame.corporationPhase && <PanelCorp />}
                        {!stateGame.corporationPhase && <PassContainer />}
                        <Board />
                        <Modals setGameOn={setGameOn} />
                        <MenuIcon />
                     </ModalsContext.Provider>
                  </CardsContext.Provider>
               </CorpsContext.Provider>
            </StatePlayerContext.Provider>
         </StateGameContext.Provider>
      </div>
   )
}

export default Game
