export const ACTIONS_BOARD = {
   // Test
   TEST: 'Test',
}

export const reducerBoard = (state, action) => {
   switch (action.type) {
      /* NEXT GENERATION */
      case ACTIONS_BOARD.TEST:
         return state
      default:
         return state
   }
}
