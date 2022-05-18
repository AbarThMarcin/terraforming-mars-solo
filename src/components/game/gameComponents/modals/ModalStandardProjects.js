/* Used to view standard projects */

import { useState, useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../Game'
import { IMM_EFFECTS } from '../../../../data/immEffects/immEffects'
import { ACTIONS_PLAYER } from '../../../../util/actionsPlayer'
import ModalSPaction from './modalsComponents/ModalSPaction'
import CardDecreaseCostSP from './modalsComponents/CardDecreaseCostSP'
import { ACTIONS_GAME } from '../../../../util/actionsGame'
import { ANIMATIONS, endAnimation, setAnimation, startAnimation } from '../../../../data/animations'
import { RESOURCES } from '../../../../data/resources'
import { EFFECTS, getSPeffectsToCall } from '../../../../data/effects'
import { SP } from '../../../../data/StandardProjects'

const ModalStandardProjects = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, getImmEffects, getEffect, performSubActions, ANIMATION_SPEED } =
      useContext(StateGameContext)
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

   const changeSPcosts = (operation, Sp) => {
      let resHeat = toBuyHeat
      let resMln = toBuyMln
      if (operation === 'increment') {
         resHeat++
      } else if (operation === 'decrement') {
         resHeat--
      }
      resMln = initToBuyMln()
      switch (Sp) {
         case SP.POWER_PLANT:
            resMln[1] = Math.max(stateGame.SPCosts.powerPlant.current - resHeat, 0)
            if (resHeat > stateGame.SPCosts.powerPlant.current)
               resHeat = stateGame.SPCosts.powerPlant.current
            break
         case SP.ASTEROID:
            resMln[2] = Math.max(stateGame.SPCosts.asteroid - resHeat, 0)
            if (resHeat > stateGame.SPCosts.asteroid) resHeat = stateGame.SPCosts.asteroid
            break
         case SP.AQUIFER:
            resMln[3] = Math.max(stateGame.SPCosts.aquifer - resHeat, 0)
            if (resHeat > stateGame.SPCosts.aquifer) resHeat = stateGame.SPCosts.aquifer
            break
         case SP.GREENERY:
            resMln[4] = Math.max(stateGame.SPCosts.greenery - resHeat, 0)
            if (resHeat > stateGame.SPCosts.greenery) resHeat = stateGame.SPCosts.greenery
            break
         case SP.CITY:
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
      let animResPaidTypes = []
      if (toBuyMln[btnClickedId] !== 0)
         animResPaidTypes.push([RESOURCES.MLN, toBuyMln[btnClickedId]])
      if (toBuyHeat) animResPaidTypes.push([RESOURCES.HEAT, toBuyHeat])
      setModals((prevModals) => ({
         ...prevModals,
         confirmation: false,
         standardProjects: false,
         sellCards: false,
      }))
      // ------------------------ ANIMATIONS ------------------------
      startAnimation(setModals)
      for (let i = 0; i < animResPaidTypes.length; i++) {
         setTimeout(() => {
            setAnimation(
               ANIMATIONS.RESOURCES_OUT,
               animResPaidTypes[i][0],
               animResPaidTypes[i][1],
               setModals
            )
         }, i * ANIMATION_SPEED)
      }
      setTimeout(() => {
         endAnimation(setModals)
         // Decrease heat (Helion only)
         dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_HEAT, payload: -toBuyHeat })
         // Decrease corporation resources, perform actions and call effects
         let actions = []
         let spEffects = []
         switch (name) {
            case SP.POWER_PLANT:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[1] })
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.POWER_PLANT)
               // Possible effect for SP Power Plant (standard technology)
               if (
                  statePlayer.cardsPlayed.some(
                     (card) => card.effect === EFFECTS.EFFECT_STANDARD_TECHNOLOGY
                  )
               )
                  actions = [...actions, ...getEffect(EFFECTS.EFFECT_STANDARD_TECHNOLOGY)]
               break
            case SP.ASTEROID:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[2] })
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.TEMPERATURE)
               // Possible effect for SP Asteroid (standard technology)
               if (
                  statePlayer.cardsPlayed.some(
                     (card) => card.effect === EFFECTS.EFFECT_STANDARD_TECHNOLOGY
                  )
               )
                  actions = [...actions, ...getEffect(EFFECTS.EFFECT_STANDARD_TECHNOLOGY)]
               // Possible effects for placing ocean, if increasing temp gets the ocean bonus
               if (
                  stateGame.globalParameters.temperature === -2 &&
                  stateGame.globalParameters.oceans < 9
               ) {
                  if (
                     statePlayer.cardsPlayed.some(
                        (card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE
                     )
                  )
                     actions = [...actions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
               }
               break
            case SP.AQUIFER:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[3] })
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.AQUIFER)
               // Possible effects for placing ocean
               spEffects = getSPeffectsToCall(SP.AQUIFER)
               spEffects.forEach((spEffect) => {
                  if (
                     statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                     statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
                  )
                     actions = [...actions, ...getEffect(spEffect)]
               })
               break
            case SP.GREENERY:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[4] })
               // Proper action
               actions = getImmEffects(IMM_EFFECTS.GREENERY)
               // Possible effects for placing greenery
               spEffects = getSPeffectsToCall(SP.GREENERY)
               spEffects.forEach((spEffect) => {
                  if (
                     statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                     statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
                  )
                     actions = [...actions, ...getEffect(spEffect)]
               })
               // Possible effects for placing ocean if placing greenery gets the ocean bonus (7% ox, -2 temp, 8- oceans)
               if (
                  stateGame.globalParameters.oxygen === 7 &&
                  stateGame.globalParameters.temperature === -2 &&
                  stateGame.globalParameters.oceans < 9
               ) {
                  if (
                     statePlayer.cardsPlayed.some(
                        (card) => card.effect === EFFECTS.EFFECT_ARCTIC_ALGAE
                     )
                  )
                     actions = [...actions, ...getEffect(EFFECTS.EFFECT_ARCTIC_ALGAE)]
               }
               break
            case SP.CITY:
               // Cost
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: -toBuyMln[5] })
               // Proper action No 1: 1 mln production
               actions.push({
                  name: ANIMATIONS.PRODUCTION_IN,
                  type: RESOURCES.MLN,
                  value: 1,
                  func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_MLN, payload: 1 }),
               })
               // Proper action No 2:
               actions = [...actions, ...getImmEffects(IMM_EFFECTS.CITY)]
               // Possible effects for placing city
               spEffects = getSPeffectsToCall(SP.CITY)
               spEffects.forEach((spEffect) => {
                  if (
                     statePlayer.cardsPlayed.some((card) => card.effect === spEffect) ||
                     statePlayer.corporation.effects.some((corpEffect) => corpEffect === spEffect)
                  )
                     actions = [...actions, ...getEffect(spEffect)]
               })
               break
            default:
               break
         }
         dispatchGame({ type: ACTIONS_GAME.SET_ACTIONSLEFT, payload: actions })
         performSubActions(actions)
      }, animResPaidTypes.length * ANIMATION_SPEED)
   }

   return (
      <>
         <div
            className={`modal-standard-projects-bg full-size
               ${(modals.confirmation || modals.sellCards) && 'display-none'}
            `}
            onClick={() => setModals({ ...modals, standardProjects: false })}
         >
            <div
               className="modal-standard-projects-box center"
               onClick={(e) => e.stopPropagation()}
            >
               {/* HEADER */}
               <div className="modal-standard-projects-box-header">STANDARD PROJECTS</div>
               {/* CLOSE BUTTON */}
               <div
                  className="modal-standard-projects-box-close-btn pointer"
                  onClick={() => setModals({ ...modals, standardProjects: false })}
               >
                  X
               </div>
               {/* ACTIONS */}
               <ModalSPaction
                  id={0}
                  icon={{ url: '' }}
                  name={SP.SELL_PATENT}
                  cost={toBuyMln[0]}
                  textConfirmation=""
                  handleUseSP={handleUseSP}
                  setBtnClickedId={setBtnClickedId}
               />
               <ModalSPaction
                  id={1}
                  icon={{ url: '' }}
                  name={SP.POWER_PLANT}
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
                  name={SP.ASTEROID}
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
                  name={SP.AQUIFER}
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
                  name={SP.GREENERY}
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
                  name={SP.CITY}
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
