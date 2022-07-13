import { useContext } from 'react'
import {
   StatePlayerContext,
   StateGameContext,
   CardsContext,
   StateBoardContext,
   ModalsContext,
} from '../../../Game'
import FieldBonus from './FieldBonus'
import FieldLine from './FieldLine'
import { ACTIONS_PLAYER } from '../../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import { ACTIONS_BOARD } from '../../../../../stateActions/actionsBoard'
import { TILES } from '../../../../../data/board'
import {
   ANIMATIONS,
   endAnimation,
   getAnimNameBasedOnBonus,
   setAnimation,
   startAnimation,
} from '../../../../../data/animations'
import {
   getNeighbors,
   modifiedCards,
   withTimeAdded,
   withTimePlayed,
} from '../../../../../utils/misc'
import { RESOURCES } from '../../../../../data/resources'

import city from '../../../../../assets/images/tiles/city.svg'
import cityNeutral from '../../../../../assets/images/tiles/cityNeutral.svg'
import greenery from '../../../../../assets/images/tiles/greenery.svg'
import greeneryNeutral from '../../../../../assets/images/tiles/greeneryNeutral.svg'
import ocean from '../../../../../assets/images/tiles/ocean.svg'
import cityCapital from '../../../../../assets/images/tiles/cityCapital.svg'
import miningRightsArea from '../../../../../assets/images/tiles/miningRightsArea.svg'
import ecologicalZone from '../../../../../assets/images/tiles/ecologicalZone.svg'
import naturalPreserve from '../../../../../assets/images/tiles/naturalPreserve.svg'
import moholeArea from '../../../../../assets/images/tiles/moholeArea.svg'
import restrictedArea from '../../../../../assets/images/tiles/restrictedArea.svg'
import commercialDistrict from '../../../../../assets/images/tiles/commercialDistrict.svg'
import nuclearZone from '../../../../../assets/images/tiles/nuclearZone.svg'
import industrialCenter from '../../../../../assets/images/tiles/industrialCenter.svg'
import lavaFlows from '../../../../../assets/images/tiles/lavaFlows.svg'
import { CORP_NAMES } from '../../../../../data/corpNames'
import { EFFECTS } from '../../../../../data/effects'
import { LOG_TYPES } from '../../../../../data/log'
import { IMM_EFFECTS } from '../../../../../data/immEffects/immEffects'

const Field = ({ field }) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const {
      stateGame,
      dispatchGame,
      logItems,
      setLogItems,
      performSubActions,
      getImmEffects,
      getEffect,
      ANIMATION_SPEED,
   } = useContext(StateGameContext)
   const { cards, setCards } = useContext(CardsContext)
   const { stateBoard, dispatchBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const styles = {
      left:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? '50%'
            : `calc(var(--field-width) * 0.05 + (var(--field-width) * 0.538) * ${field.y})`,
      top:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? '50%'
            : `calc(var(--field-height) * 1.8 + (var(--field-height) * 1.615) * ${field.x})`,
      transform:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? 'translate(-50%, -50%)'
            : 'translate(0, 0)',
   }

   const handleClickField = () => {
      // If clicked on unavailable field, do nothing
      if (!field.available) return
      // Set field's object to phasePlaceTileData
      dispatchBoard({
         type: ACTIONS_BOARD.SET_OBJECT,
         payload: { x: field.x, y: field.y, name: field.name, obj: stateGame.phasePlaceTileData },
      })
      // Update log for Forced Action of Tharsis
      if (logItems.length === 2 && statePlayer.corporation.name === CORP_NAMES.THARSIS_REPUBLIC)
         setLogItems((currentLogItems) => [
            ...currentLogItems,
            { type: LOG_TYPES.FORCED_ACTION, data: { text: CORP_NAMES.THARSIS_REPUBLIC } },
         ])
      // Turn phasePlaceTile off
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA, payload: null })
      // Receive tile bonus
      let uniqBonuses = [...new Set(field.bonus)]
      let newPlants = statePlayer.resources.plant
      if (uniqBonuses.length > 0) {
         // Start Animation
         startAnimation(setModals)
         for (let i = 0; i < uniqBonuses.length; i++) {
            const countBonus = field.bonus.reduce(
               (total, value) => (value === uniqBonuses[i] ? total + 1 : total),
               0
            )
            const animName = getAnimNameBasedOnBonus(uniqBonuses[i])
            setTimeout(
               () => setAnimation(animName, uniqBonuses[i], countBonus, setModals),
               i * ANIMATION_SPEED
            )
            // Execute bonus action
            // eslint-disable-next-line
            setTimeout(() => {
               switch (uniqBonuses[i]) {
                  case RESOURCES.STEEL:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: countBonus })
                     break
                  case RESOURCES.TITAN:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: countBonus })
                     break
                  case RESOURCES.PLANT:
                     newPlants += countBonus
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: countBonus })
                     break
                  case RESOURCES.CARD:
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: [
                           ...statePlayer.cardsInHand,
                           ...modifiedCards(withTimeAdded(cards.slice(0, countBonus)), statePlayer),
                        ],
                     })
                     setCards(cards.slice(countBonus))
                     break
                  default:
                     break
               }
            }, (i + 1) * ANIMATION_SPEED)
            // End animation
            if (i === uniqBonuses.length - 1)
               setTimeout(() => endAnimation(setModals), uniqBonuses.length * ANIMATION_SPEED)
         }
      }

      let delay = uniqBonuses.length * ANIMATION_SPEED

      // Receive mln for ocean bonus
      let bonusMln
      const oceanNeighbors = getNeighbors(field.x, field.y, stateBoard).filter(
         (nb) => nb.object === TILES.OCEAN
      )
      if (oceanNeighbors.length) {
         bonusMln = oceanNeighbors.length * 2
         setTimeout(() => {
            startAnimation(setModals)
            setAnimation(ANIMATIONS.RESOURCES_IN, RESOURCES.MLN, bonusMln, setModals)
         }, delay)
         delay += ANIMATION_SPEED
         setTimeout(() => {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: bonusMln })
            endAnimation(setModals)
         }, delay)
      }

      // Receive steel / titan prod if stateGame.phasePlaceTileData is mining rights or mining area
      if (
         stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_RIGHTS ||
         stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_AREA
      ) {
         let actionSteel = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 }),
         }

         let actionTitan = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 }),
         }

         if (field.bonus.includes(RESOURCES.STEEL)) {
            // Add this action to modals.modalProduction.miningRights / miningArea
            stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_RIGHTS
               ? setModals((prevModals) => ({
                    ...prevModals,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningRights: actionSteel,
                    },
                 }))
               : setModals((prevModals) => ({
                    ...prevModals,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningArea: actionSteel,
                    },
                 }))
            // Animation
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.STEEL, 1, setModals)
            }, delay)
            // Action
            delay += ANIMATION_SPEED
            setTimeout(() => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               endAnimation(setModals)
            }, delay)
         } else if (field.bonus.includes(RESOURCES.TITAN)) {
            // Add this action to modals.modalProduction.miningRights / miningArea
            stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_RIGHTS
               ? setModals((prevModals) => ({
                    ...prevModals,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningRights: actionTitan,
                    },
                 }))
               : setModals((prevModals) => ({
                    ...prevModals,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningArea: actionTitan,
                    },
                 }))
            // Animation
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.TITAN, 1, setModals)
            }, delay)
            // Action
            delay += ANIMATION_SPEED
            setTimeout(() => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               endAnimation(setModals)
            }, delay)
         }
      }

      // Receive steel prod if Mining Guild and field has steel/titan bonus
      if (
         (field.bonus.includes(RESOURCES.STEEL) || field.bonus.includes(RESOURCES.TITAN)) &&
         statePlayer.corporation.name === CORP_NAMES.MINING_GUILD
      ) {
         setTimeout(() => {
            startAnimation(setModals)
            setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.STEEL, 1, setModals)
         }, delay)
         delay += ANIMATION_SPEED
         setTimeout(() => {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
            endAnimation(setModals)
         }, delay)
      }

      // Perform Research Outpost effect (decrease cost of all cards by 1). The reason for putting here
      // instead of in immEffect is that when city of this card is put on card, effect of decreasing costs
      // doesn't include that card.
      if (modals.modalCard) {
         if (modals.modalCard.id === 20) {
            // Start animation
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.SHORT_ANIMATION, null, null, setModals)
            }, delay)
            delay += ANIMATION_SPEED / 2
            setTimeout(() => {
               // Proper action
               let newCards = field.bonus.includes(RESOURCES.CARD)
                  ? [
                       ...statePlayer.cardsInHand.filter((card) => card.id !== 20),
                       ...modifiedCards(
                          withTimeAdded(cards.slice(0, 1)),
                          statePlayer,
                          EFFECTS.EFFECT_RESEARCH_OUTPOST
                       ),
                    ]
                  : statePlayer.cardsInHand.filter((card) => card.id !== 20)
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               newCards = modifiedCards(
                  [
                     ...statePlayer.cardsPlayed,
                     ...withTimePlayed([statePlayer.cardsInHand.find((card) => card.id === 20)]),
                  ],
                  statePlayer,
                  EFFECTS.EFFECT_RESEARCH_OUTPOST
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               // End animation
               endAnimation(setModals)
            }, delay)
         }
      }

      setTimeout(() => {
         // If NOT Phase After Gen14 is on
         if (!stateGame.phaseAfterGen14) {
            // Continue performing actions/effects
            startAnimation(setModals)
            performSubActions(stateGame.actionsLeft)
         } else {
            setTimeout(() => {
               // If there are still enough plants to convert
               if (newPlants >= statePlayer.valueGreenery) {
                  // Decrease plants
                  dispatchPlayer({
                     type: ACTIONS_PLAYER.CHANGE_RES_PLANT,
                     payload: -statePlayer.valueGreenery,
                  })
                  // Proper action + potential Herbivores
                  let actions = getImmEffects(IMM_EFFECTS.GREENERY)
                  if (
                     statePlayer.cardsPlayed.some(
                        (card) => card.effect === EFFECTS.EFFECT_HERBIVORES
                     )
                  )
                     actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
                  performSubActions(actions, null, null)
               } else {
                  setModals((prevModals) => ({ ...prevModals, endStats: true }))
               }
            }, ANIMATION_SPEED / 2)
         }
      }, delay)
   }

   return (
      <div
         className={`
            field-container
            ${stateGame.phasePlaceTile && field.available && 'available'}
            ${stateGame.phasePlaceTile && field.available && 'pointer'}
         `}
         style={styles}
         onClick={handleClickField}
      >
         {/* Border */}
         <FieldLine field={field} lineNo={1} />
         <FieldLine field={field} lineNo={2} />
         <FieldLine field={field} lineNo={3} />
         <FieldLine field={field} lineNo={4} />
         <FieldLine field={field} lineNo={5} />
         <FieldLine field={field} lineNo={6} />
         {/* Data */}
         <div className="field-data center">
            {/* Field Name */}
            {field.name && !field.object && <div className="field-name">{field.name}</div>}
            {/* Field bonus */}
            {field.bonus.length > 0 && !field.object && (
               <div className="field-bonus-container">
                  {field.bonus.map((bonus, idx) => (
                     <FieldBonus key={idx} bonus={bonus} />
                  ))}
               </div>
            )}
            {/* Field Object */}
            {field.object === TILES.CITY && (
               <img src={city} className="field-object" alt={TILES.CITY}></img>
            )}
            {field.object === TILES.CITY_NEUTRAL && (
               <img src={cityNeutral} className="field-object" alt={TILES.CITY_NEUTRAL}></img>
            )}
            {field.object === TILES.GREENERY && (
               <img src={greenery} className="field-object" alt={TILES.GREENERY}></img>
            )}
            {field.object === TILES.GREENERY_NEUTRAL && (
               <img
                  src={greeneryNeutral}
                  className="field-object"
                  alt={TILES.GREENERY_NEUTRAL}
               ></img>
            )}
            {field.object === TILES.OCEAN && (
               <img src={ocean} className="field-object" alt={TILES.OCEAN}></img>
            )}
            {field.object === TILES.SPECIAL_CITY_CAPITAL && (
               <img
                  src={cityCapital}
                  className="field-object"
                  alt={TILES.SPECIAL_CITY_CAPITAL}
               ></img>
            )}
            {field.object === TILES.SPECIAL_MINING_RIGHTS && (
               <img
                  src={miningRightsArea}
                  className="field-object"
                  alt={TILES.SPECIAL_MINING_RIGHTS}
               ></img>
            )}
            {field.object === TILES.SPECIAL_MINING_AREA && (
               <img
                  src={miningRightsArea}
                  className="field-object"
                  alt={TILES.SPECIAL_MINING_AREA}
               ></img>
            )}
            {field.object === TILES.SPECIAL_ECOLOGICAL_ZONE && (
               <img
                  src={ecologicalZone}
                  className="field-object"
                  alt={TILES.SPECIAL_ECOLOGICAL_ZONE}
               ></img>
            )}
            {field.object === TILES.SPECIAL_NATURAL_PRESERVE && (
               <img
                  src={naturalPreserve}
                  className="field-object"
                  alt={TILES.SPECIAL_NATURAL_PRESERVE}
               ></img>
            )}
            {field.object === TILES.SPECIAL_MOHOLE_AREA && (
               <img src={moholeArea} className="field-object" alt={TILES.SPECIAL_MOHOLE_AREA}></img>
            )}
            {field.object === TILES.SPECIAL_RESTRICTED_AREA && (
               <img
                  src={restrictedArea}
                  className="field-object"
                  alt={TILES.SPECIAL_RESTRICTED_AREA}
               ></img>
            )}
            {field.object === TILES.SPECIAL_COMMERCIAL_DISTRICT && (
               <img
                  src={commercialDistrict}
                  className="field-object"
                  alt={TILES.SPECIAL_COMMERCIAL_DISTRICT}
               ></img>
            )}
            {field.object === TILES.SPECIAL_NUCLEAR_ZONE && (
               <img
                  src={nuclearZone}
                  className="field-object"
                  alt={TILES.SPECIAL_NUCLEAR_ZONE}
               ></img>
            )}
            {field.object === TILES.SPECIAL_INDUSTRIAL_CENTER && (
               <img
                  src={industrialCenter}
                  className="field-object"
                  alt={TILES.SPECIAL_INDUSTRIAL_CENTER}
               ></img>
            )}
            {field.object === TILES.SPECIAL_LAVA_FLOWS && (
               <img src={lavaFlows} className="field-object" alt={TILES.SPECIAL_LAVA_FLOWS}></img>
            )}
         </div>
         {/* Container Extensions */}
         <div className="field-extension field-extension top"></div>
         <div className="field-extension field-extension bottom"></div>
      </div>
   )
}

export default Field
