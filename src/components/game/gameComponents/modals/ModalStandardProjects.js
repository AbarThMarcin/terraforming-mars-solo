/* Used to view standard projects */

import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { ACTIONS } from '../../../../data/actions'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalSPaction from './modalsComponents/ModalSPaction'
import CardDecreaseCostSP from './modalsComponents/CardDecreaseCostSP'
import { INIT_ANIMATION_DATA } from '../../../../initStates/initModals'

const ModalStandardProjects = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, performActions, ANIMATION_SPEED } = useContext(StateGameContext)
   const [toBuyHeat, setToBuyHeat] = useState(0)
   const [toBuyMln, setToBuyMln] = useState(initToBuyMln())
   const [btnClickedId, setBtnClickedId] = useState(-1)
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
      // ------------------------ ANIMATIONS ------------------------
      let animResPaidTypes = []
      if (toBuyMln[btnClickedId] !== 0) animResPaidTypes.push(['mln', toBuyMln[btnClickedId]])
      if (toBuyHeat) animResPaidTypes.push(['heat', toBuyHeat])
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setModals({
               ...modals,
               confirmation: false,
               standardProjects: false,
               sellCards: false,
               animationData: {
                  ...modals.animationData,
                  resourcesOut: {
                     type: animResPaidTypes[i][0],
                     value: animResPaidTypes[i][1],
                  },
               },
               animation: true,
            })
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         // Close modals
         setModals({
            ...modals,
            confirmation: false,
            standardProjects: false,
            sellCards: false,
            animationData: INIT_ANIMATION_DATA,
            animation: false,
         })
         // Decrease heat (Helion only)
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         // Decrease corporation resources, perform actions and call effects
         switch (name) {
            case 'POWER PLANT':
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[1] })
               performActions(ACTIONS.SP_POWER_PLANT)
               break
            case 'ASTEROID':
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[2] })
               performActions(ACTIONS.SP_ASTEROID)
               break
            case 'AQUIFER':
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[3] })
               performActions(ACTIONS.SP_AQUIFER)
               break
            case 'GREENERY':
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[4] })
               performActions(ACTIONS.SP_GREENERY)
               break
            case 'CITY':
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[5] })
               performActions(ACTIONS.SP_CITY)
               break
            default:
               break
         }
      }, animResPaidTypes.length * ANIMATION_SPEED)
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
                  id={0}
                  icon={{ url: '' }}
                  name="SELL PATENT"
                  cost={toBuyMln[0]}
                  textConfirmation=""
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
               />
               <ModalSPaction
                  id={1}
                  icon={{ url: '' }}
                  name="POWER PLANT"
                  cost={toBuyMln[1]}
                  textConfirmation="Do you want to build a power plant?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
               />
               <ModalSPaction
                  id={2}
                  icon={{ url: '' }}
                  name="ASTEROID"
                  cost={toBuyMln[2]}
                  textConfirmation="Do you want to use the asteroid project?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
               />
               <ModalSPaction
                  id={3}
                  icon={{ url: '' }}
                  name="AQUIFER"
                  cost={toBuyMln[3]}
                  textConfirmation="Do you want to build an aquifer?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
               />
               <ModalSPaction
                  id={4}
                  icon={{ url: '' }}
                  name="GREENERY"
                  cost={toBuyMln[4]}
                  textConfirmation="Do you want to build a greenery?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
               />
               <ModalSPaction
                  id={5}
                  icon={{ url: '' }}
                  name="CITY"
                  cost={toBuyMln[5]}
                  textConfirmation="Do you want to build a city?"
                  actionClicked={actionClicked}
                  setActionClicked={setActionClicked}
                  changeSPcosts={changeSPcosts}
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
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
