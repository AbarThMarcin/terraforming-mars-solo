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
}

export const funcSetLogItemsBefore = (setLogItems, statePlayer, stateGame, stateBoard, setItemsExpanded) => {
   setLogItems((logItems) => [
      ...logItems,
      {
         details: {
            stateBefore: {
               statePlayer,
               stateGame,
               stateBoard,
            },
         },
      },
   ])
   setItemsExpanded(itemsExpanded => [...itemsExpanded, false])
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

export const funcSetLogItemsAfter = (setLogItems, logData, logIcon, statePlayer, stateGame, stateBoard) => {
   if (logData) {
      setLogItems((logItems) => [
         ...logItems.slice(0, -1),
         {
            type: logData.type,
            data: { text: logData.text, icon: logIcon },
            details: {
               ...logItems[logItems.length - 1].details,
               stateAfter: {
                  statePlayer,
                  stateGame,
                  stateBoard,
               },
            },
         },
      ])
   }
}

export const funcSetLogItemsPass = (setLogItems) => {
   setLogItems((logItems) => [
      ...logItems.slice(0, -1),
      {
         ...logItems[logItems.length - 1],
         type: LOG_TYPES.PASS,
      },
   ])
}

export const funcSetLogItemsGeneration = (setLogItems, stateGame, setItemsExpanded) => {
   setLogItems((logItems) => [
      ...logItems,
      {
         type: LOG_TYPES.GENERATION,
         data: { text: `${stateGame.generation + 1}` },
      },
   ])
   setItemsExpanded(itemsExpanded => [...itemsExpanded, false])
}
