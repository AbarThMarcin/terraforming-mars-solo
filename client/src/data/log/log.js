import { getThinerLogStateGame, getThinerLogStatePlayer } from '../../utils/misc'
import { SP } from '../StandardProjects'
import logIconForcedTharsis from '../../assets/images/other/logIconForcedActionTharsis.svg'
import logIconForcedInventrix from '../../assets/images/other/logIconForcedActionInventrix.svg'
import logIconSellPatents from '../../assets/images/other/logIconSellPatent.svg'
import logIconPowerPlant from '../../assets/images/immEffects/immEffect_113.svg'
import logIconAsteroid from '../../assets/images/other/logIconConvertHeat.svg'
import logIconAquifer from '../../assets/images/immEffects/immEffect_127.svg'
import logIconGreenery from '../../assets/images/other/logIconConvertPlants.svg'
import logIconCity from '../../assets/images/other/logIconCity.svg'
import { ACTION_ICONS, getActionIcon } from '../cardActions/actionIcons'
import { getImmEffectIcon } from '../immEffects/immEffectsIcons'

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
}

export const funcCreateLogItem = (setLogItems, statePlayer, stateGame, logData, logIcon, setItemsExpanded) => {
   setLogItems((logItems) => [
      ...logItems,
      {
         type: logData.type,
         data: { text: logData.text, icon: logIcon, gen: logData.gen ? logData.gen : undefined },
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
   setLogItems((logItems) => [
      ...logItems.slice(0, -1),
      {
         ...logItems[logItems.length - 1],
         details: {
            ...logItems[logItems.length - 1].details,
            steps: [
               ...(logItems[logItems.length - 1].details?.steps ? logItems[logItems.length - 1].details.steps : []),
               {
                  singleActionName,
                  singleActionIconName,
                  singleActionValue,
               },
            ],
         },
      },
   ])
}

export const funcUpdateLastLogItemAfter = (setLogItems, statePlayer, stateGame) => {
   setLogItems((logItems) => [
      ...logItems.slice(0, -1),
      {
         ...logItems[logItems.length - 1],
         details: {
            ...logItems[logItems.length - 1].details,
            stateAfter: {
               statePlayer: getThinerLogStatePlayer(statePlayer),
               stateGame: getThinerLogStateGame(stateGame),
            },
         },
      },
   ])
}

export const funcCreateLogItemGeneration = (setLogItems, stateGame, setItemsExpanded) => {
   setLogItems((logItems) => [
      ...logItems,
      {
         type: LOG_TYPES.GENERATION,
         data: { text: `${stateGame.generation + 1}` },
      },
   ])
   setItemsExpanded((itemsExpanded) => [...itemsExpanded, false])
}

export const getIconForLog = (actionType) => {
   switch (actionType) {
      case LOG_ICONS.FORCED_THARSIS:
         return logIconForcedTharsis
      case LOG_ICONS.FORCED_INVENTRIX:
         return logIconForcedInventrix
      case LOG_ICONS.SELL_PATENT:
         return logIconSellPatents
      case '1':
         return
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
