/* LIST OF ALL IMMEDIATE CORP EFFECTS: ModalCorps Component
   This includes only few corporations. Changes to the states are made immediately right
   after corp is selected. These effects are added to the data -> corporations -> effects only
   to show them in the corp effects list. Changing name of the constants won't affect performing
   the effect here.

LIST OF ALL CARDS' ACTIONS:         ModalCardWithAction Component
   This includes actions for ALL (non-corporate) cards in the game.

LIST OF ALL EFFECTS:                ModalCardWithAction Component
   This includes all effects in game EXCEPT immediate effects from corporations, listed in the
   ModalCorps component => callImmediateEffect function.

LIST OF REQUIREMENTS:               Game component
   This includes all requirements: Cost, global parameters, tags, production, resources, board */

import { useReducer, createContext, useState } from 'react'
import { INIT_STATE_PLAYER } from '../../initStates/initStatePlayer'
import { INIT_STATE_GAME } from '../../initStates/initStateGame'
import { INIT_MODALS } from '../../initStates/initModals'
import { reducerGame } from '../../util/dispatchGame'
import { reducerPlayer } from '../../util/dispatchPlayer'
import { reducerBoard } from '../../util/dispatchBoard'
import { hasTag } from '../../util/misc'
import MenuIcon from './gameComponents/MenuIcon'
import PanelCorp from './gameComponents/panelCorp/PanelCorp'
import PanelStateGame from './gameComponents/PanelStateGame'
import StandardProjects from './gameComponents/StandardProjectsBtn'
import PassContainer from './gameComponents/passContainer/PassContainer'
import Board from './gameComponents/board/Board'
import Modals from './gameComponents/modals/Modals'
import { shuffledCorps, shuffledCards, randomBoard } from '../../App'
import '../../css/app.css'

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

   function requirementsMet(card) {
      let isAvailable = true
      // Check cost vs resources first
      if (resourcesForCard(card) < card.currentCost) {
         isAvailable = false
         return isAvailable
      }
      // Check other requirements
      card.requirements.forEach((req) => {
         // Global parameters requirements
         if (req.type === 'oxygen') {
            if (
               req.other === 'max' &&
               stateGame.globalParameters.oxygen - Math.abs(statePlayer.globParamReqModifier) >
                  req.value
            )
               isAvailable = false
            if (
               req.other === 'min' &&
               stateGame.globalParameters.oxygen + Math.abs(statePlayer.globParamReqModifier) <
                  req.value
            )
               isAvailable = false
         }
         if (req.type === 'temperature') {
            if (
               req.other === 'max' &&
               stateGame.globalParameters.temperature - Math.abs(statePlayer.globParamReqModifier) >
                  req.value
            )
               isAvailable = false
            if (
               req.other === 'min' &&
               stateGame.globalParameters.temperature + Math.abs(statePlayer.globParamReqModifier) <
                  req.value
            )
               isAvailable = false
         }
         if (req.type === 'oceans') {
            if (
               req.other === 'max' &&
               stateGame.globalParameters.oceans - Math.abs(statePlayer.globParamReqModifier) >
                  req.value
            )
               isAvailable = false
            if (
               req.other === 'min' &&
               stateGame.globalParameters.oceans + Math.abs(statePlayer.globParamReqModifier) <
                  req.value
            )
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
      if (statePlayer.canPayWithHeat) resources += statePlayer.resources.heat
      return resources
   }

   return (
      <div className="game">
         <StatePlayerContext.Provider value={{ statePlayer, dispatchPlayer }}>
            <StateGameContext.Provider value={{ stateGame, dispatchGame, requirementsMet }}>
               <StateBoardContext.Provider value={{ stateBoard, dispatchBoard }}>
                  <CorpsContext.Provider value={corps}>
                     <CardsContext.Provider value={{ cards, setCards }}>
                        <ModalsContext.Provider value={{ modals, setModals }}>
                           {!stateGame.phaseCorporation && !stateGame.phaseDraft && (
                              <StandardProjects />
                           )}
                           {!stateGame.phaseCorporation && <PanelStateGame />}
                           {!stateGame.phaseCorporation && <PanelCorp />}
                           {!stateGame.phaseCorporation && <PassContainer />}
                           <Board />
                           <Modals setGameOn={setGameOn} />
                           <MenuIcon />
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
