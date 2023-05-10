import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, StateBoardContext, ModalsContext, UserContext } from '../../../../game'
import { SoundContext } from '../../../../../App'
import FieldBonus from './FieldBonus'
import FieldLine from './FieldLine'
import { ACTIONS_PLAYER } from '../../../../../stateActions/actionsPlayer'
import { ACTIONS_GAME } from '../../../../../stateActions/actionsGame'
import { ACTIONS_BOARD } from '../../../../../stateActions/actionsBoard'
import { TILES, assignIconToTileData } from '../../../../../data/board'
import { ANIMATIONS, endAnimation, getAnimNameBasedOnBonus, setAnimation, startAnimation } from '../../../../../data/animations'
import { getCards, getNeighbors, getNewCardsDrawIds, modifiedCards, updateVP, withTimeAdded } from '../../../../../utils/misc'
import { funcSetLogItemsSingleActions } from '../../../../../data/log/log'
import { RESOURCES } from '../../../../../data/resources'
import { CORP_NAMES } from '../../../../../data/corpNames'
import { EFFECTS } from '../../../../../data/effects/effectIcons'
import { IMM_EFFECTS } from '../../../../../data/immEffects/immEffects'
import { CARDS } from '../../../../../data/cards'
import { getResIcon } from '../../../../../data/resources'

const Field = ({ field, setTotalVP, showCoordinates }) => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, getImmEffects, getEffect, ANIMATION_SPEED, setLogItems } = useContext(StateGameContext)
   const { stateBoard, dispatchBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)
   const styles = {
      left: field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN' ? '50%' : `calc(var(--field-width) * 0.05 + (var(--field-width) * 0.538) * ${field.y})`,
      top: field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN' ? '50%' : `calc(var(--field-height) * 1.8 + (var(--field-height) * 1.615) * ${field.x})`,
      transform: field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN' ? 'translate(-50%, -50%)' : 'translate(0, 0)',
   }
   const logDescription = field.name ? field.name : `THARSIS at coordinates x: ${field.x}, y: ${field.y}`

   const handleClickField = async () => {
      // If clicked on unavailable field, do nothing
      if (!field.available) return
      // Set field's object to phasePlaceTileData
      sound.objectPut.play()
      dispatchBoard({
         type: ACTIONS_BOARD.SET_OBJECT,
         payload: { x: field.x, y: field.y, name: field.name, obj: stateGame.phasePlaceTileData },
      })
      funcSetLogItemsSingleActions(
         `${stateGame.phasePlaceTileData} tile has been placed on ${logDescription}`,
         assignIconToTileData(stateGame.phasePlaceTileData),
         null,
         setLogItems
      )
      if (modals.modalCard?.id === 20 || modals.modalCard?.id === 128 || modals.modalCard?.id === 200) {
         funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
      }
      // Get Random Cards Ids
      let newCardsDrawIds
      if (field.bonus.includes(RESOURCES.CARD)) {
         newCardsDrawIds = await getNewCardsDrawIds(field.bonus.length, statePlayer, dispatchPlayer, type, id, user?.token)
      }

      // Turn phasePlaceTile off
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA, payload: null })
      // Receive tile bonus
      let newPlants = statePlayer.resources.plant
      let uniqBonuses = [...new Set(field.bonus)]
      if (uniqBonuses.length > 0) {
         // Start Animation
         startAnimation(setModals)
         for (let i = 0; i < uniqBonuses.length; i++) {
            const countBonus = field.bonus.reduce((total, value) => (value === uniqBonuses[i] ? total + 1 : total), 0)
            const animName = getAnimNameBasedOnBonus(uniqBonuses[i])
            setTimeout(() => setAnimation(animName, uniqBonuses[i], countBonus, setModals, sound), i * ANIMATION_SPEED)
            // Execute bonus action
            // eslint-disable-next-line
            setTimeout(() => {
               switch (uniqBonuses[i]) {
                  case RESOURCES.STEEL:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_STEEL, payload: countBonus })
                     funcSetLogItemsSingleActions(`Received ${countBonus} steel from board`, getResIcon(RESOURCES.STEEL), countBonus, setLogItems)
                     break
                  case RESOURCES.TITAN:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: countBonus })
                     funcSetLogItemsSingleActions(`Received ${countBonus} titanium from board`, getResIcon(RESOURCES.TITAN), countBonus, setLogItems)
                     break
                  case RESOURCES.PLANT:
                     newPlants += countBonus
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: countBonus })
                     funcSetLogItemsSingleActions(
                        countBonus === 1 ? 'Received 1 plant from board' : `Received ${countBonus} plants from board`,
                        getResIcon(RESOURCES.PLANT),
                        countBonus,
                        setLogItems
                     )
                     break
                  case RESOURCES.CARD:
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                        payload: [...statePlayer.cardsInHand, ...modifiedCards(withTimeAdded(getCards(CARDS, newCardsDrawIds)), statePlayer)],
                     })
                     dispatchPlayer({
                        type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                        payload: [...statePlayer.cardsSeen, ...getCards(CARDS, newCardsDrawIds)],
                     })
                     funcSetLogItemsSingleActions(
                        field.bonus.length === 1 ? 'Drew 1 card from board' : `Drew ${field.bonus.length} cards from board`,
                        getResIcon(RESOURCES.CARD),
                        field.bonus.length,
                        setLogItems
                     )
                     break
                  default:
                     break
               }
            }, (i + 1) * ANIMATION_SPEED)
            // End animation
            if (i === uniqBonuses.length - 1) setTimeout(() => endAnimation(setModals), uniqBonuses.length * ANIMATION_SPEED)
         }
      }

      let delay = uniqBonuses.length * ANIMATION_SPEED

      // Receive mln for ocean bonus
      let bonusMln
      const oceanNeighbors = getNeighbors(field.x, field.y, stateBoard).filter((nb) => nb.object === TILES.OCEAN)
      if (oceanNeighbors.length) {
         bonusMln = oceanNeighbors.length * 2
         setTimeout(() => {
            startAnimation(setModals)
            setAnimation(ANIMATIONS.RESOURCES_IN, RESOURCES.MLN, bonusMln, setModals, sound)
         }, delay)
         delay += ANIMATION_SPEED
         setTimeout(() => {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_MLN, payload: bonusMln })
            endAnimation(setModals)
         }, delay)
      }

      // Receive steel / titan prod if stateGame.phasePlaceTileData is mining rights or mining area
      if (stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_RIGHTS || stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_AREA) {
         let actionSteel = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               funcSetLogItemsSingleActions('Steel production increased by 1', [getResIcon(RESOURCES.PROD_BG), getResIcon(RESOURCES.STEEL)], 1, setLogItems)
            },
         }

         let actionTitan = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [getResIcon(RESOURCES.PROD_BG), getResIcon(RESOURCES.TITAN)], 1, setLogItems)
            },
         }

         if (field.bonus.includes(RESOURCES.STEEL)) {
            // Add this action to modals.modalProduction.miningRights / miningArea
            stateGame.phasePlaceTileData === TILES.SPECIAL_MINING_RIGHTS
               ? setModals((prev) => ({
                    ...prev,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningRights: actionSteel,
                    },
                 }))
               : setModals((prev) => ({
                    ...prev,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningArea: actionSteel,
                    },
                 }))
            // Animation
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.STEEL, 1, setModals, sound)
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
               ? setModals((prev) => ({
                    ...prev,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningRights: actionTitan,
                    },
                 }))
               : setModals((prev) => ({
                    ...prev,
                    modalProduction: {
                       ...modals.modalProduction,
                       miningArea: actionTitan,
                    },
                 }))
            // Animation
            setTimeout(() => {
               startAnimation(setModals)
               setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.TITAN, 1, setModals, sound)
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
      if ((field.bonus.includes(RESOURCES.STEEL) || field.bonus.includes(RESOURCES.TITAN)) && statePlayer.corporation.name === CORP_NAMES.MINING_GUILD) {
         setTimeout(() => {
            startAnimation(setModals)
            setAnimation(ANIMATIONS.PRODUCTION_IN, RESOURCES.STEEL, 1, setModals, sound)
         }, delay)
         delay += ANIMATION_SPEED
         setTimeout(() => {
            dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
            funcSetLogItemsSingleActions('Steel production increased by 1 from MINING GUILD effect', [getResIcon(RESOURCES.PROD_BG), getResIcon(RESOURCES.STEEL)], 1, setLogItems)
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
               // Modify Cards In Hand
               let newCards = modifiedCards(
                  !field.bonus.includes(RESOURCES.CARD) ? statePlayer.cardsInHand : [...statePlayer.cardsInHand, ...withTimeAdded(getCards(CARDS, newCardsDrawIds))],
                  statePlayer,
                  EFFECTS.EFFECT_RESEARCH_OUTPOST
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               // Modify Cards Played
               newCards = modifiedCards(statePlayer.cardsPlayed, statePlayer, EFFECTS.EFFECT_RESEARCH_OUTPOST)
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
            // If there are still enough plants to convert
            if (newPlants >= statePlayer.valueGreenery) {
               // Decrease plants
               startAnimation(setModals)
               setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.PLANT, statePlayer.valueGreenery, setModals, sound)
               setTimeout(() => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })
                  funcSetLogItemsSingleActions(
                     `Paid ${statePlayer.valueGreenery} plants in the final plant conversion phase`,
                     getResIcon(RESOURCES.PLANT),
                     -statePlayer.valueGreenery,
                     setLogItems
                  )
                  endAnimation(setModals)
               }, ANIMATION_SPEED)

               // // Decrease plants
               // dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })

               // Proper action + potential Herbivores
               let actions = [...stateGame.actionsLeft, ...getImmEffects(IMM_EFFECTS.GREENERY_WO_OX)]
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
               setTimeout(() => {
                  performSubActions(actions)
               }, ANIMATION_SPEED)
            } else {
               performSubActions([
                  ...stateGame.actionsLeft,
                  {
                     name: ANIMATIONS.USER_INTERACTION,
                     type: null,
                     value: null,
                     func: () => {
                        setModals((prev) => ({ ...prev, endStats: true }))
                        updateVP(statePlayer, dispatchPlayer, stateGame, stateBoard, setTotalVP, true)
                     },
                  },
               ])
            }
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
            {field.object && <img src={assignIconToTileData(field.object)} className="field-object" alt={field.object}></img>}
         </div>
         {/* Container Extensions */}
         <div className="field-extension field-extension top"></div>
         <div className="field-extension field-extension bottom"></div>
         {/* Coordinates */}
         {showCoordinates && (
            <div className="coordinates">
               (x: {field.x}, y: {field.y})
            </div>
         )}
      </div>
   )
}

export default Field
