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
import { ACTIONS_PLAYER } from '../../../../../util/actionsPlayer'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'
import { ACTIONS_BOARD } from '../../../../../util/actionsBoard'
import { TILES } from '../../../../../data/board'
import {
   ANIMATIONS,
   endAnimation,
   getAnimNameBasedOnBonus,
   setAnimation,
   startAnimation,
} from '../../../../../data/animations'
import { getNeighbors, modifiedCards } from '../../../../../util/misc'
import { RESOURCES } from '../../../../../data/resources'

import city from '../../../../../assets/images/objects/city.png'
import cityNeutral from '../../../../../assets/images/objects/cityNeutral.png'
import greenery from '../../../../../assets/images/objects/greenery.png'
import greeneryNeutral from '../../../../../assets/images/objects/greeneryNeutral.png'
import ocean from '../../../../../assets/images/objects/ocean.png'
import cityCapital from '../../../../../assets/images/objects/cityCapital.png'
import miningRightsArea from '../../../../../assets/images/objects/miningRightsArea.png'
import ecologicalZone from '../../../../../assets/images/objects/ecologicalZone.png'
import naturalPreserve from '../../../../../assets/images/objects/naturalPreserve.png'
import moholeArea from '../../../../../assets/images/objects/moholeArea.png'
import restrictedArea from '../../../../../assets/images/objects/restrictedArea.png'
import commercialDistrict from '../../../../../assets/images/objects/commercialDistrict.png'
import nuclearZone from '../../../../../assets/images/objects/nuclearZone.png'
import industrialCenter from '../../../../../assets/images/objects/industrialCenter.png'
import lavaFlows from '../../../../../assets/images/objects/lavaFlows.png'

const Field = ({ field }) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, ANIMATION_SPEED } =
      useContext(StateGameContext)
   const { cards, setCards } = useContext(CardsContext)
   const { stateBoard, dispatchBoard } = useContext(StateBoardContext)
   const { setModals } = useContext(ModalsContext)
   const styles = {
      left:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? '50%'
            : `calc(var(--field-height) * 0.1 + (var(--field-width) * 0.537) * ${field.y})`,
      top:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? '50%'
            : `calc(var(--field-height) * 1.48 + (var(--field-height) * 1.61) * ${field.x})`,
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
      // Turn phasePlaceTile off
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA, payload: null })
      // Receive tile bonus
      let uniqBonuses = [...new Set(field.bonus)]
      if (uniqBonuses.length > 0) {
         // Start Animation
         startAnimation(setModals)
         for (let i = 0; i < uniqBonuses.length; i++) {
            const countBonus = field.bonus.reduce(
               (arr, value) => (value === uniqBonuses[i] ? arr + 1 : arr),
               0
            )
            const animName = getAnimNameBasedOnBonus(uniqBonuses[i])
            setTimeout(
               () => setAnimation(animName, uniqBonuses[i], countBonus, setModals),
               i * ANIMATION_SPEED
            )
            // Execute bonus action
            setTimeout(() => {
               switch (uniqBonuses[i]) {
                  case RESOURCES.STEEL:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: countBonus })
                     break
                  case RESOURCES.TITAN:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: countBonus })
                     break
                  case RESOURCES.PLANT:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: countBonus })
                     break
                  case RESOURCES.CARD:
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: [
                           ...statePlayer.cardsInHand,
                           ...modifiedCards(cards.slice(0, countBonus), statePlayer),
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
         if (field.bonus.includes(RESOURCES.STEEL)) {
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.STEEL, 1, setModals)
            }, delay)
            delay += ANIMATION_SPEED
            setTimeout(() => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               endAnimation(setModals)
            }, delay)
         } else if (field.bonus.includes(RESOURCES.TITAN)) {
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.TITAN, 1, setModals)
            }, delay)
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
         statePlayer.corporation.name === 'Mining Guild'
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

      // Proper action
      setTimeout(() => {
         // Continue performing actions/effects
         startAnimation(setModals)
         performSubActions(stateGame.actionsLeft)
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
