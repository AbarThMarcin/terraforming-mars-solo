import { useContext } from 'react'
import { ModalsContext, StateBoardContext, StateGameContext, StatePlayerContext, UserContext } from '../components/game'
import { SoundContext } from '../App'
import { funcSetLogItemsSingleActions, funcUpdateLogItemAction } from '../data/log'
import { ACTIONS_BOARD } from '../stateActions/actionsBoard'
import { ACTIONS_GAME } from '../stateActions/actionsGame'
import { RESOURCES } from '../data/resources'
import { ACTIONS_PLAYER } from '../stateActions/actionsPlayer'
import { ANIMATIONS, endAnimation, getAnimNameBasedOnBonus, setAnimation, startAnimation } from '../data/animations'
import { TILES } from '../data/board'
import { getCards, getCardsWithDecreasedCost, getCardsWithTimeAdded, getNewCardsDrawIds } from '../utils/cards'
import { getNeighbors } from '../utils/board'
import { CORP_NAMES } from '../data/corpNames'
import { EFFECTS } from '../data/effects/effectIcons'
import { IMM_EFFECTS } from '../data/immEffects/immEffects'
import { MATCH_TYPES } from '../data/app'
import { turnReplayActionOff } from '../utils/misc'
import { REPLAY_USERINTERACTIONS, replayData } from '../data/replay'

export const useSubactionTile = () => {
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { stateGame, dispatchGame, performSubActions, getImmEffects, getEffect, ANIMATION_SPEED, setLogItems, dataForReplay, setCurrentLogItem } = useContext(StateGameContext)
   const { stateBoard, dispatchBoard } = useContext(StateBoardContext)
   const { modals, setModals } = useContext(ModalsContext)
   const { type, id, user } = useContext(UserContext)
   const { sound } = useContext(SoundContext)

   const getLogDescription = (field) => {
      return field.name ? field.name : `THARSIS at coordinates x: ${field.x}, y: ${field.y}`
   }

   const handleClickField = async (field, tile, actions) => {
      // If clicked on unavailable field, do nothing
      if (!field.available) return

      const tileName = tile ? tile : stateGame.phasePlaceTileData
      const actionsLeft = actions ? actions : stateGame.actionsLeft

      // Update action (string) for log that is being performed
      funcUpdateLogItemAction(setLogItems, `coord${tileName}: ${field.x}, ${field.y}`)

      // Set field's object to phasePlaceTileData
      sound.objectPut.play()
      dispatchBoard({
         type: ACTIONS_BOARD.SET_OBJECT,
         payload: { x: field.x, y: field.y, name: field.name, obj: tileName },
      })
      funcSetLogItemsSingleActions(`${tileName} tile has been placed on ${getLogDescription(field)}`, tileName, null, setLogItems)
      // Below are only blue cards with any effect, that requires you as imm effect to place a tile
      // We need to save that info (effect is active) into the log
      if (modals.modalCard?.id === 20 || modals.modalCard?.id === 128 || modals.modalCard?.id === 200) {
         funcSetLogItemsSingleActions(`Effect from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
      }
      // Below are only blue cards with any action, that requires you as imm effect to place a tile
      // We need to save that info (action is active) into the log
      if (modals.modalCard?.id === 123 || modals.modalCard?.id === 199) {
         funcSetLogItemsSingleActions(`Action from ${modals.modalCard.name} card is now active`, null, null, setLogItems)
      }
      // Get Random Cards Ids
      let newCardsDrawIds
      if (field.bonus.includes(RESOURCES.CARD)) {
         newCardsDrawIds = await getNewCardsDrawIds(field.bonus.length, statePlayer, dispatchPlayer, type, id, user?.token, dataForReplay)
      }

      // Turn phasePlaceTile off
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA, payload: null })
      // Receive tile bonus
      let newPlants = type === MATCH_TYPES.REPLAY ? replayData.plants : statePlayer.resources.plant
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
                     funcSetLogItemsSingleActions(`Received ${countBonus} steel from board`, RESOURCES.STEEL, countBonus, setLogItems)
                     break
                  case RESOURCES.TITAN:
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_TITAN, payload: countBonus })
                     funcSetLogItemsSingleActions(`Received ${countBonus} titanium from board`, RESOURCES.TITAN, countBonus, setLogItems)
                     break
                  case RESOURCES.PLANT:
                     newPlants += countBonus
                     replayData.plants += countBonus
                     dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: countBonus })
                     funcSetLogItemsSingleActions(
                        countBonus === 1 ? 'Received 1 plant from board' : `Received ${countBonus} plants from board`,
                        RESOURCES.PLANT,
                        countBonus,
                        setLogItems
                     )
                     break
                  case RESOURCES.CARD:
                     if (type === MATCH_TYPES.REPLAY) {
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.ADD_CARDS_IN_HAND,
                           payload: [...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)],
                        })
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.ADD_CARDS_SEEN,
                           payload: [...getCards(newCardsDrawIds)],
                        })
                     } else {
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
                           payload: [...statePlayer.cardsInHand, ...getCardsWithDecreasedCost(getCardsWithTimeAdded(getCards(newCardsDrawIds)), statePlayer)],
                        })
                        dispatchPlayer({
                           type: ACTIONS_PLAYER.SET_CARDS_SEEN,
                           payload: [...statePlayer.cardsSeen, ...getCards(newCardsDrawIds)],
                        })
                     }
                     funcSetLogItemsSingleActions(
                        field.bonus.length === 1 ? 'Drew 1 card from board' : `Drew ${field.bonus.length} cards from board`,
                        RESOURCES.CARD,
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
            funcSetLogItemsSingleActions(`Received ${bonusMln} MC from board from oceans`, RESOURCES.MLN, bonusMln, setLogItems)
            endAnimation(setModals)
         }, delay)
      }

      // Receive steel / titan prod if tileName is mining rights or mining area
      if (tileName === TILES.SPECIAL_MINING_RIGHTS || tileName === TILES.SPECIAL_MINING_AREA) {
         let actionSteel = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.STEEL,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_STEEL, payload: 1 })
               funcSetLogItemsSingleActions('Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1, setLogItems)
            },
         }

         let actionTitan = {
            name: ANIMATIONS.PRODUCTION_IN,
            type: RESOURCES.TITAN,
            value: 1,
            func: () => {
               dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_PROD_TITAN, payload: 1 })
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
            },
         }

         if (field.bonus.includes(RESOURCES.STEEL)) {
            // Add this action to modals.modalProduction.miningRights / miningArea
            tileName === TILES.SPECIAL_MINING_RIGHTS
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
               funcSetLogItemsSingleActions('Steel production increased by 1', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1, setLogItems)
               endAnimation(setModals)
            }, delay)
         } else if (field.bonus.includes(RESOURCES.TITAN)) {
            // Add this action to modals.modalProduction.miningRights / miningArea
            tileName === TILES.SPECIAL_MINING_RIGHTS
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
               funcSetLogItemsSingleActions('Titanium production increased by 1', [RESOURCES.PROD_BG, RESOURCES.TITAN], 1, setLogItems)
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
            funcSetLogItemsSingleActions('Steel production increased by 1 from MINING GUILD effect', [RESOURCES.PROD_BG, RESOURCES.STEEL], 1, setLogItems)
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
               let newCards = getCardsWithDecreasedCost(
                  !field.bonus.includes(RESOURCES.CARD) ? statePlayer.cardsInHand : [...statePlayer.cardsInHand, ...getCardsWithTimeAdded(getCards(newCardsDrawIds))],
                  statePlayer,
                  EFFECTS.EFFECT_RESEARCH_OUTPOST
               )
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_IN_HAND, payload: newCards })
               // Modify Cards Played
               newCards = getCardsWithDecreasedCost(statePlayer.cardsPlayed, statePlayer, EFFECTS.EFFECT_RESEARCH_OUTPOST)
               dispatchPlayer({ type: ACTIONS_PLAYER.SET_CARDS_PLAYED, payload: newCards })
               // End animation
               endAnimation(setModals)
            }, delay)
         }
      }
      setTimeout(() => {
         // If NOT Phase After Gen14 is on
         if (!stateGame.phaseAfterGen14 && !replayData.phaseAfterGen14) {
            // Continue performing actions/effects
            startAnimation(setModals)
            performSubActions(actionsLeft, false, handleClickField)
         } else {
            // If there are still enough plants to convert
            if (newPlants >= statePlayer.valueGreenery) {
               // Decrease plants
               startAnimation(setModals)
               setAnimation(ANIMATIONS.RESOURCES_OUT, RESOURCES.PLANT, statePlayer.valueGreenery, setModals, sound)
               setTimeout(() => {
                  dispatchPlayer({ type: ACTIONS_PLAYER.CHANGE_RES_PLANT, payload: -statePlayer.valueGreenery })
                  replayData.plants = replayData.plants - statePlayer.valueGreenery
                  funcSetLogItemsSingleActions(
                     `Paid ${statePlayer.valueGreenery} plants in the final plant conversion phase`,
                     RESOURCES.PLANT,
                     -statePlayer.valueGreenery,
                     setLogItems
                  )
                  endAnimation(setModals)
               }, ANIMATION_SPEED)

               // Proper action + potential Herbivores
               let actions = [...actionsLeft, ...getImmEffects(IMM_EFFECTS.GREENERY_WO_OX)]
               if (statePlayer.cardsPlayed.some((card) => card.effect === EFFECTS.EFFECT_HERBIVORES)) actions = [...actions, ...getEffect(EFFECTS.EFFECT_HERBIVORES)]
               setTimeout(() => {
                  performSubActions(actions, false, handleClickField)
               }, ANIMATION_SPEED)
            } else {
               performSubActions(
                  [
                     ...actionsLeft,
                     {
                        name: ANIMATIONS.USER_INTERACTION,
                        type: REPLAY_USERINTERACTIONS.PLACETILE,
                        value: null,
                        func: () => {
                           setModals((prev) => ({ ...prev, endStats: true }))
                           // Turn off the ReplayAction phase and move to the next action
                           if (type === MATCH_TYPES.REPLAY) {
                              turnReplayActionOff(stateGame, dispatchGame, dataForReplay, setCurrentLogItem)
                           }
                        },
                     },
                  ],
                  false,
                  handleClickField
               )
            }
         }
      }, delay)
   }

   return { handleClickField }
}
