/* Used to view standard projects */

import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { ACTIONS_GAME } from '../../../../util/dispatchGame'
import { ACTIONS_PLAYER } from '../../../../util/dispatchPlayer'
import ModalSPaction from './modalsComponents/ModalSPaction'
import CardDecreaseCostSP from './modalsComponents/CardDecreaseCostSP'

const ModalStandardProjects = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame } = useContext(StateGameContext)
   const [toBuyHeat, setToBuyHeat] = useState(0)
   const [toBuyMln, setToBuyMln] = useState(initToBuyMln())
   const [actionClicked, setActionClicked] = useState(null)

   function initToBuyMln() {
      return [
         stateGame.SPCosts.sellPatent,
         stateGame.SPCosts.powerPlant.current,
         stateGame.SPCosts.asteroid,
         stateGame.SPCosts.aquifer,
         stateGame.SPCosts.greenery,
         stateGame.SPCosts.city,
      ]
   }

   const changeSPcosts = (operation, SP) => {
      let resHeat = toBuyHeat
      let resMln = toBuyMln
      if (operation === 'increment') {
         resHeat++
      } else if (operation === 'decrement') {
         resHeat--
      }
      resMln = initToBuyMln()
      switch (SP) {
         case 'POWER PLANT':
            resMln[1] = Math.max(stateGame.SPCosts.powerPlant.current - resHeat, 0)
            if (resHeat > stateGame.SPCosts.powerPlant.current)
               resHeat = stateGame.SPCosts.powerPlant.current
            break
         case 'ASTEROID':
            resMln[2] = Math.max(stateGame.SPCosts.asteroid - resHeat, 0)
            if (resHeat > stateGame.SPCosts.asteroid) resHeat = stateGame.SPCosts.asteroid
            break
         case 'AQUIFER':
            resMln[3] = Math.max(stateGame.SPCosts.aquifer - resHeat, 0)
            if (resHeat > stateGame.SPCosts.aquifer) resHeat = stateGame.SPCosts.aquifer
            break
         case 'GREENERY':
            resMln[4] = Math.max(stateGame.SPCosts.greenery - resHeat, 0)
            if (resHeat > stateGame.SPCosts.greenery) resHeat = stateGame.SPCosts.greenery
            break
         case 'CITY':
            resMln[5] = Math.max(stateGame.SPCosts.city - resHeat, 0)
            if (resHeat > stateGame.SPCosts.city) resHeat = stateGame.SPCosts.city
            break
         default:
            break
      }
      setToBuyHeat(resHeat)
      setToBuyMln(resMln)
   }

   const handleUseSP = (name) => {
      dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
      switch (name) {
         case 'POWER PLANT':
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[1] })
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_POWER, payload: 1 })
            break
         case 'ASTEROID':
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[2] })
            if (stateGame.globalParameters.temperature < 8)
               dispatchGame({ type: ACTIONS_GAME.INCREMENT_TEMPERATURE })
            break
         case 'AQUIFER':
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[3] })
            break
         case 'GREENERY':
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[4] })
            break
         case 'CITY':
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[5] })
            break
         default:
            break
      }
      setModals({ ...modals, confirmation: false, standardProjects: false })
   }

   return (
      <>
         <div
            className={`modal-other-sp-container full-size
               ${(modals.confirmation || modals.sellCards) && 'display-none'}
            `}
            onClick={() => setModals({ ...modals, standardProjects: false })}
         >
            <div className="modal-other-sp center" onClick={(e) => e.stopPropagation()}>
               {/* HEADER */}
               <div className="modal-other-sp-header">STANDARD PROJECTS</div>
               {/* CLOSE BUTTON */}
               <div
                  className="modal-other-sp-close-btn pointer"
                  onClick={() => setModals({ ...modals, standardProjects: false })}
               >
                  X
               </div>
               {/* ACTIONS */}
               <ModalSPaction
                  icon={{ url: '' }}
                  name="SELL PATENT"
                  cost={toBuyMln[0]}
                  textConfirmation=""
                  handleUseSP={handleUseSP}
               />
               <ModalSPaction
                  icon={{ url: '' }}
                  name="POWER PLANT"
                  cost={toBuyMln[1]}
                  textConfirmation="Do you want to build a power plant?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
               />
               <ModalSPaction
                  icon={{ url: '' }}
                  name="ASTEROID"
                  cost={toBuyMln[2]}
                  textConfirmation="Do you want to use the asteroid project?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
               />
               <ModalSPaction
                  icon={{ url: '' }}
                  name="AQUIFER"
                  cost={toBuyMln[3]}
                  textConfirmation="Do you want to build an aquifer?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
               />
               <ModalSPaction
                  icon={{ url: '' }}
                  name="GREENERY"
                  cost={toBuyMln[4]}
                  textConfirmation="Do you want to build a greenery?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
               />
               <ModalSPaction
                  icon={{ url: '' }}
                  name="CITY"
                  cost={toBuyMln[5]}
                  textConfirmation="Do you want to build a city?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
               />
               {actionClicked !== null &&
                  statePlayer.resources.heat > 0 &&
                  statePlayer.canPayWithHeat && (
                     <CardDecreaseCostSP
                        toBuyMln={toBuyMln}
                        toBuyHeat={toBuyHeat}
                        changeSPcosts={changeSPcosts}
                        actionClicked={actionClicked}
                     />
                  )}
            </div>
         </div>
      </>
   )
}

export default ModalStandardProjects
