import { getThinerLogStateGame, getThinerLogStatePlayer } from '../utils/dataConversion'
import { SP } from './StandardProjects'
import logIconForcedTharsis from '../assets/images/other/logIconForcedActionTharsis.svg'
import logIconForcedInventrix from '../assets/images/other/logIconForcedActionInventrix.svg'
import logIconSellPatents from '../assets/images/other/logIconSellPatent.svg'
import logIconPowerPlant from '../assets/images/immEffects/immEffect_113.svg'
import logIconAsteroid from '../assets/images/other/logIconConvertHeat.svg'
import logIconAquifer from '../assets/images/immEffects/immEffect_127.svg'
import logIconGreenery from '../assets/images/other/logIconConvertPlants.svg'
import logIconCity from '../assets/images/other/logIconCity.svg'
import logIconTemperature from '../assets/images/other/logIconTemperature.svg'
import logIconOxygen from '../assets/images/other/logIconOxygen.svg'
import { ACTION_ICONS, getActionIcon } from './cardActions/actionIcons'
import { getImmEffectIcon } from './immEffects/immEffectsIcons'
import { RESOURCES, getResIcon } from './resources'
import { TILES, assignIconToTileData } from './board'

export const LOG_TYPES = {
   GENERATION: 'generation',
   DRAFT: 'draft',
   FORCED_ACTION: 'forced action',
   IMMEDIATE_EFFECT: 'immediate effect',
   CARD_ACTION: 'card action',
   CONVERT_PLANTS: 'convert plants',
   CONVERT_HEAT: 'convert heat',
   SP_ACTION: 'standard project action',
   PASS: 'pass action',
   FINAL_CONVERT_PLANTS: 'final convert plants',
}

export const LOG_ICONS = {
   FORCED_THARSIS: 'FORCED_THARSIS',
   FORCED_INVENTRIX: 'FORCED_INVENTRIX',
   SELL_PATENT: 'SELL_PATENT',
   CONVERT_PLANTS: 'CONVERT_PLANTS',
   CONVERT_HEAT: 'CONVERT_HEAT',
   TEMPERATURE: 'LOG_TEMPERATURE',
   OXYGEN: 'LOG_OXYGEN',
}

export const getIconForLog = (actionType) => {
   switch (actionType) {
      case LOG_ICONS.FORCED_THARSIS:
         return logIconForcedTharsis
      case LOG_ICONS.FORCED_INVENTRIX:
         return logIconForcedInventrix
      case LOG_ICONS.SELL_PATENT:
         return logIconSellPatents
      case ACTION_ICONS.ACTION_UNMI:
         return getActionIcon(actionType)
      case SP.POWER_PLANT:
         return logIconPowerPlant
      case SP.ASTEROID:
         return logIconAsteroid
      case SP.AQUIFER:
         return logIconAquifer
      case SP.GREENERY:
         return logIconGreenery
      case SP.CITY:
         return logIconCity
      case LOG_ICONS.CONVERT_PLANTS:
         return logIconGreenery
      case LOG_ICONS.CONVERT_HEAT:
         return logIconAsteroid
      default:
         return getImmEffectIcon(actionType)
   }
}

export const getResIconForLog = (type) => {
   switch (type) {
      case RESOURCES.MLN:
      case RESOURCES.STEEL:
      case RESOURCES.TITAN:
      case RESOURCES.PLANT:
      case RESOURCES.ENERGY:
      case RESOURCES.HEAT:
      case RESOURCES.CARD:
      case RESOURCES.MICROBE:
      case RESOURCES.ANIMAL:
      case RESOURCES.SCIENCE:
      case RESOURCES.FIGHTER:
      case RESOURCES.TR:
      case RESOURCES.PROD_BG:
         return getResIcon(type)
      case TILES.OCEAN:
      case TILES.GREENERY:
      case TILES.GREENERY_NEUTRAL:
      case TILES.CITY:
      case TILES.CITY_NEUTRAL:
      case TILES.SPECIAL_CITY_CAPITAL:
      case TILES.SPECIAL_NATURAL_PRESERVE:
      case TILES.SPECIAL_MINING_AREA:
      case TILES.SPECIAL_MINING_RIGHTS:
      case TILES.SPECIAL_COMMERCIAL_DISTRICT:
      case TILES.SPECIAL_NUCLEAR_ZONE:
      case TILES.SPECIAL_INDUSTRIAL_CENTER:
      case TILES.SPECIAL_ECOLOGICAL_ZONE:
      case TILES.SPECIAL_LAVA_FLOWS:
      case TILES.SPECIAL_MOHOLE_AREA:
      case TILES.SPECIAL_RESTRICTED_AREA:
         return assignIconToTileData(type)
      case LOG_ICONS.TEMPERATURE:
         return logIconTemperature
      case LOG_ICONS.OXYGEN:
         return logIconOxygen
      default:
         return
   }
}

export const funcCreateLogItem = (setLogItems, statePlayer, stateGame, logHeaders, setItemsExpanded) => {
   setLogItems((logItems) => [
      ...logItems,
      {
         ...logHeaders,
         details: {
            stateBefore: {
               statePlayer: getThinerLogStatePlayer(statePlayer),
               stateGame: getThinerLogStateGame(stateGame),
            },
            steps: [],
            stateAfter: {
               statePlayer: getThinerLogStatePlayer(statePlayer),
               stateGame: getThinerLogStateGame(stateGame),
            },
         },
      },
   ])
   setItemsExpanded((itemsExpanded) => [...itemsExpanded, false])
}

export const funcSetLogItemsSingleActions = (singleActionName, singleActionIconName, singleActionValue, setLogItems) => {
   setLogItems((logItems) => {
      const lastLogItem = logItems[logItems.length - 1]

      return [
         ...logItems.slice(0, -1),
         {
            ...lastLogItem,
            details: {
               ...lastLogItem.details,
               steps: [
                  ...(lastLogItem.details?.steps ? lastLogItem.details.steps : []),
                  {
                     singleActionName,
                     singleActionIconName,
                     singleActionValue,
                  },
               ],
            },
         },
      ]
   })
}

export const funcUpdateLastLogItemAfter = (setLogItems, statePlayer, stateGame) => {
   setLogItems((logItems) => {
      if (logItems.length === 1) {
         return logItems
      } else {
         const lastLogItem = logItems[logItems.length - 1]
         return [
            ...logItems.slice(0, -1),
            {
               ...lastLogItem,
               details: {
                  ...lastLogItem.details,
                  stateAfter: {
                     statePlayer: getThinerLogStatePlayer(statePlayer),
                     stateGame: getThinerLogStateGame(stateGame),
                  },
               },
            },
         ]
      }
   })
}

// Updates action name (a string that contains all neccessary info about what user clicked in the whole game action)
// of the latest log item
export const funcUpdateLogItemAction = (setLogItems, newActionPart) => {
   setLogItems((logItems) => {
      const lastLogItem = logItems[logItems.length - 1]
      let newLastLogItemAction = ''

      if (lastLogItem.action) {
         if (lastLogItem.action.slice(-1) === ']') {
            // In case of second MUtargetId, join both ids into one "MUtargetId: id2, id1"
            // In case of second option (possible only in case of viral enhancers effect against ecological zone), join both options into one "option: option2, option1"
            if (newActionPart.includes('MUtargetIds') && lastLogItem.action.includes('MUtargetIds')) {
               newLastLogItemAction = lastLogItem.action.replace('MUtargetIds: ', newActionPart + ', ')
            } else if (newActionPart.includes('option') && lastLogItem.action.includes('option')) {
               newLastLogItemAction = lastLogItem.action.replace('option: ', newActionPart + ', ')
            } else {
               newLastLogItemAction = lastLogItem.action.slice(0, -1) + '; ' + newActionPart + ']'
            }
         } else {
            newLastLogItemAction = lastLogItem.action + '[' + newActionPart + ']'
         }
      } else {
         newLastLogItemAction = newActionPart
      }
      return [...logItems.slice(0, -1), { ...lastLogItem, action: newLastLogItemAction }]
   })
}

export const funcCreateLogItemGeneration = (setLogItems, stateGame, setItemsExpanded) => {
   setLogItems((logItems) => [...logItems, { type: LOG_TYPES.GENERATION, title: `${stateGame.generation + 1}` }])
   setItemsExpanded((itemsExpanded) => [...itemsExpanded, false])
}
