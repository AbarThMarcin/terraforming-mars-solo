import { getThinerLogStateGame, getThinerLogStatePlayer } from '../../utils/misc'

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
